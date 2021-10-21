"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrecinctSelectionSchema = exports.PrecinctSelectionKindSchema = exports.PrecinctSelectionKind = void 0;
const zod_1 = require("zod");
const generic_1 = require("./generic");
var PrecinctSelectionKind;
(function (PrecinctSelectionKind) {
    PrecinctSelectionKind["SinglePrecinct"] = "SinglePrecinct";
    PrecinctSelectionKind["AllPrecincts"] = "AllPrecincts";
})(PrecinctSelectionKind = exports.PrecinctSelectionKind || (exports.PrecinctSelectionKind = {}));
exports.PrecinctSelectionKindSchema = zod_1.z.nativeEnum(PrecinctSelectionKind);
exports.PrecinctSelectionSchema = zod_1.z.union([
    zod_1.z.object({ kind: zod_1.z.literal(PrecinctSelectionKind.AllPrecincts) }),
    zod_1.z.object({
        kind: zod_1.z.literal(PrecinctSelectionKind.SinglePrecinct),
        precinctId: generic_1.Id,
    }),
]);
