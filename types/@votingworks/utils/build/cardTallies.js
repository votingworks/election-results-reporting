"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSerializedTally = exports.compressTally = exports.serializeTally = exports.calculateTally = exports.computeTallyForEitherNeitherContests = exports.getZeroTally = exports.combineTallies = void 0;
const types_1 = require("@votingworks/types");
const assert_1 = require("assert");
const iterators_1 = require("./iterators");
const throwIllegalValue_1 = require("./throwIllegalValue");
const votes_1 = require("./votes");
const combineCandidateTallies = (tally1, tally2) => ({
    candidates: [
        ...iterators_1.map(iterators_1.zip(tally1.candidates, tally2.candidates), ([candidateTally1, candidateTally2]) => candidateTally1 + candidateTally2),
    ],
    undervotes: tally1.undervotes + tally2.undervotes,
    overvotes: tally1.overvotes + tally2.overvotes,
    writeIns: tally1.writeIns + tally2.writeIns,
    ballotsCast: tally1.ballotsCast + tally2.ballotsCast,
});
const combineYesNoTallies = (tally1, tally2) => {
    return {
        yes: tally1.yes + tally2.yes,
        no: tally1.no + tally2.no,
        overvotes: tally1.overvotes + tally2.overvotes,
        undervotes: tally1.undervotes + tally2.undervotes,
        ballotsCast: tally1.ballotsCast + tally2.ballotsCast,
    };
};
const combineEitherNeitherTallies = (tally1, tally2) => {
    return {
        eitherOption: tally1.eitherOption + tally2.eitherOption,
        neitherOption: tally1.neitherOption + tally2.neitherOption,
        eitherNeitherUndervotes: tally1.eitherNeitherUndervotes + tally2.eitherNeitherUndervotes,
        eitherNeitherOvervotes: tally1.eitherNeitherOvervotes + tally2.eitherNeitherOvervotes,
        firstOption: tally1.firstOption + tally2.firstOption,
        secondOption: tally1.secondOption + tally2.secondOption,
        pickOneUndervotes: tally1.pickOneUndervotes + tally2.pickOneUndervotes,
        pickOneOvervotes: tally1.pickOneOvervotes + tally2.pickOneOvervotes,
        ballotsCast: tally1.ballotsCast + tally2.ballotsCast,
    };
};
const combineTallies = (election, tally1, tally2) => {
    assert_1.strict.strictEqual(election.contests.length, tally1.length);
    assert_1.strict.strictEqual(tally1.length, tally2.length);
    const combinedTally = [];
    for (let i = 0; i < election.contests.length; i += 1) {
        const contest = election.contests[i];
        assert_1.strict(contest);
        const tally1Row = tally1[i];
        const tally2Row = tally2[i];
        switch (contest.type) {
            case 'candidate':
                combinedTally.push(combineCandidateTallies(tally1Row, tally2Row));
                break;
            case 'yesno':
                combinedTally.push(combineYesNoTallies(tally1Row, tally2Row));
                break;
            case 'ms-either-neither':
                combinedTally.push(combineEitherNeitherTallies(tally1Row, tally2Row));
                break;
            default:
                throwIllegalValue_1.throwIllegalValue(contest, 'type');
        }
    }
    return combinedTally;
};
exports.combineTallies = combineTallies;
const getZeroTally = (election) => 
// This rule is disabled because it's not type-aware and doesn't know that
// `throwIllegalValue` never returns.
// eslint-disable-next-line array-callback-return
election.contests.map((contest) => {
    if (contest.type === 'yesno') {
        return { yes: 0, no: 0, undervotes: 0, overvotes: 0, ballotsCast: 0 };
    }
    if (contest.type === 'ms-either-neither') {
        return {
            eitherOption: 0,
            neitherOption: 0,
            eitherNeitherUndervotes: 0,
            eitherNeitherOvervotes: 0,
            firstOption: 0,
            secondOption: 0,
            pickOneUndervotes: 0,
            pickOneOvervotes: 0,
            ballotsCast: 0,
        };
    }
    /* istanbul ignore next */
    if (contest.type === 'candidate') {
        return {
            candidates: contest.candidates.map(() => 0),
            writeIns: 0,
            undervotes: 0,
            overvotes: 0,
            ballotsCast: 0,
        };
    }
    /* istanbul ignore next - compile time check for completeness */
    throwIllegalValue_1.throwIllegalValue(contest, 'type');
});
exports.getZeroTally = getZeroTally;
const computeTallyForEitherNeitherContests = ({ election, tally, votes, contests, }) => {
    const newTally = [...tally];
    for (const contest of types_1.getEitherNeitherContests(contests)) {
        const contestIndex = election.contests.findIndex((c) => c.id === contest.id);
        const eitherNeitherTally = {
            ...newTally[contestIndex],
        };
        const eitherNeitherVote = votes[contest.eitherNeitherContestId];
        const pickOneVote = votes[contest.pickOneContestId];
        if (eitherNeitherVote === undefined || pickOneVote === undefined) {
            continue;
        }
        eitherNeitherTally.ballotsCast += 1;
        // Tabulate EitherNeither section
        const singleEitherNeitherVote = votes_1.getSingleYesNoVote(eitherNeitherVote);
        if (eitherNeitherVote.length > 1) {
            eitherNeitherTally.eitherNeitherOvervotes += 1;
        }
        else if (singleEitherNeitherVote === undefined) {
            eitherNeitherTally.eitherNeitherUndervotes += 1;
        }
        else {
            eitherNeitherTally[singleEitherNeitherVote === 'yes' ? 'eitherOption' : 'neitherOption'] += 1;
        }
        // Tabulate YesNo section
        const singlePickOneVote = votes_1.getSingleYesNoVote(pickOneVote);
        if (pickOneVote.length > 1) {
            eitherNeitherTally.pickOneOvervotes += 1;
        }
        else if (singlePickOneVote === undefined) {
            eitherNeitherTally.pickOneUndervotes += 1;
        }
        else {
            eitherNeitherTally[singlePickOneVote === 'yes' ? 'firstOption' : 'secondOption'] += 1;
        }
        newTally[contestIndex] = eitherNeitherTally;
    }
    return newTally;
};
exports.computeTallyForEitherNeitherContests = computeTallyForEitherNeitherContests;
const calculateTally = ({ election, tally: prevTally, votes, ballotStyleId, }) => {
    var _a;
    const ballotStyle = types_1.getBallotStyle({
        ballotStyleId,
        election,
    });
    assert_1.strict(ballotStyle);
    const contestsForBallotStyle = types_1.getContests({
        election,
        ballotStyle,
    });
    // first update the tally for either-neither contests
    const tally = exports.computeTallyForEitherNeitherContests({
        election,
        tally: prevTally,
        votes,
        contests: contestsForBallotStyle,
    });
    for (const contest of contestsForBallotStyle) {
        if (contest.type === 'ms-either-neither') {
            continue;
        }
        const contestIndex = election.contests.findIndex((c) => c.id === contest.id);
        /* istanbul ignore next */
        if (contestIndex < 0) {
            throw new Error(`No contest found for contestId: ${contest.id}`);
        }
        const contestTally = tally[contestIndex];
        /* istanbul ignore else */
        if (contest.type === 'yesno') {
            const yesnoContestTally = contestTally;
            const vote = votes[contest.id];
            if (vote && vote.length > 1) {
                yesnoContestTally.overvotes += 1;
            }
            else {
                const yesnoVote = votes_1.getSingleYesNoVote(vote);
                if (yesnoVote === undefined) {
                    yesnoContestTally.undervotes += 1;
                }
                else {
                    yesnoContestTally[yesnoVote] += 1;
                }
            }
            yesnoContestTally.ballotsCast += 1;
        }
        else if (contest.type === 'candidate') {
            const candidateContestTally = contestTally;
            const vote = ((_a = votes[contest.id]) !== null && _a !== void 0 ? _a : []);
            if (vote.length <= contest.seats) {
                vote.forEach((candidate) => {
                    if (candidate.isWriteIn) {
                        candidateContestTally.writeIns += 1;
                    }
                    else {
                        const candidateIndex = contest.candidates.findIndex((c) => c.id === candidate.id);
                        if (candidateIndex < 0 ||
                            candidateIndex >= candidateContestTally.candidates.length) {
                            throw new Error(`unable to find a candidate with id: ${candidate.id}`);
                        }
                        candidateContestTally.candidates[candidateIndex] += 1;
                    }
                });
            }
            if (vote.length < contest.seats) {
                candidateContestTally.undervotes += contest.seats - vote.length;
            }
            else if (vote.length > contest.seats) {
                candidateContestTally.overvotes += contest.seats;
            }
            candidateContestTally.ballotsCast += 1;
        }
    }
    return tally;
};
exports.calculateTally = calculateTally;
/**
 * Convert a Tally object into a SerializedTally object for storage.
 */
