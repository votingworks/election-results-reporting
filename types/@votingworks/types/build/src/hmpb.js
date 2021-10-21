"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkAdjudicationsSchema = exports.MarkAdjudicationSchema = exports.WriteInMarkAdjudicationSchema = exports.WriteInMarkAdjudicationUnmarkedSchema = exports.WriteInMarkAdjudicationMarkedSchema = exports.MarginalMarkAdjudicationSchema = exports.UndervoteMarkAdjudicationSchema = exports.OvervoteMarkAdjudicationSchema = exports.UninterpretableBallotMarkAdjudicationSchema = exports.MarksByContestIdSchema = exports.MarksByOptionIdSchema = exports.MarkStatusSchema = exports.MarkStatus = exports.SerializableBallotPageLayoutSchema = exports.BallotPageLayoutSchema = exports.BallotPageContestLayoutSchema = exports.BallotPageContestOptionLayoutSchema = exports.BallotImageSchema = exports.BallotPageMetadataSchema = void 0;
const zod_1 = require("zod");
const election_1 = require("./election");
const generic_1 = require("./generic");
const geometry_1 = require("./geometry");
const image_1 = require("./image");
exports.BallotPageMetadataSchema = election_1.HMPBBallotPageMetadataSchema;
exports.BallotImageSchema = zod_1.z.object({
    imageData: image_1.ImageDataSchema,
    metadata: exports.BallotPageMetadataSchema,
});
exports.BallotPageContestOptionLayoutSchema = zod_1.z.object({
    bounds: geometry_1.RectSchema,
    target: election_1.TargetShapeSchema,
});
exports.BallotPageContestLayoutSchema = zod_1.z.object({
    bounds: geometry_1.RectSchema,
    corners: geometry_1.CornersSchema,
    options: zod_1.z.array(exports.BallotPageContestOptionLayoutSchema),
});
exports.BallotPageLayoutSchema = zod_1.z.object({
    ballotImage: exports.BallotImageSchema,
    contests: zod_1.z.array(exports.BallotPageContestLayoutSchema),
});
exports.SerializableBallotPageLayoutSchema = zod_1.z.object({
    ballotImage: zod_1.z.object({
        imageData: geometry_1.SizeSchema,
        metadata: exports.BallotPageMetadataSchema,
    }),
    contests: zod_1.z.array(exports.BallotPageContestLayoutSchema),
});
var MarkStatus;
(function (MarkStatus) {
    MarkStatus["Marked"] = "marked";
    MarkStatus["Unmarked"] = "unmarked";
    MarkStatus["Marginal"] = "marginal";
    MarkStatus["UnmarkedWriteIn"] = "unmarkedWriteIn";
})(MarkStatus = exports.MarkStatus || (exports.MarkStatus = {}));
exports.MarkStatusSchema = zod_1.z.nativeEnum(MarkStatus);
exports.MarksByOptionIdSchema = zod_1.z.record(exports.MarkStatusSchema.optional());
exports.MarksByContestIdSchema = zod_1.z.record(exports.MarksByOptionIdSchema.optional());
exports.UninterpretableBallotMarkAdjudicationSchema = zod_1.z.object({
    type: zod_1.z.literal(election_1.AdjudicationReason.UninterpretableBallot),
    contestId: generic_1.Id,
    optionId: generic_1.Id,
    isMarked: zod_1.z.boolean(),
});
exports.OvervoteMarkAdjudicationSchema = zod_1.z.object({
    type: zod_1.z.literal(election_1.AdjudicationReason.Overvote),
    contestId: generic_1.Id,
    optionId: generic_1.Id,
    isMarked: zod_1.z.boolean(),
});
exports.UndervoteMarkAdjudicationSchema = zod_1.z.object({
    type: zod_1.z.literal(election_1.AdjudicationReason.Undervote),
    contestId: generic_1.Id,
    optionId: generic_1.Id,
    isMarked: zod_1.z.boolean(),
});
exports.MarginalMarkAdjudicationSchema = zod_1.z.object({
    type: zod_1.z.literal(election_1.AdjudicationReason.MarginalMark),
    contestId: generic_1.Id,
    optionId: generic_1.Id,
    isMarked: zod_1.z.boolean(),
});
exports.WriteInMarkAdjudicationMarkedSchema = zod_1.z.object({
    type: zod_1.z.union([
        zod_1.z.literal(election_1.AdjudicationReason.WriteIn),
        zod_1.z.literal(election_1.AdjudicationReason.UnmarkedWriteIn),
    ]),
    isMarked: zod_1.z.literal(true),
    contestId: generic_1.Id,
    optionId: generic_1.WriteInId,
    name: zod_1.z.string(),
});
exports.WriteInMarkAdjudicationUnmarkedSchema = zod_1.z.object({
    type: zod_1.z.union([
        zod_1.z.literal(election_1.AdjudicationReason.WriteIn),
        zod_1.z.literal(election_1.AdjudicationReason.UnmarkedWriteIn),
    ]),
    isMarked: zod_1.z.literal(false),
    contestId: generic_1.Id,
    optionId: generic_1.WriteInId,
});
exports.WriteInMarkAdjudicationSchema = zod_1.z.union([exports.WriteInMarkAdjudicationMarkedSchema, exports.WriteInMarkAdjudicationUnmarkedSchema]);
exports.MarkAdjudicationSchema = zod_1.z.union([
    exports.UninterpretableBallotMarkAdjudicationSchema,
    exports.OvervoteMarkAdjudicationSchema,
    exports.UndervoteMarkAdjudicationSchema,
    exports.MarginalMarkAdjudicationSchema,
    exports.WriteInMarkAdjudicationSchema,
]);
exports.MarkAdjudicationsSchema = zod_1.z.array(exports.MarkAdjudicationSchema);
