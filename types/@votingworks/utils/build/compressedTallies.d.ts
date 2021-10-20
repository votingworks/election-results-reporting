import { Dictionary, Election, Tally, CompressedTally } from '@votingworks/types';
/**
 * A compressed tally
 */
export declare const compressTally: (election: Election, tally: Tally) => CompressedTally;
export declare const readCompressedTally: (election: Election, serializedTally: CompressedTally, totalBallotCount: number, ballotCountsByVotingMethod: Dictionary<number>) => Tally;