const serializeTally = (election, tally) => {
    // eslint-disable-next-line array-callback-return
    return election.contests.map((contest) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        if (contest.type === 'yesno') {
            const contestTally = tally.contestTallies[contest.id];
            return {
                yes: (_b = (_a = contestTally === null || contestTally === void 0 ? void 0 : contestTally.tallies.yes) === null || _a === void 0 ? void 0 : _a.tally) !== null && _b !== void 0 ? _b : 0,
                no: (_d = (_c = contestTally === null || contestTally === void 0 ? void 0 : contestTally.tallies.no) === null || _c === void 0 ? void 0 : _c.tally) !== null && _d !== void 0 ? _d : 0,
                undervotes: (_e = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.undervotes) !== null && _e !== void 0 ? _e : 0,
                overvotes: (_f = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.overvotes) !== null && _f !== void 0 ? _f : 0,
                ballotsCast: (_g = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.ballots) !== null && _g !== void 0 ? _g : 0,
            };
        }
        if (contest.type === 'ms-either-neither') {
            const eitherNeitherContestTally = tally.contestTallies[contest.eitherNeitherContestId];
            const pickOneContestTally = tally.contestTallies[contest.pickOneContestId];
            return {
                eitherOption: (_j = (_h = eitherNeitherContestTally === null || eitherNeitherContestTally === void 0 ? void 0 : eitherNeitherContestTally.tallies.yes) === null || _h === void 0 ? void 0 : _h.tally) !== null && _j !== void 0 ? _j : 0,
                neitherOption: (_l = (_k = eitherNeitherContestTally === null || eitherNeitherContestTally === void 0 ? void 0 : eitherNeitherContestTally.tallies.no) === null || _k === void 0 ? void 0 : _k.tally) !== null && _l !== void 0 ? _l : 0,
                eitherNeitherUndervotes: (_m = eitherNeitherContestTally === null || eitherNeitherContestTally === void 0 ? void 0 : eitherNeitherContestTally.metadata.undervotes) !== null && _m !== void 0 ? _m : 0,
                eitherNeitherOvervotes: (_o = eitherNeitherContestTally === null || eitherNeitherContestTally === void 0 ? void 0 : eitherNeitherContestTally.metadata.overvotes) !== null && _o !== void 0 ? _o : 0,
                firstOption: (_q = (_p = pickOneContestTally === null || pickOneContestTally === void 0 ? void 0 : pickOneContestTally.tallies.yes) === null || _p === void 0 ? void 0 : _p.tally) !== null && _q !== void 0 ? _q : 0,
                secondOption: (_s = (_r = pickOneContestTally === null || pickOneContestTally === void 0 ? void 0 : pickOneContestTally.tallies.no) === null || _r === void 0 ? void 0 : _r.tally) !== null && _s !== void 0 ? _s : 0,
                pickOneUndervotes: (_t = pickOneContestTally === null || pickOneContestTally === void 0 ? void 0 : pickOneContestTally.metadata.undervotes) !== null && _t !== void 0 ? _t : 0,
                pickOneOvervotes: (_u = pickOneContestTally === null || pickOneContestTally === void 0 ? void 0 : pickOneContestTally.metadata.overvotes) !== null && _u !== void 0 ? _u : 0,
                ballotsCast: (_v = pickOneContestTally === null || pickOneContestTally === void 0 ? void 0 : pickOneContestTally.metadata.ballots) !== null && _v !== void 0 ? _v : 0,
            };
        }
        if (contest.type === 'candidate') {
            const contestTally = tally.contestTallies[contest.id];
            return {
                candidates: contest.candidates.map((candidate) => { var _a, _b; return (_b = (_a = contestTally === null || contestTally === void 0 ? void 0 : contestTally.tallies[candidate.id]) === null || _a === void 0 ? void 0 : _a.tally) !== null && _b !== void 0 ? _b : 0; }),
                writeIns: (_x = (_w = contestTally === null || contestTally === void 0 ? void 0 : contestTally.tallies[types_1.writeInCandidate.id]) === null || _w === void 0 ? void 0 : _w.tally) !== null && _x !== void 0 ? _x : 0,
                undervotes: (_y = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.undervotes) !== null && _y !== void 0 ? _y : 0,
                overvotes: (_z = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.overvotes) !== null && _z !== void 0 ? _z : 0,
                ballotsCast: (_0 = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.ballots) !== null && _0 !== void 0 ? _0 : 0,
            };
        }
        /* istanbul ignore next - compile time check for completeness */
        throwIllegalValue_1.throwIllegalValue(contest, 'type');
    });
};
exports.serializeTally = serializeTally;
/**
 * A compressed tally
 */
