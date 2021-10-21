"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCompressedTally = exports.compressTally = void 0;
const types_1 = require("@votingworks/types");
const assert_1 = require("assert");
const throwIllegalValue_1 = require("./throwIllegalValue");
/**
 * A compressed tally
 */
const compressTally = (election, tally) => {
    // eslint-disable-next-line array-callback-return
    return election.contests.map((contest) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        switch (contest.type) {
            case 'yesno': {
                const contestTally = tally.contestTallies[contest.id];
                return [
                    (_a = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.undervotes) !== null && _a !== void 0 ? _a : 0,
                    (_b = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.overvotes) !== null && _b !== void 0 ? _b : 0,
                    (_c = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.ballots) !== null && _c !== void 0 ? _c : 0,
                    (_e = (_d = contestTally === null || contestTally === void 0 ? void 0 : contestTally.tallies.yes) === null || _d === void 0 ? void 0 : _d.tally) !== null && _e !== void 0 ? _e : 0,
                    (_g = (_f = contestTally === null || contestTally === void 0 ? void 0 : contestTally.tallies.no) === null || _f === void 0 ? void 0 : _f.tally) !== null && _g !== void 0 ? _g : 0,
                ];
            }
            case 'ms-either-neither': {
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
            case 'candidate': {
                const contestTally = tally.contestTallies[contest.id];
                return [
                    (_w = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.undervotes) !== null && _w !== void 0 ? _w : 0,
                    (_x = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.overvotes) !== null && _x !== void 0 ? _x : 0,
                    (_y = contestTally === null || contestTally === void 0 ? void 0 : contestTally.metadata.ballots) !== null && _y !== void 0 ? _y : 0,
                    ...contest.candidates.map((candidate) => { var _a, _b; return (_b = (_a = contestTally === null || contestTally === void 0 ? void 0 : contestTally.tallies[candidate.id]) === null || _a === void 0 ? void 0 : _a.tally) !== null && _b !== void 0 ? _b : 0; }),
                    (_0 = (_z = contestTally === null || contestTally === void 0 ? void 0 : contestTally.tallies[types_1.writeInCandidate.id]) === null || _z === void 0 ? void 0 : _z.tally) !== null && _0 !== void 0 ? _0 : 0,
                ];
            }
            /* istanbul ignore next - compile time check for completeness */
            default:
                throwIllegalValue_1.throwIllegalValue(contest, 'type');
        }
    });
};
exports.compressTally = compressTally;
const getContestTalliesForCompressedContest = (contest, compressedContest) => {
    switch (contest.type) {
        case 'yesno': {
            const [undervotes, overvotes, ballots, yes, no] = compressedContest;
            assert_1.strict(undervotes !== undefined &&
                overvotes !== undefined &&
                ballots !== undefined &&
                yes !== undefined &&
                no !== undefined);
            return [
                {
                    contest,
                    tallies: {
                        yes: { option: ['yes'], tally: yes },
                        no: { option: ['no'], tally: no },
                    },
                    metadata: {
                        undervotes,
                        overvotes,
                        ballots,
                    },
                },
            ];
        }
        case 'candidate': {
            const [undervotes, overvotes, ballots, ...tallyByCandidate] = compressedContest;
            assert_1.strict(undervotes !== undefined &&
                overvotes !== undefined &&
                ballots !== undefined);
            const candidateTallies = {};
            for (const [candidateIdx, candidate] of contest.candidates.entries()) {
                const tally = tallyByCandidate[candidateIdx]; // We add 3 here to offset from the undervotes, overvotes and total ballots
                assert_1.strict(tally !== undefined);
                candidateTallies[candidate.id] = {
                    option: candidate,
                    tally,
                };
            }
            if (contest.allowWriteIns) {
                // write ins will be the last thing in the array after the metadata (3 items) and all candidates
                const writeInTally = tallyByCandidate.pop();
                assert_1.strict(writeInTally !== undefined);
                candidateTallies[types_1.writeInCandidate.id] = {
                    option: types_1.writeInCandidate,
                    tally: writeInTally,
                };
            }
            return [
                {
                    contest,
                    tallies: candidateTallies,
                    metadata: {
                        undervotes,
                        overvotes,
                        ballots,
                    },
                },
            ];
        }
        case 'ms-either-neither': {
            const [eitherOption, neitherOption, eitherNeitherUndervotes, eitherNeitherOvervotes, firstOption, secondOption, pickOneUndervotes, pickOneOvervotes, ballots,] = compressedContest;
            assert_1.strict(eitherOption !== undefined &&
                neitherOption !== undefined &&
                eitherNeitherUndervotes !== undefined &&
                eitherNeitherOvervotes !== undefined &&
                firstOption !== undefined &&
                secondOption !== undefined &&
                pickOneUndervotes !== undefined &&
                pickOneOvervotes !== undefined &&
                ballots !== undefined);
            const newYesNoContests = types_1.expandEitherNeitherContests([contest]);
            return newYesNoContests.map((yesno) => {
                assert_1.strict(yesno.type === 'yesno');
                return yesno.id === contest.eitherNeitherContestId
                    ? {
                        contest: yesno,
                        tallies: {
                            yes: {
                                option: ['yes'],
                                tally: eitherOption,
                            },
                            no: {
                                option: ['no'],
                                tally: neitherOption,
                            },
                        },
                        metadata: {
                            undervotes: eitherNeitherUndervotes,
                            overvotes: eitherNeitherOvervotes,
                            ballots,
                        },
                    }
                    : {
                        contest: yesno,
                        tallies: {
                            yes: {
                                option: ['yes'],
                                tally: firstOption,
                            },
                            no: {
                                option: ['no'],
                                tally: secondOption,
                            },
                        },
                        metadata: {
                            undervotes: pickOneUndervotes,
                            overvotes: pickOneOvervotes,
                            ballots,
                        },
                    };
            });
        }
        /* istanbul ignore next - compile time check for completeness */
        default:
            throwIllegalValue_1.throwIllegalValue(contest, 'type');
    }
};
const readCompressedTally = (election, serializedTally, totalBallotCount, ballotCountsByVotingMethod) => {
    const contestTallies = {};
    for (const [contestIdx, contest] of election.contests.entries()) {
        const serializedContestTally = serializedTally[contestIdx];
        assert_1.strict(serializedContestTally);
        const tallies = getContestTalliesForCompressedContest(contest, serializedContestTally);
        for (const tally of tallies) {
            contestTallies[tally.contest.id] = tally;
        }
    }
    return {
        numberOfBallotsCounted: totalBallotCount,
        castVoteRecords: new Set(),
        contestTallies,
        ballotCountsByVotingMethod,
    };
};
exports.readCompressedTally = readCompressedTally;
