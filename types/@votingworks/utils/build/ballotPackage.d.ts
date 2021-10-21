/// <reference types="node" />
/// <reference types="kiosk-browser" />
import { BallotStyle, Contest, ElectionDefinition, Precinct, BallotLocales } from '@votingworks/types';
import 'fast-text-encoding';
export interface BallotPackage {
    electionDefinition: ElectionDefinition;
    ballots: BallotPackageEntry[];
}
export interface BallotPackageEntry {
    pdf: Buffer;
    ballotConfig: BallotConfig;
}
export interface BallotPackageManifest {
    ballots: readonly BallotConfig[];
}
export interface BallotStyleData {
    ballotStyleId: BallotStyle['id'];
    contestIds: Contest['id'][];
    precinctId: Precinct['id'];
}
export interface BallotConfig extends BallotStyleData {
    filename: string;
    locales: BallotLocales;
    isLiveMode: boolean;
}
declare function readBallotPackageFromFile(file: File): Promise<BallotPackage>;
declare function readBallotPackageFromFilePointer(file: KioskBrowser.FileSystemEntry): Promise<BallotPackage>;
export declare const ballotPackageUtils: {
    readBallotPackageFromFile: typeof readBallotPackageFromFile;
    readBallotPackageFromFilePointer: typeof readBallotPackageFromFilePointer;
};
export {};
