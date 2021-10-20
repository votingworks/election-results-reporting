"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTallyForCastVoteRecords = exports.tallyVotesByContest = exports.getVotingMethodForCastVoteRecord = exports.getContestVoteOptionsForCandidateContest = exports.getContestVoteOptionsForYesNoContest = exports.buildVoteFromCvr = exports.normalizeWriteInId = exports.writeInCandidate = exports.getSingleYesNoVote = void 0;
const types_1 = require("@votingworks/types");
const assert_1 = require("assert");
const find_1 = require("./find");
function getSingleYesNoVote(vote) {
    if ((vote === null || vote === void 0 ? void 0 : vote.length) === 1) {
        return vote[0];
    }
    return undefined;
}
exports.getSingleYesNoVote = getSingleYesNoVote;
exports.writeInCandidate = {
    id: '__write-in',
    name: 'Write-In',
    isWriteIn: true,
};
function normalizeWriteInId(candidateId) {
    if (candidateId.startsWith('__writein') ||
        candidateId.startsWith('__write-in') ||
        candidateId.startsWith('writein') ||
        candidateId.startsWith('write-in')) {
        return exports.writeInCandidate.id;
    }
    return candidateId;
}
exports.normalizeWriteInId = normalizeWriteInId;
const buildVoteFromCvr = ({ election, cvr, }) => {
    const vote = {};
    const mutableCVR = { ...cvr };
    // If the CVR is malformed for this question -- only one of the pair'ed contest IDs
    // is there -- we don't want to count this as a ballot in this contest.
    for (const c of types_1.getEitherNeitherContests(election.contests)) {
        const hasEitherNeither = mutableCVR[c.eitherNeitherContestId] !== undefined;
        const hasPickOne = mutableCVR[c.pickOneContestId] !== undefined;
        if (!(hasEitherNeither && hasPickOne)) {
            mutableCVR[c.eitherNeitherContestId] = undefined;
            mutableCVR[c.pickOneContestId] = undefined;
        }
    }
    for (const contest of types_1.expandEitherNeitherContests(election.contests)) {
        if (!mutableCVR[contest.id]) {
            continue;
        }
        if (contest.type === 'yesno') {
            // the CVR is encoded the same way
            vote[contest.id] = mutableCVR[contest.id];
            continue;
        }
        /* istanbul ignore else */
        if (contest.type === 'candidate') {
            vote[contest.id] = mutableCVR[contest.id]
                .map((candidateId) => normalizeWriteInId(candidateId))
                .map((candidateId) => find_1.find([exports.writeInCandidate, ...contest.candidates], (c) => c.id === candidateId));
        }
    }
    return vote;
};
exports.buildVoteFromCvr = buildVoteFromCvr;
/**
 * Gets all the vote options a voter can make for a given yes/no contest.
 */
function getContestVoteOptionsForYesNoContest(contest) {
    assert_1.strict.equal(contest.type, 'yesno');
    return ['yes', 'no'];
}
exports.getContestVoteOptionsForYesNoContest = getContestVoteOptionsForYesNoContest;
/**
 * Gets all the vote options a voter can make for a given contest. If write-ins are allowed a single write-in candidate ID is included.
 * @returns ContestVoteOption[] ex. ['yes', 'no'] or ['aaron', 'bob', '__write-in']
 */
function getContestVoteOptionsForCandidateContest(contest) {
    const options = contest.candidates;
    if (contest.allowWriteIns) {
        return options.concat(exports.writeInCandidate);
    }
    return options;
}
exports.getContestVoteOptionsForCandidateContest = getContestVoteOptionsForCandidateContest;
function getVotingMethodForCastVoteRecord(CVR) {
    return Object.values(types_1.VotingMethod).includes(CVR._ballotType)
        ? CVR._ballotType
        : types_1.VotingMethod.Unknown;
}
exports.getVotingMethodForCastVoteRecord = getVotingMethodForCastVoteRecord;
function tallyVotesByContest({ election, votes, filterContestsByParty, }) {
    const contestTallies = {};
    const { contests } = election;
    const districtsForParty = filterContestsByParty
        ? types_1.getDistrictIdsForPartyId(election, filterContestsByParty)
        : [];
    for (const contest of types_1.expandEitherNeitherContests(contests)) {
        if (filterContestsByParty === undefined ||
            (districtsForParty.includes(contest.districtId) &&
                contest.partyId === filterContestsByParty)) {
            const tallies = {};
            if (contest.type === 'yesno') {
                tallies.yes = { option: ['yes'], tally: 0 };
                tallies.no = { option: ['no'], tally: 0 };
            }
            if (contest.type === 'candidate') {
                for (const candidate of contest.candidates) {
                    tallies[candidate.id] = { option: candidate, tally: 0 };
                }
                if (contest.allowWriteIns) {
                    tallies[exports.writeInCandidate.id] = { option: exports.writeInCandidate, tally: 0 };
                }
            }
            let numberOfUndervotes = 0;
            let numberOfOvervotes = 0;
            let numberOfVotes = 0;
            for (const vote of votes) {
                const selected = vote[contest.id];
                if (!selected) {
                    continue;
                }
                numberOfVotes += 1;
                // overvotes & undervotes
                const maxSelectable = contest.type === 'yesno' ? 1 : contest.seats;
                if (selected.length > maxSelectable) {
                    numberOfOvervotes += maxSelectable;
                    continue;
                }
                if (selected.length < maxSelectable) {
                    numberOfUndervotes += maxSelectable - selected.length;
                }
                if (selected.length === 0) {
                    continue;
                }
                if (contest.type === 'yesno') {
                    const optionId = selected[0];
                    const optionTally = tallies[optionId];
                    assert_1.strict(optionTally);
                    tallies[optionId] = {
                        option: optionTally.option,
                        tally: optionTally.tally + 1,
                    };
                }
                else {
                    for (const selectedOption of selected) {
                        const optionTally = tallies[selectedOption.id];
                        assert_1.strict(optionTally);
                        tallies[selectedOption.id] = {
                            option: optionTally.option,
                            tally: optionTally.tally + 1,
                        };
                    }
                }
            }
            const metadataForContest = {
                undervotes: numberOfUndervotes,
                overvotes: numberOfOvervotes,
                ballots: numberOfVotes,
            };
            contestTallies[contest.id] = {
                contest,
                tallies,
                metadata: metadataForContest,
            };
        }
    }
    return contestTallies;
}
exports.tallyVotesByContest = tallyVotesByContest;
function calculateTallyForCastVoteRecords(election, castVoteRecords, filterContestsByParty) {
    const allVotes = [];
    const ballotCountsByVotingMethod = {};
    for (const votingMethod of Object.values(types_1.VotingMethod)) {
        ballotCountsByVotingMethod[votingMethod] = 0;
    }
    for (const CVR of castVoteRecords) {
        const vote = exports.buildVoteFromCvr({ election, cvr: CVR });
        const votingMethod = getVotingMethodForCastVoteRecord(CVR);
        const count = ballotCountsByVotingMethod[votingMethod];
        assert_1.strict(typeof count !== 'undefined');
        ballotCountsByVotingMethod[votingMethod] = count + 1;
        allVotes.push(vote);
    }
    const overallTally = tallyVotesByContest({
        election,
        votes: allVotes,
        filterContestsByParty,
    });
    return {
        contestTallies: overallTally,
        castVoteRecords,
        numberOfBallotsCounted: allVotes.length,
        ballotCountsByVotingMethod,
    };
}
exports.calculateTallyForCastVoteRecords = calculateTallyForCastVoteRecords;
