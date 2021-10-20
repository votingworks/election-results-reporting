"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBatchResultsDefaultFilename = exports.generateFinalExportDefaultFilename = exports.generateFilenameForBallotExportPackage = exports.generateFilenameForBallotExportPackageFromElectionData = exports.getElectionDataFromElectionDefinition = exports.parseCVRFileInfoFromFilename = exports.generateFilenameForScanningResults = exports.generateElectionBasedSubfolderName = exports.parseBallotExportPackageInfoFromFilename = exports.SCANNER_BACKUPS_FOLDER = exports.SCANNER_RESULTS_FOLDER = exports.BALLOT_PACKAGE_FOLDER = void 0;
const assert_1 = require("assert");
const moment_1 = __importDefault(require("moment"));
const types_1 = require("@votingworks/types");
const SECTION_SEPARATOR = '__';
const SUBSECTION_SEPARATOR = '_';
const WORD_SEPARATOR = '-';
const TIME_FORMAT_STRING = `YYYY${WORD_SEPARATOR}MM${WORD_SEPARATOR}DD${SUBSECTION_SEPARATOR}HH${WORD_SEPARATOR}mm${WORD_SEPARATOR}ss`;
exports.BALLOT_PACKAGE_FOLDER = 'ballot-packages';
exports.SCANNER_RESULTS_FOLDER = 'cast-vote-records';
exports.SCANNER_BACKUPS_FOLDER = 'scanner-backups';
function sanitizeString(input, { replaceInvalidCharsWith = '', defaultValue = 'placeholder' } = {}) {
    const sanitized = input
        .replace(/[^a-z0-9]+/gi, replaceInvalidCharsWith)
        .replace(/(^-|-$)+/g, '')
        .toLocaleLowerCase();
    return sanitized.trim().length === 0 ? defaultValue : sanitized;
}
/**
 * Convert an auto-generated name of the ballot configuration package zip archive
 * to the pieces of data contained in the name.
 */
function parseBallotExportPackageInfoFromFilename(filename) {
    // There should be two underscores separating the timestamp from the election information
    const segments = filename.split(SECTION_SEPARATOR);
    if (segments.length !== 2) {
        return;
    }
    const [electionString, timeString] = segments;
    assert_1.strict(typeof electionString !== 'undefined');
    let electionSegments = electionString.split(SUBSECTION_SEPARATOR);
    if (electionSegments.length !== 3) {
        return;
    }
    electionSegments = electionSegments.map((s) => s.replace(/-/g, ' '));
    const [electionCounty, electionName, electionHash] = electionSegments;
    assert_1.strict(typeof electionCounty !== 'undefined');
    assert_1.strict(typeof electionName !== 'undefined');
    assert_1.strict(typeof electionHash !== 'undefined');
    const parsedTime = moment_1.default(timeString, TIME_FORMAT_STRING);
    return {
        electionCounty,
        electionName,
        electionHash,
        timestamp: parsedTime.toDate(),
    };
}
exports.parseBallotExportPackageInfoFromFilename = parseBallotExportPackageInfoFromFilename;
function generateElectionBasedSubfolderName(election, electionHash) {
    const electionCountyName = sanitizeString(election.county.name, {
        replaceInvalidCharsWith: WORD_SEPARATOR,
        defaultValue: 'county',
    });
    const electionTitle = sanitizeString(election.title, {
        replaceInvalidCharsWith: WORD_SEPARATOR,
        defaultValue: 'election',
    });
    return `${`${electionCountyName}${SUBSECTION_SEPARATOR}${electionTitle}`.toLocaleLowerCase()}${SUBSECTION_SEPARATOR}${electionHash.slice(0, 10)}`;
}
exports.generateElectionBasedSubfolderName = generateElectionBasedSubfolderName;
/**
 * Generate the filename for the scanning results CVR file
 */
