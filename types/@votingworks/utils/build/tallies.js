"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineContestTallies = void 0;
const assert_1 = require("assert");
function combineContestTallies(firstTally, secondTally) {
    var _a;
    assert_1.strict(firstTally.contest.id === secondTally.contest.id);
    const combinedTallies = {};
    for (const optionId of Object.keys(firstTally.tallies)) {
        const firstTallyOption = firstTally.tallies[optionId];
        assert_1.strict(firstTallyOption);
        const secondTallyOption = secondTally.tallies[optionId];
        combinedTallies[optionId] = {
            option: firstTallyOption.option,
            tally: firstTallyOption.tally + ((_a = secondTallyOption === null || secondTallyOption === void 0 ? void 0 : secondTallyOption.tally) !== null && _a !== void 0 ? _a : 0),
        };
    }
    return {
        contest: firstTally.contest,
        tallies: combinedTallies,
        metadata: {
            overvotes: firstTally.metadata.overvotes + secondTally.metadata.overvotes,
            undervotes: firstTally.metadata.undervotes + secondTally.metadata.undervotes,
            ballots: firstTally.metadata.ballots + secondTally.metadata.ballots,
        },
    };
}
exports.combineContestTallies = combineContestTallies;
