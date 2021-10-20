"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabelForVotingMethod = void 0;
const tallies_1 = require("./tallies");
// duplicated from shared utils library in order to avoid creating a cyclical dependency
function throwIllegalValue(s) {
    throw new Error(`Illegal Value: ${s}`);
}
function getLabelForVotingMethod(votingMethod) {
    switch (votingMethod) {
        case tallies_1.VotingMethod.Precinct:
            return 'Precinct';
        case tallies_1.VotingMethod.Absentee:
            return 'Absentee';
        case tallies_1.VotingMethod.Unknown:
            return 'Other';
        default:
            throwIllegalValue(votingMethod);
    }
}
exports.getLabelForVotingMethod = getLabelForVotingMethod;
