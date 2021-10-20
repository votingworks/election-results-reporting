import { Contests, Dictionary, Election, Tally, VotesDict } from '@votingworks/types';
import { CompressedTally, SerializedTally } from './types';
export declare const combineTallies: (election: Election, tally1: SerializedTally, tally2: SerializedTally) => SerializedTally;
interface Params {
    election: Election;
    tally: SerializedTally;
    votes: VotesDict;
    contests: Contests;
}
export declare const getZeroTally: (election: Election) => SerializedTally;
export declare const computeTallyForEitherNeitherContests: ({ election, tally, votes, contests, }: Params) => SerializedTally;
export declare const calculateTally: ({ election, tally: prevTally, votes, ballotStyleId, }: {
    election: Election;
    tally: SerializedTally;
    votes: VotesDict;
    ballotStyleId: string;
}) => SerializedTally;
/**
 * Convert a Tally object into a SerializedTally object for storage.
 */
export declare const serializeTally: (election: Election, tally: Tally) => SerializedTally;
/**
 * A compressed tally
 */
export declare const compressTally: (election: Election, tally: Tally) => CompressedTally;
export declare const readSerializedTally: (election: Election, serializedTally: SerializedTally, totalBallotCount: number, ballotCountsByVotingMethod: Dictionary<number>) => Tally;
export {};