const compressTally = (election, tally) => {
    // eslint-disable-next-line array-callback-return
    return election.contests.map((contest) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        if (contest.type === 'yesno') {
            const contestTally = tally.contestTallies[contest.id];
            return [
                (_a = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.undervotes) !== null && _a !== void 0 ? _a : 0,
                (_b = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.overvotes) !== null && _b !== void 0 ? _b : 0,
                (_c = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.ballots) !== null && _c !== void 0 ? _c : 0,
                (_e = (_d = contestTally === null || contestTally === void 0 ? void 0 : contestTally.tallies.yes) === null || _d === void 0 ? void 0 : _d.tally) !== null && _e !== void 0 ? _e : 0,
                (_g = (_f = contestTally === null || contestTally === void 0 ? void 0 : contestTally.tallies.no) === null || _f === void 0 ? void 0 : _f.tally) !== null && _g !== void 0 ? _g : 0,
            ];
        }
        if (contest.type === 'ms-either-neither') {
            const eitherNeitherContestTally = tally.contestTallies[contest.eitherNeitherContestId];
            const pickOneContestTally = tally.contestTallies[contest.pickOneContestId];
            return [
                (_j = (_h = eitherNeitherContestTally === null || eitherNeitherContestTally === void 0 ? void 0 : eitherNeitherContestTally.tallies.yes) === null || _h === void 0 ? void 0 : _h.tally) !== null && _j !== void 0 ? _j : 0,
                (_l = (_k = eitherNeitherContestTally === null || eitherNeitherContestTally === void 0 ? void 0 : eitherNeitherContestTally.tallies.no) === null || _k === void 0 ? void 0 : _k.tally) !== null && _l !== void 0 ? _l : 0,
                (_m = eitherNeitherContestTally === null || eitherNeitherContestTally === void 0 ? void 0 : eitherNeitherContestTally.metadata.undervotes) !== null && _m !== void 0 ? _m : 0,
                (_o = eitherNeitherContestTally === null || eitherNeitherContestTally === void 0 ? void 0 : eitherNeitherContestTally.metadata.overvotes) !== null && _o !== void 0 ? _o : 0,
                (_q = (_p = pickOneContestTally === null || pickOneContestTally === void 0 ? void 0 : pickOneContestTally.tallies.yes) === null || _p === void 0 ? void 0 : _p.tally) !== null && _q !== void 0 ? _q : 0,
                (_s = (_r = pickOneContestTally === null || pickOneContestTally === void 0 ? void 0 : pickOneContestTally.tallies.no) === null || _r === void 0 ? void 0 : _r.tally) !== null && _s !== void 0 ? _s : 0,
                (_t = pickOneContestTally === null || pickOneContestTally === void 0 ? void 0 : pickOneContestTally.metadata.undervotes) !== null && _t !== void 0 ? _t : 0,
                (_u = pickOneContestTally === null || pickOneContestTally === void 0 ? void 0 : pickOneContestTally.metadata.overvotes) !== null && _u !== void 0 ? _u : 0,
                (_v = pickOneContestTally === null || pickOneContestTally === void 0 ? void 0 : pickOneContestTally.metadata.ballots) !== null && _v !== void 0 ? _v : 0,
            ];
        }
        if (contest.type === 'candidate') {
            const contestTally = tally.contestTallies[contest.id];
            return [
                (_w = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.undervotes) !== null && _w !== void 0 ? _w : 0,
                (_x = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.overvotes) !== null && _x !== void 0 ? _x : 0,
                (_y = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.ballots) !== null && _y !== void 0 ? _y : 0,
                ...contest.candidates.map(// asdf
                (candidate) => { var _a, _b; return (_b = (_a = contestTally === null || contestTally === void 0 ? void 0 : contestTally.tallies[candidate.id]) === null || _a === void 0 ? void 0 : _a.tally) !== null && _b !== void 0 ? _b : 0; }),
                (_0 = (_z = contestTally === null || contestTally === void 0 ? void 0 : contestTally.tallies[types_1.writeInCandidate.id]) === null || _z === void 0 ? void 0 : _z.tally) !== null && _0 !== void 0 ? _0 : 0,
            ];
        }
        /* istanbul ignore next - compile time check for completeness */
        throwIllegalValue_1.throwIllegalValue(contest);
    });
};
exports.compressTally = compressTally;
const getContestTalliesForSerializedContest = (contest, serializedContest) => {
    switch (contest.type) {
        case 'yesno': {
            const yesNoTally = serializedContest;
            return [
                {
                    contest,
                    tallies: {
                        yes: { option: ['yes'], tally: yesNoTally.yes },
                        no: { option: ['no'], tally: yesNoTally.no },
                    },
                    metadata: {
                        undervotes: yesNoTally.undervotes,
                        overvotes: yesNoTally.overvotes,
                        ballots: yesNoTally.ballotsCast,
                    },
                },
            ];
        }
        case 'candidate': {
            const candidateTally = serializedContest;
            const candidateTallies = {};
            contest.candidates.forEach((candidate, candidateIdx) => {
                var _a;
                candidateTallies[candidate.id] = {
                    option: candidate,
                    tally: (_a = candidateTally.candidates[candidateIdx]) !== null && _a !== void 0 ? _a : 0,
                };
            });
            if (contest.allowWriteIns) {
                candidateTallies[types_1.writeInCandidate.id] = {
                    option: types_1.writeInCandidate,
                    tally: candidateTally.writeIns,
                };
            }
            return [
                {
                    contest,
                    tallies: candidateTallies,
                    metadata: {
                        undervotes: candidateTally.undervotes,
                        overvotes: candidateTally.overvotes,
                        ballots: candidateTally.ballotsCast,
                    },
                },
            ];
        }
        case 'ms-either-neither': {
            const eitherNeitherTally = serializedContest;
            const newYesNoContests = types_1.expandEitherNeitherContests([contest]);
            return newYesNoContests.map((yesno) => {
                assert_1.strict(yesno.type === 'yesno');
                return yesno.id === contest.eitherNeitherContestId
                    ? {
                        contest: yesno,
                        tallies: {
                            yes: {
                                option: ['yes'],
                                tally: eitherNeitherTally.eitherOption,
                            },
                            no: {
                                option: ['no'],
                                tally: eitherNeitherTally.neitherOption,
                            },
                        },
                        metadata: {
                            undervotes: eitherNeitherTally.eitherNeitherUndervotes,
                            overvotes: eitherNeitherTally.eitherNeitherOvervotes,
                            ballots: eitherNeitherTally.ballotsCast,
                        },
                    }
                    : {
                        contest: yesno,
                        tallies: {
                            yes: {
                                option: ['yes'],
                                tally: eitherNeitherTally.firstOption,
                            },
                            no: {
                                option: ['no'],
                                tally: eitherNeitherTally.secondOption,
                            },
                        },
                        metadata: {
                            undervotes: eitherNeitherTally.pickOneUndervotes,
                            overvotes: eitherNeitherTally.pickOneOvervotes,
                            ballots: eitherNeitherTally.ballotsCast,
                        },
                    };
            });
        }
        default:
            throwIllegalValue_1.throwIllegalValue(contest, 'type');
    }
};
const readSerializedTally = (election, serializedTally, totalBallotCount, ballotCountsByVotingMethod) => {
    const contestTallies = {};
    election.contests.forEach((contest, contestIdx) => {
        const serializedContestTally = serializedTally[contestIdx];
        assert_1.strict(serializedContestTally);
        const tallies = getContestTalliesForSerializedContest(contest, serializedContestTally);
        tallies.forEach((tally) => {
            contestTallies[tally.contest.id] = tally;
        });
    });
    return {
        numberOfBallotsCounted: totalBallotCount,
        castVoteRecords: new Set(),
        contestTallies,
        ballotCountsByVotingMethod,
    };
};
exports.readSerializedTally = readSerializedTally;
