import { Candidate, CandidateContest, CastVoteRecord, ContestTally, Dictionary, Election, Tally, VotesDict, VotingMethod, YesNoContest, YesNoVote, YesNoVoteID, YesOrNo } from '@votingworks/types';
export declare function getSingleYesNoVote(vote?: YesNoVote): YesOrNo | undefined;
export declare const writeInCandidate: Candidate;
export declare function normalizeWriteInId(candidateId: string): string;
export declare const buildVoteFromCvr: ({ election, cvr, }: {
    election: Election;
    cvr: CastVoteRecord;
}) => VotesDict;
/**
 * Gets all the vote options a voter can make for a given yes/no contest.
 */
export declare function getContestVoteOptionsForYesNoContest(contest: YesNoContest): readonly YesNoVoteID[];
/**
 * Gets all the vote options a voter can make for a given contest. If write-ins are allowed a single write-in candidate ID is included.
 * @returns ContestVoteOption[] ex. ['yes', 'no'] or ['aaron', 'bob', '__write-in']
 */
export declare function getContestVoteOptionsForCandidateContest(contest: CandidateContest): readonly Candidate[];
export declare function getVotingMethodForCastVoteRecord(CVR: CastVoteRecord): VotingMethod;
interface TallyParams {
    election: Election;
    votes: VotesDict[];
    filterContestsByParty?: string;
}
export declare function tallyVotesByContest({ election, votes, filterContestsByParty, }: TallyParams): Dictionary<ContestTally>;
export declare function calculateTallyForCastVoteRecords(election: Election, castVoteRecords: Set<CastVoteRecord>, filterContestsByParty?: string): Tally;
export {};