function generateFilenameForScanningResults(machineId, numBallotsScanned, isTestMode, time = new Date()) {
    var _a;
    const machineString = `machine${SUBSECTION_SEPARATOR}${(_a = types_1.safeParse(types_1.MachineId, machineId).ok()) !== null && _a !== void 0 ? _a : sanitizeString(machineId)}`;
    const ballotString = `${numBallotsScanned}${SUBSECTION_SEPARATOR}ballots`;
    const timeInformation = moment_1.default(time).format(TIME_FORMAT_STRING);
    const filename = `${machineString}${SECTION_SEPARATOR}${ballotString}${SECTION_SEPARATOR}${timeInformation}.jsonl`;
    return isTestMode ? `TEST${SECTION_SEPARATOR}${filename}` : filename;
}
exports.generateFilenameForScanningResults = generateFilenameForScanningResults;
/* Extract information about a CVR file from the filename */
function parseCVRFileInfoFromFilename(filename) {
    const segments = filename.split(SECTION_SEPARATOR);
    const isTestModeResults = segments.length === 4 && segments[0] === 'TEST';
    const postTestPrefixSegments = isTestModeResults
        ? segments.slice(1)
        : segments;
    if (postTestPrefixSegments.length !== 3) {
        return;
    }
    assert_1.strict(typeof postTestPrefixSegments[0] !== 'undefined');
    const machineSegments = postTestPrefixSegments[0].split(SUBSECTION_SEPARATOR);
    if (machineSegments.length !== 2 || machineSegments[0] !== 'machine') {
        return;
    }
    const machineId = machineSegments[1];
    assert_1.strict(typeof machineId !== 'undefined');
    assert_1.strict(typeof postTestPrefixSegments[1] !== 'undefined');
    const ballotSegments = postTestPrefixSegments[1].split(SUBSECTION_SEPARATOR);
    if (ballotSegments.length !== 2 || ballotSegments[1] !== 'ballots') {
        return;
    }
    const numberOfBallots = Number(ballotSegments[0]);
    const parsedTime = moment_1.default(postTestPrefixSegments[2], TIME_FORMAT_STRING);
    return {
        machineId,
        numberOfBallots,
        isTestModeResults,
        timestamp: parsedTime.toDate(),
    };
}
exports.parseCVRFileInfoFromFilename = parseCVRFileInfoFromFilename;
/* Get the name of an election to use in a filename from the Election object */
function generateElectionName(election) {
    const electionCountyName = sanitizeString(election.county.name, {
        replaceInvalidCharsWith: WORD_SEPARATOR,
        defaultValue: 'county',
    });
    const electionTitle = sanitizeString(election.title, {
        replaceInvalidCharsWith: WORD_SEPARATOR,
        defaultValue: 'election',
    });
    return `${electionCountyName}${SUBSECTION_SEPARATOR}${electionTitle}`;
}
function getElectionDataFromElectionDefinition(electionDefinition, timestamp) {
    return {
        electionCounty: electionDefinition.election.county.name,
        electionHash: electionDefinition.electionHash,
        electionName: electionDefinition.election.title,
        timestamp,
    };
}
exports.getElectionDataFromElectionDefinition = getElectionDataFromElectionDefinition;
function generateFilenameForBallotExportPackageFromElectionData({ electionName, electionCounty, electionHash, timestamp, }) {
    const electionCountyName = sanitizeString(electionCounty, {
        replaceInvalidCharsWith: WORD_SEPARATOR,
        defaultValue: 'county',
    });
    const electionTitle = sanitizeString(electionName, {
        replaceInvalidCharsWith: WORD_SEPARATOR,
        defaultValue: 'election',
    });
    const electionInformation = `${electionCountyName}${SUBSECTION_SEPARATOR}${electionTitle}${SUBSECTION_SEPARATOR}${electionHash.slice(0, 10)}`;
    const timeInformation = moment_1.default(timestamp).format(TIME_FORMAT_STRING);
    return `${electionInformation}${SECTION_SEPARATOR}${timeInformation}.zip`;
}
exports.generateFilenameForBallotExportPackageFromElectionData = generateFilenameForBallotExportPackageFromElectionData;
/* Generate the name for a ballot export package */
function generateFilenameForBallotExportPackage(electionDefinition, time = new Date()) {
    return generateFilenameForBallotExportPackageFromElectionData(getElectionDataFromElectionDefinition(electionDefinition, time));
}
exports.generateFilenameForBallotExportPackage = generateFilenameForBallotExportPackage;
/* Generate the filename for final results export from election manager */
function generateFinalExportDefaultFilename(isTestModeResults, election, time = new Date()) {
    const filemode = isTestModeResults ? 'test' : 'live';
    const timeInformation = moment_1.default(time).format(TIME_FORMAT_STRING);
    const electionName = generateElectionName(election);
    return `votingworks${WORD_SEPARATOR}${filemode}${WORD_SEPARATOR}results${SUBSECTION_SEPARATOR}${electionName}${SUBSECTION_SEPARATOR}${timeInformation}.csv`;
}
exports.generateFinalExportDefaultFilename = generateFinalExportDefaultFilename;
/**
 * Generates a filename for the tally results CSV broken down by batch.
 * @param isTestModeResults Boolean representing if the results are testmode or livemode
 * @param election Election object we are generating the filename for
 * @param time Optional for the time we are generating the filename, defaults to the current time.
 * @returns string filename i.e. "votingworks-live-batch-results_election-name_timestamp.csv"
 */
function generateBatchResultsDefaultFilename(isTestModeResults, election, time = new Date()) {
    const filemode = isTestModeResults ? 'test' : 'live';
    const timeInformation = moment_1.default(time).format(TIME_FORMAT_STRING);
    const electionName = generateElectionName(election);
    return `votingworks${WORD_SEPARATOR}${filemode}${WORD_SEPARATOR}batch-results${SUBSECTION_SEPARATOR}${electionName}${SUBSECTION_SEPARATOR}${timeInformation}.csv`;
}
exports.generateBatchResultsDefaultFilename = generateBatchResultsDefaultFilename;
