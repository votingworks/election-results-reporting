import { z } from 'zod';
import { CastVoteRecord } from './castVoteRecord';
import { Contest, Candidate } from './election';
import { Dictionary, Optional } from './generic';
export declare type YesNoVoteID = 'yes' | 'no';
export declare type YesNoVoteOption = ['yes'] | ['no'] | [];
export declare type ContestVoteOption = Candidate | YesNoVoteOption;
export interface YesNoContestOptionTally {
    readonly option: YesNoVoteOption;
    readonly tally: number;
}
export interface ContestOptionTally {
    readonly option: ContestVoteOption;
    readonly tally: number;
}
export interface ContestTally {
    readonly contest: Contest;
    readonly tallies: Dictionary<ContestOptionTally>;
    readonly metadata: ContestTallyMeta;
}
export interface ContestTallyMeta {
    readonly overvotes: number;
    readonly undervotes: number;
    readonly ballots: number;
}
export declare type ContestTallyMetaDictionary = Dictionary<ContestTallyMeta>;
export interface Tally {
    readonly numberOfBallotsCounted: number;
    readonly castVoteRecords: Set<CastVoteRecord>;
    readonly contestTallies: Dictionary<ContestTally>;
    readonly ballotCountsByVotingMethod: Dictionary<number>;
}
export interface BatchTally extends Tally {
    readonly batchLabel: string;
    readonly scannerIds: string[];
}
export declare enum TallyCategory {
    Precinct = "precinct",
    Scanner = "scanner",
    Party = "party",
    VotingMethod = "votingmethod",
    Batch = "batch"
}
export interface FullElectionTally {
    readonly overallTally: Tally;
    readonly resultsByCategory: ReadonlyMap<TallyCategory, Dictionary<Tally>>;
}
export interface ExternalTally {
    readonly contestTallies: Dictionary<ContestTally>;
    readonly numberOfBallotsCounted: number;
}
export declare enum ExternalTallySourceType {
    SEMS = "sems",
    Manual = "manual-data"
}
export declare enum VotingMethod {
    Absentee = "absentee",
    Precinct = "standard",
    Unknown = "unknown"
}
export interface FullElectionExternalTally {
    readonly overallTally: ExternalTally;
    readonly resultsByCategory: ReadonlyMap<TallyCategory, Dictionary<ExternalTally>>;
    readonly votingMethod: VotingMethod;
    readonly source: ExternalTallySourceType;
    readonly inputSourceName: string;
    readonly timestampCreated: Date;
}
export declare type OptionalExternalTally = Optional<ExternalTally>;
export declare type OptionalFullElectionTally = Optional<FullElectionTally>;
export declare type OptionalFullElectionExternalTally = Optional<FullElectionExternalTally>;
export declare type CompressedTally = number[][];
export declare const CompressedTallySchema: z.ZodSchema<CompressedTally>;
