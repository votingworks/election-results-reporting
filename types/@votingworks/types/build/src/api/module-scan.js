"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNextReviewSheetResponseSchema = exports.CalibrateResponseSchema = exports.CalibrateRequestSchema = exports.ZeroResponseSchema = exports.ZeroRequestSchema = exports.ExportResponseSchema = exports.ExportRequestSchema = exports.DoneTemplatesResponseSchema = exports.DoneTemplatesRequestSchema = exports.AddTemplatesResponseSchema = exports.AddTemplatesRequestSchema = exports.ScanContinueResponseSchema = exports.ScanContinueRequestSchema = exports.ScanBatchResponseSchema = exports.ScanBatchRequestSchema = exports.PatchSkipElectionHashCheckConfigResponseSchema = exports.PatchSkipElectionHashCheckConfigRequestSchema = exports.PatchMarkThresholdOverridesConfigResponseSchema = exports.PatchMarkThresholdOverridesConfigRequestSchema = exports.DeleteMarkThresholdOverridesConfigResponseSchema = exports.GetMarkThresholdOverridesConfigResponseSchema = exports.DeleteCurrentPrecinctConfigResponseSchema = exports.PutCurrentPrecinctConfigResponseSchema = exports.PutCurrentPrecinctConfigRequestSchema = exports.GetCurrentPrecinctResponseSchema = exports.PatchTestModeConfigResponseSchema = exports.PatchTestModeConfigRequestSchema = exports.GetTestModeConfigResponseSchema = exports.DeleteElectionConfigResponseSchema = exports.PatchElectionConfigRequestSchema = exports.PatchElectionConfigResponseSchema = exports.GetElectionConfigResponseSchema = exports.GetScanStatusResponseSchema = exports.ScanStatusSchema = exports.ScannerStatusSchema = exports.ScannerStatus = exports.BatchInfoSchema = exports.AdjudicationStatusSchema = exports.SideSchema = void 0;
const z = __importStar(require("zod"));
const _1 = require(".");
const hmpb_1 = require("../hmpb");
const election_1 = require("../election");
const generic_1 = require("../generic");
exports.SideSchema = z.union([z.literal('front'), z.literal('back')]);
exports.AdjudicationStatusSchema = z.object({
    adjudicated: z.number(),
    remaining: z.number(),
});
exports.BatchInfoSchema = z.object({
    id: generic_1.Id,
    label: z.string(),
    startedAt: _1.ISO8601TimestampSchema,
    endedAt: z.optional(_1.ISO8601TimestampSchema),
    error: z.optional(z.string()),
    count: z.number().nonnegative(),
});
var ScannerStatus;
(function (ScannerStatus) {
    ScannerStatus["WaitingForPaper"] = "WaitingForPaper";
    ScannerStatus["ReadyToScan"] = "ReadyToScan";
    ScannerStatus["Scanning"] = "Scanning";
    ScannerStatus["Accepting"] = "Accepting";
    ScannerStatus["Rejecting"] = "Rejecting";
    ScannerStatus["ReadyToAccept"] = "ReadyToAccept";
    ScannerStatus["Rejected"] = "Rejected";
    ScannerStatus["Calibrating"] = "Calibrating";
    ScannerStatus["Error"] = "Error";
    ScannerStatus["Unknown"] = "Unknown";
})(ScannerStatus = exports.ScannerStatus || (exports.ScannerStatus = {}));
exports.ScannerStatusSchema = z.nativeEnum(ScannerStatus);
exports.ScanStatusSchema = z.object({
    electionHash: z.optional(generic_1.HexString),
    batches: z.array(exports.BatchInfoSchema),
    adjudication: exports.AdjudicationStatusSchema,
    scanner: exports.ScannerStatusSchema,
});
/**
 * @url /scan/status
 * @method GET
 */
exports.GetScanStatusResponseSchema = exports.ScanStatusSchema;
/**
 * @url /config/election
 * @method GET
 */
exports.GetElectionConfigResponseSchema = z.union([election_1.ElectionDefinitionSchema, z.null(), z.string()]);
/**
 * @url /config/election
 * @method PATCH
 */
exports.PatchElectionConfigResponseSchema = z.union([_1.OkResponseSchema, _1.ErrorsResponseSchema]);
/**
 * @url /config/election
 * @method PATCH
 */
exports.PatchElectionConfigRequestSchema = z.instanceof(
// should be Buffer, but this triggers type errors
Uint8Array);
/**
 * @url /config/election
 * @method DELETE
 */
exports.DeleteElectionConfigResponseSchema = _1.OkResponseSchema;
/**
 * @url /config/testMode
 * @method GET
 */
exports.GetTestModeConfigResponseSchema = z.object({
    status: z.literal('ok'),
    testMode: z.boolean(),
});
/**
 * @url /config/testMode
 * @method PATCH
 */
exports.PatchTestModeConfigRequestSchema = z.object({
    testMode: z.boolean(),
});
/**
 * @url /config/testMode
 * @method PATCH
 */
exports.PatchTestModeConfigResponseSchema = z.union([_1.OkResponseSchema, _1.ErrorsResponseSchema]);
/**
 * @url /config/precinct
 * @method GET
 */
