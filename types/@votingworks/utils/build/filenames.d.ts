import { Election, ElectionDefinition } from '@votingworks/types';
export declare const BALLOT_PACKAGE_FOLDER = "ballot-packages";
export declare const SCANNER_RESULTS_FOLDER = "cast-vote-records";
export declare const SCANNER_BACKUPS_FOLDER = "scanner-backups";
export declare type ElectionData = {
    electionCounty: string;
    electionName: string;
    electionHash: string;
    timestamp: Date;
};
export declare type CVRFileData = {
    machineId: string;
    numberOfBallots: number;
    isTestModeResults: boolean;
    timestamp: Date;
};
/**
 * Convert an auto-generated name of the ballot configuration package zip archive
 * to the pieces of data contained in the name.
 */
export declare function parseBallotExportPackageInfoFromFilename(filename: string): ElectionData | undefined;
export declare function generateElectionBasedSubfolderName(election: Election, electionHash: string): string;
/**
 * Generate the filename for the scanning results CVR file
 */
export declare function generateFilenameForScanningResults(machineId: string, numBallotsScanned: number, isTestMode: boolean, time?: Date): string;
export declare function parseCVRFileInfoFromFilename(filename: string): CVRFileData | undefined;
export declare function getElectionDataFromElectionDefinition(electionDefinition: ElectionDefinition, timestamp: Date): ElectionData;
export declare function generateFilenameForBallotExportPackageFromElectionData({ electionName, electionCounty, electionHash, timestamp, }: ElectionData): string;
export declare function generateFilenameForBallotExportPackage(electionDefinition: ElectionDefinition, time?: Date): string;
export declare function generateFinalExportDefaultFilename(isTestModeResults: boolean, election: Election, time?: Date): string;
/**
 * Generates a filename for the tally results CSV broken down by batch.
 * @param isTestModeResults Boolean representing if the results are testmode or livemode
 * @param election Election object we are generating the filename for
 * @param time Optional for the time we are generating the filename, defaults to the current time.
 * @returns string filename i.e. "votingworks-live-batch-results_election-name_timestamp.csv"
 */
export declare function generateBatchResultsDefaultFilename(isTestModeResults: boolean, election: Election, time?: Date): string;
