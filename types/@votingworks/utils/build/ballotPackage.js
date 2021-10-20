"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ballotPackageUtils = void 0;
const assert_1 = require("assert");
const types_1 = require("@votingworks/types");
require("fast-text-encoding");
const yauzl_1 = require("yauzl");
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        /* istanbul ignore next */
        reader.onerror = () => {
            reject(reader.error);
        };
        reader.onload = () => {
            resolve(Buffer.from(reader.result));
        };
        reader.readAsArrayBuffer(file);
    });
}
function openZip(data) {
    return new Promise((resolve, reject) => {
        yauzl_1.fromBuffer(Buffer.from(data), { lazyEntries: true, validateEntrySizes: true }, (error, zipfile) => {
            if (error || !zipfile) {
                reject(error);
            }
            else {
                resolve(zipfile);
            }
        });
    });
}
function getEntries(zipfile) {
    return new Promise((resolve, reject) => {
        const entries = [];
        zipfile
            .on('entry', (entry) => {
            entries.push(entry);
            zipfile.readEntry();
        })
            .on('end', () => {
            resolve(entries);
        })
            .on('error', 
        /* istanbul ignore next */
        (error) => {
            reject(error);
        })
            .readEntry();
    });
}
async function readEntry(zipfile, entry) {
    const stream = await new Promise((resolve, reject) => {
        zipfile.openReadStream(entry, (error, value) => {
            /* istanbul ignore else */
            if (!error && value) {
                resolve(value);
            }
            else {
                reject(error);
            }
        });
    });
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream
            .on('data', (chunk) => {
            chunks.push(chunk);
        })
            .on('end', () => {
            resolve(Buffer.concat(chunks));
        })
            .on('error', 
        /* istanbul ignore next */
        (error) => {
            reject(error);
        });
    });
}
async function readTextEntry(zipfile, entry) {
    const bytes = await readEntry(zipfile, entry);
    return new TextDecoder().decode(bytes);
}
async function readJSONEntry(zipfile, entry) {
    return JSON.parse(await readTextEntry(zipfile, entry));
}
async function readBallotPackageFromZip(zipfile, fileName, fileSize) {
    const entries = await getEntries(zipfile);
    const electionEntry = entries.find((entry) => entry.fileName === 'election.json');
    const manifestEntry = entries.find((entry) => entry.fileName === 'manifest.json');
    if (!electionEntry) {
        throw new Error(`ballot package does not have a file called 'election.json': ${fileName} (size=${fileSize})`);
    }
    if (!manifestEntry) {
        throw new Error(`ballot package does not have a file called 'manifest.json': ${fileName} (size=${fileSize})`);
    }
    const electionData = await readTextEntry(zipfile, electionEntry);
    const manifest = await readJSONEntry(zipfile, manifestEntry);
    const ballots = [];
    for (const entry of entries) {
        const ballotConfig = manifest.ballots.find((b) => b.filename === entry.fileName);
        if (ballotConfig) {
            ballots.push({
                ballotConfig,
                pdf: await readEntry(zipfile, entry),
            });
        }
    }
    if (ballots.length !== manifest.ballots.length) {
        throw new Error(`ballot package is malformed; found ${ballots.length} file(s) matching entries in the manifest ('manifest.json'), but the manifest has ${manifest.ballots.length}. perhaps this ballot package is using a different version of the software?`);
    }
    return {
        electionDefinition: types_1.safeParseElectionDefinition(electionData).unsafeUnwrap(),
        ballots,
    };
}
async function readBallotPackageFromFile(file) {
    const zipFile = await openZip(await readFile(file));
    return readBallotPackageFromZip(zipFile, file.name, file.size);
}
async function readBallotPackageFromFilePointer(file) {
    assert_1.strict(window.kiosk);
    const zipFile = await openZip(await window.kiosk.readFile(file.path));
    return readBallotPackageFromZip(zipFile, file.name, file.size);
}
exports.ballotPackageUtils = {
    readBallotPackageFromFile,
    readBallotPackageFromFilePointer,
};