exports.GetCurrentPrecinctResponseSchema = z.object({
    status: z.literal('ok'),
    precinctId: z.optional(generic_1.Id),
});
/**
 * @url /config/precinct
 * @method PUT
 */
exports.PutCurrentPrecinctConfigRequestSchema = z.object({
    precinctId: z.optional(generic_1.Id),
});
/**
 * @url /config/precinct
 * @method PUT
 */
exports.PutCurrentPrecinctConfigResponseSchema = z.union([_1.OkResponseSchema, _1.ErrorsResponseSchema]);
/**
 * @url /config/precinct
 * @method DELETE
 */
exports.DeleteCurrentPrecinctConfigResponseSchema = _1.OkResponseSchema;
/**
 * @url /config/markThresholdOverrides
 * @method GET
 */
exports.GetMarkThresholdOverridesConfigResponseSchema = z.object({
    status: z.literal('ok'),
    markThresholdOverrides: z.optional(election_1.MarkThresholdsSchema),
});
/**
 * @url /config/markThresholdOverrides
 * @method DELETE
 */
exports.DeleteMarkThresholdOverridesConfigResponseSchema = _1.OkResponseSchema;
/**
 * @url /config/markThresholdOverrides
 * @method PATCH
 */
exports.PatchMarkThresholdOverridesConfigRequestSchema = z.object({
    markThresholdOverrides: z.optional(election_1.MarkThresholdsSchema),
});
/**
 * @url /config/markThresholdOverrides
 * @method PATCH
 */
exports.PatchMarkThresholdOverridesConfigResponseSchema = z.union([_1.OkResponseSchema, _1.ErrorsResponseSchema]);
/**
 * @url /config/skipElectionHashCheck
 * @method PATCH
 */
exports.PatchSkipElectionHashCheckConfigRequestSchema = z.object({
    skipElectionHashCheck: z.boolean(),
});
/**
 * @url /config/skipElectionHashCheck
 * @method PATCH
 */
exports.PatchSkipElectionHashCheckConfigResponseSchema = z.union([_1.OkResponseSchema, _1.ErrorsResponseSchema]);
/**
 * @url /scan/scanBatch
 * @method POST
 */
exports.ScanBatchRequestSchema = z.never();
/**
 * @url /scan/scanBatch
 * @method POST
 */
exports.ScanBatchResponseSchema = z.union([
    z.object({
        status: z.literal('ok'),
        batchId: z.string(),
    }),
    _1.ErrorsResponseSchema,
]);
/**
 * @url /scan/scanContinue
 * @method POST
 */
exports.ScanContinueRequestSchema = z.union([
    z.object({ forceAccept: z.literal(false) }),
    z.object({
        forceAccept: z.literal(true),
        frontMarkAdjudications: hmpb_1.MarkAdjudicationsSchema,
        backMarkAdjudications: hmpb_1.MarkAdjudicationsSchema,
    }),
]);
/**
 * @url /scan/scanContinue
 * @method POST
 */
exports.ScanContinueResponseSchema = z.union([_1.OkResponseSchema, _1.ErrorsResponseSchema]);
/**
 * This is `never` because the request is not JSON, but multipart/form-data,
 * so none of the actual data ends up in `request.body`.
 *
 * @url /scan/hmpb/addTemplates
 * @method POST
 */
exports.AddTemplatesRequestSchema = z.never();
/**
 * @url /scan/hmpb/addTemplates
 * @method POST
 */
exports.AddTemplatesResponseSchema = z.union([_1.OkResponseSchema, _1.ErrorsResponseSchema]);
/**
 * This is `never` because there is no request data.
 *
 * @url /scan/hmpb/doneTemplates
 * @method POST
 */
exports.DoneTemplatesRequestSchema = z.never();
/**
 * @url /scan/hmpb/doneTemplates
 * @method POST
 */
exports.DoneTemplatesResponseSchema = _1.OkResponseSchema;
/**
 * This is `never` because there is no request data.
 *
 * @url /scan/export
 * @method POST
 */
exports.ExportRequestSchema = z.never();
/**
 * @url /scan/export
 * @method POST
 */
exports.ExportResponseSchema = z.string();
/**
 * This is `never` because there is no request data.
 *
 * @url /scan/zero
 * @method POST
 */
exports.ZeroRequestSchema = z.never();
/**
 * @url /scan/zero
 * @method POST
 */
exports.ZeroResponseSchema = _1.OkResponseSchema;
/**
 * This is `never` because there is no request data.
 *
 * @url /scan/calibrate
 * @method POST
 */
exports.CalibrateRequestSchema = z.never();
/**
 * @url /scan/calibrate
 * @method POST
 */
exports.CalibrateResponseSchema = z.union([
    _1.OkResponseSchema,
    _1.ErrorsResponseSchema,
]);
/**
 * @url /scan/hmpb/review/next-sheet
 * @method GET
 */
exports.GetNextReviewSheetResponseSchema = z.object({
    interpreted: election_1.BallotSheetInfoSchema,
    layouts: z.object({
        front: hmpb_1.SerializableBallotPageLayoutSchema.optional(),
        back: hmpb_1.SerializableBallotPageLayoutSchema.optional(),
    }),
    definitions: z.object({
        front: z.object({ contestIds: z.array(generic_1.Id) }),
        back: z.object({ contestIds: z.array(generic_1.Id) }),
    }),
});
