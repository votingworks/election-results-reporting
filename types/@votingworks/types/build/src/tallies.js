"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompressedTallySchema = exports.VotingMethod = exports.ExternalTallySourceType = exports.TallyCategory = void 0;
const zod_1 = require("zod");
var TallyCategory;
(function (TallyCategory) {
    TallyCategory["Precinct"] = "precinct";
    TallyCategory["Scanner"] = "scanner";
    TallyCategory["Party"] = "party";
    TallyCategory["VotingMethod"] = "votingmethod";
    TallyCategory["Batch"] = "batch";
})(TallyCategory = exports.TallyCategory || (exports.TallyCategory = {}));
var ExternalTallySourceType;
(function (ExternalTallySourceType) {
    ExternalTallySourceType["SEMS"] = "sems";
    ExternalTallySourceType["Manual"] = "manual-data";
})(ExternalTallySourceType = exports.ExternalTallySourceType || (exports.ExternalTallySourceType = {}));
var VotingMethod;
(function (VotingMethod) {
    VotingMethod["Absentee"] = "absentee";
    VotingMethod["Precinct"] = "standard";
    VotingMethod["Unknown"] = "unknown";
})(VotingMethod = exports.VotingMethod || (exports.VotingMethod = {}));
exports.CompressedTallySchema = zod_1.z.array(zod_1.z.array(zod_1.z.number().nonnegative().int()));
