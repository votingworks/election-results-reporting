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
exports.UndervoteAdjudicationReasonInfoSchema = exports.OvervoteAdjudicationReasonInfoSchema = exports.MarginalMarkAdjudicationReasonInfoSchema = exports.UninterpretableBallotAdjudicationReasonInfoSchema = exports.ContestOption = exports.MsEitherNeitherContestOptionSchema = exports.YesNoContestOptionSchema = exports.CandidateContestOptionSchema = exports.BallotTypeMaximumValue = exports.BallotTypeSchema = exports.BallotType = exports.VotesDictSchema = exports.OptionalVoteSchema = exports.VoteSchema = exports.OptionalYesNoVoteSchema = exports.YesNoVoteSchema = exports.CandidateVoteSchema = exports.OptionalElectionDefinitionSchema = exports.ElectionDefinitionSchema = exports.OptionalElectionSchema = exports.ElectionSchema = exports.MarkThresholdsSchema = exports.AdjudicationReasonSchema = exports.AdjudicationReason = exports.BallotLayoutSchema = exports.BallotPaperSizeSchema = exports.BallotPaperSize = exports.BallotStringsSchema = exports.BallotLocaleSchema = exports.CountySchema = exports.DistrictsSchema = exports.DistrictSchema = exports.PrecinctsSchema = exports.PrecinctSchema = exports.PartiesSchema = exports.PartySchema = exports.BallotStylesSchema = exports.BallotStyleSchema = exports.ContestsSchema = exports.AnyContestSchema = exports.MsEitherNeitherContestSchema = exports.YesNoContestSchema = exports.YesNoOptionSchema = exports.CandidateContestSchema = exports.ContestSchema = exports.ContestTypesSchema = exports.OptionalCandidateSchema = exports.writeInCandidate = exports.CandidateSchema = exports.TranslationsSchema = void 0;
exports.parseElection = exports.safeParseElectionDefinition = exports.safeParseElection = exports.withLocale = exports.getElectionLocales = exports.isVotePresent = exports.vote = exports.getDistrictIdsForPartyId = exports.getPartyFullNameFromBallotStyle = exports.getPartyPrimaryAdjectiveFromBallotStyle = exports.validateVotes = exports.findContest = exports.getBallotStyle = exports.getPrecinctById = exports.expandEitherNeitherContests = exports.getEitherNeitherContests = exports.getContests = exports.AnyCardDataSchema = exports.AdminCardDataSchema = exports.PollworkerCardDataSchema = exports.VoterCardDataSchema = exports.CardDataSchema = exports.CardDataTypesSchema = exports.BallotSheetInfoSchema = exports.BallotPageInfoSchema = exports.PageInterpretationSchema = exports.ImageInfoSchema = exports.UnreadablePageSchema = exports.UninterpretedHmpbPageSchema = exports.InvalidPrecinctPageSchema = exports.InvalidTestModePageSchema = exports.InvalidElectionHashPageSchema = exports.InterpretedHmpbPageSchema = exports.InterpretedBmdPageSchema = exports.BlankPageSchema = exports.AdjudicationInfoSchema = exports.MarkInfoSchema = exports.BallotMarkSchema = exports.BallotTargetMarkSchema = exports.BallotMsEitherNeitherTargetMarkSchema = exports.BallotYesNoTargetMarkSchema = exports.BallotCandidateTargetMarkSchema = exports.BallotStrayMarkSchema = exports.TargetShapeSchema = exports.BallotMetadataSchema = exports.HMPBBallotPageMetadataSchema = exports.AdjudicationReasonInfoSchema = exports.BlankBallotAdjudicationReasonInfoSchema = exports.UnmarkedWriteInAdjudicationReasonInfoSchema = exports.WriteInAdjudicationReasonInfoSchema = void 0;
/* eslint-disable no-underscore-dangle */
const crypto_1 = require("crypto");
const z = __importStar(require("zod"));
const api_1 = require("./api");
const generic_1 = require("./generic");
const geometry_1 = require("./geometry");
exports.TranslationsSchema = z.record(z.record(z.string()));
function* findDuplicateIds(identifiables) {
    const knownIds = new Set();
    for (const [index, { id }] of [...identifiables].entries()) {
        if (knownIds.has(id)) {
            yield [index, id];
        }
        else {
            knownIds.add(id);
        }
    }
}
exports.CandidateSchema = z.object({
    _lang: exports.TranslationsSchema.optional(),
    id: generic_1.Id,
    name: z.string().nonempty(),
    partyId: generic_1.Id.optional(),
    isWriteIn: z.boolean().optional(),
});
exports.writeInCandidate = {
    id: '__write-in',
    name: 'Write-In',
    isWriteIn: true,
};
exports.OptionalCandidateSchema = exports.CandidateSchema.optional();
exports.ContestTypesSchema = z.union([
    z.literal('candidate'),
    z.literal('yesno'),
    z.literal('ms-either-neither'),
]);
const ContestInternalSchema = z.object({
    _lang: exports.TranslationsSchema.optional(),
    id: generic_1.Id,
    districtId: generic_1.Id,
    partyId: generic_1.Id.optional(),
    section: z.string().nonempty(),
    title: z.string().nonempty(),
    type: exports.ContestTypesSchema,
});
exports.ContestSchema = ContestInternalSchema;
exports.CandidateContestSchema = ContestInternalSchema.merge(z.object({
    type: z.literal('candidate'),
    seats: z.number().int().positive(),
    candidates: z.array(exports.CandidateSchema),
    allowWriteIns: z.boolean(),
})).superRefine((contest, ctx) => {
    for (const [index, id] of findDuplicateIds(contest.candidates)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['candidates', index, 'id'],
            message: `Duplicate candidate '${id}' found.`,
        });
    }
});
exports.YesNoOptionSchema = z.object({
    id: generic_1.Id,
    label: z.string().nonempty(),
});
exports.YesNoContestSchema = ContestInternalSchema.merge(z.object({
    type: z.literal('yesno'),
    description: z.string().nonempty(),
    shortTitle: z.string().nonempty().optional(),
    yesOption: exports.YesNoOptionSchema.optional(),
    noOption: exports.YesNoOptionSchema.optional(),
}));
exports.MsEitherNeitherContestSchema = ContestInternalSchema.merge(z.object({
    type: z.literal('ms-either-neither'),
    eitherNeitherContestId: generic_1.Id,
    pickOneContestId: generic_1.Id,
    description: z.string().nonempty(),
    eitherNeitherLabel: z.string().nonempty(),
    pickOneLabel: z.string().nonempty(),
    eitherOption: exports.YesNoOptionSchema,
    neitherOption: exports.YesNoOptionSchema,
    firstOption: exports.YesNoOptionSchema,
    secondOption: exports.YesNoOptionSchema,
}));
exports.AnyContestSchema = z.union([
    exports.CandidateContestSchema,
    exports.YesNoContestSchema,
    exports.MsEitherNeitherContestSchema,
]);
exports.ContestsSchema = z
    .array(exports.AnyContestSchema)
    .superRefine((contests, ctx) => {
    for (const [index, id] of findDuplicateIds(contests)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, 'id'],
            message: `Duplicate contest '${id}' found.`,
        });
    }
});
exports.BallotStyleSchema = z.object({
    _lang: exports.TranslationsSchema.optional(),
    id: generic_1.Id,
    precincts: z.array(generic_1.Id),
    districts: z.array(generic_1.Id),
    partyId: generic_1.Id.optional(),
});
exports.BallotStylesSchema = z
    .array(exports.BallotStyleSchema)
    .nonempty()
    .superRefine((ballotStyles, ctx) => {
    for (const [index, id] of findDuplicateIds(ballotStyles)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, 'id'],
            message: `Duplicate ballot style '${id}' found.`,
        });
    }
});
exports.PartySchema = z.object({
    _lang: exports.TranslationsSchema.optional(),
    id: generic_1.Id,
    name: z.string().nonempty(),
    fullName: z.string().nonempty(),
    abbrev: z.string().nonempty(),
});
exports.PartiesSchema = z
    .array(exports.PartySchema)
    .superRefine((parties, ctx) => {
    for (const [index, id] of findDuplicateIds(parties)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, 'id'],
            message: `Duplicate party '${id}' found.`,
        });
    }
});
exports.PrecinctSchema = z.object({
    _lang: exports.TranslationsSchema.optional(),
    id: generic_1.Id,
    name: z.string().nonempty(),
});
exports.PrecinctsSchema = z
    .array(exports.PrecinctSchema)
    .nonempty()
    .superRefine((precincts, ctx) => {
    for (const [index, id] of findDuplicateIds(precincts)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, 'id'],
            message: `Duplicate precinct '${id}' found.`,
        });
    }
});
exports.DistrictSchema = z.object({
    _lang: exports.TranslationsSchema.optional(),
    id: generic_1.Id,
    name: z.string().nonempty(),
});
exports.DistrictsSchema = z
    .array(exports.DistrictSchema)
    .nonempty()
    .superRefine((districts, ctx) => {
    for (const [index, id] of findDuplicateIds(districts)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, 'id'],
            message: `Duplicate district '${id}' found.`,
        });
    }
});
exports.CountySchema = z.object({
    _lang: exports.TranslationsSchema.optional(),
    id: generic_1.Id,
    name: z.string().nonempty(),
});
exports.BallotLocaleSchema = z.object({
    primary: z.string(),
    secondary: z.string().optional(),
});
exports.BallotStringsSchema = z.record(z.union([z.string(), exports.TranslationsSchema]));
var BallotPaperSize;
(function (BallotPaperSize) {
    BallotPaperSize["Letter"] = "letter";
    BallotPaperSize["Legal"] = "legal";
    BallotPaperSize["Custom8Point5X17"] = "custom8.5x17";
})(BallotPaperSize = exports.BallotPaperSize || (exports.BallotPaperSize = {}));
exports.BallotPaperSizeSchema = z.nativeEnum(BallotPaperSize);
exports.BallotLayoutSchema = z.object({
    paperSize: exports.BallotPaperSizeSchema,
    layoutDensity: z.number().min(0).max(2).optional(),
});
// Hand-marked paper & adjudication
var AdjudicationReason;
(function (AdjudicationReason) {
    AdjudicationReason["UninterpretableBallot"] = "UninterpretableBallot";
    AdjudicationReason["MarginalMark"] = "MarginalMark";
    AdjudicationReason["Overvote"] = "Overvote";
    AdjudicationReason["Undervote"] = "Undervote";
    AdjudicationReason["WriteIn"] = "WriteIn";
    AdjudicationReason["UnmarkedWriteIn"] = "UnmarkedWriteIn";
    AdjudicationReason["BlankBallot"] = "BlankBallot";
})(AdjudicationReason = exports.AdjudicationReason || (exports.AdjudicationReason = {}));
exports.AdjudicationReasonSchema = z.nativeEnum(AdjudicationReason);
exports.MarkThresholdsSchema = z
    .object({
    marginal: z.number().min(0).max(1),
    definite: z.number().min(0).max(1),
    writeInText: z.number().min(0).max(1).optional(),
})
    .refine(({ marginal, definite }) => marginal <= definite, 'marginal mark threshold must be less than or equal to definite mark threshold');
exports.ElectionSchema = z
    .object({
    _lang: exports.TranslationsSchema.optional(),
    adjudicationReasons: z
        .array(z.lazy(() => exports.AdjudicationReasonSchema))
        .optional(),
    ballotLayout: exports.BallotLayoutSchema.optional(),
    ballotStrings: z
        .record(z.union([z.string(), exports.TranslationsSchema]))
        .optional(),
    ballotStyles: exports.BallotStylesSchema,
    centralScanAdjudicationReasons: z
        .array(z.lazy(() => exports.AdjudicationReasonSchema))
        .optional(),
    contests: exports.ContestsSchema,
    county: exports.CountySchema,
    date: generic_1.ISO8601Date,
    districts: exports.DistrictsSchema,
    markThresholds: z.lazy(() => exports.MarkThresholdsSchema).optional(),
    parties: exports.PartiesSchema,
    precinctScanAdjudicationReasons: z
        .array(z.lazy(() => exports.AdjudicationReasonSchema))
        .optional(),
    precincts: exports.PrecinctsSchema,
    seal: z.string().nonempty().optional(),
    sealURL: z.string().nonempty().optional(),
    state: z.string().nonempty(),
    title: z.string().nonempty(),
})
    .superRefine((election, ctx) => {
    if (election.adjudicationReasons) {
        if (election.centralScanAdjudicationReasons) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['adjudicationReasons'],
                message: `Deprecated 'adjudicationReasons' provided while also providing 'centralScanAdjudicationReasons'.`,
            });
        }
        if (election.precinctScanAdjudicationReasons) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['adjudicationReasons'],
                message: `Deprecated 'adjudicationReasons' provided while also providing 'precinctScanAdjudicationReasons'.`,
            });
        }
    }
    for (const [ballotStyleIndex, { id, districts, precincts },] of election.ballotStyles.entries()) {
        for (const [districtIndex, districtId] of districts.entries()) {
            if (!election.districts.some((d) => d.id === districtId)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [
                        'ballotStyles',
                        ballotStyleIndex,
                        'districts',
                        districtIndex,
                    ],
                    message: `Ballot style '${id}' has district '${districtId}', but no such district is defined. Districts defined: [${election.districts
                        .map((d) => d.id)
                        .join(', ')}].`,
                });
            }
        }
        for (const [precinctIndex, precinctId] of precincts.entries()) {
            if (!election.precincts.some((p) => p.id === precinctId)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [
                        'ballotStyles',
                        ballotStyleIndex,
                        'precincts',
                        precinctIndex,
                    ],
                    message: `Ballot style '${id}' has precinct '${precinctId}', but no such precinct is defined. Precincts defined: [${election.precincts
                        .map((p) => p.id)
                        .join(', ')}].`,
                });
            }
        }
    }
    for (const [contestIndex, contest] of election.contests.entries()) {
        if (contest.type === 'candidate') {
            if (contest.partyId &&
                !election.parties.some(({ id }) => id === contest.partyId)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['contests', contestIndex, 'partyId'],
                    message: `Contest '${contest.id}' has party '${contest.partyId}', but no such party is defined. Parties defined: [${election.parties
                        .map(({ id }) => id)
                        .join(', ')}].`,
                });
            }
            for (const [candidateIndex, candidate,] of contest.candidates.entries()) {
                if (candidate.partyId &&
                    !election.parties.some(({ id }) => id === candidate.partyId)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [
                            'contests',
                            contestIndex,
                            'candidates',
                            candidateIndex,
                            'partyId',
                        ],
                        message: `Candidate '${candidate.id}' in contest '${contest.id}' has party '${candidate.partyId}', but no such party is defined. Parties defined: [${election.parties
                            .map(({ id }) => id)
                            .join(', ')}].`,
                    });
                }
            }
        }
    }
})
    /**
     * Support loading election definitions that don't specify central/precinct
     * for adjudication by assuming it's the same for both.
     */
    .transform((election) => {
    if (election.adjudicationReasons &&
        !election.centralScanAdjudicationReasons &&
        !election.precinctScanAdjudicationReasons) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { adjudicationReasons: _adjudicationReasons, ...rest } = election;
        return {
            ...rest,
            centralScanAdjudicationReasons: election.adjudicationReasons,
            precinctScanAdjudicationReasons: election.adjudicationReasons,
        };
    }
    return election;
});
exports.OptionalElectionSchema = exports.ElectionSchema.optional();
exports.ElectionDefinitionSchema = z.object({
    election: exports.ElectionSchema,
    electionData: z.string(),
    electionHash: z.string(),
});
exports.OptionalElectionDefinitionSchema = exports.ElectionDefinitionSchema.optional();
exports.CandidateVoteSchema = z.array(exports.CandidateSchema);
exports.YesNoVoteSchema = z.union([
    z.tuple([z.literal('yes')]),
    z.tuple([z.literal('no')]),
    z.tuple([z.literal('yes'), z.literal('no')]),
    z.tuple([z.literal('no'), z.literal('yes')]),
    z.tuple([]),
]);
exports.OptionalYesNoVoteSchema = exports.YesNoVoteSchema.optional();
exports.VoteSchema = z.union([
    exports.CandidateVoteSchema,
    exports.YesNoVoteSchema,
]);
exports.OptionalVoteSchema = exports.VoteSchema.optional();
exports.VotesDictSchema = z.record(exports.VoteSchema);
var BallotType;
(function (BallotType) {
    BallotType[BallotType["Standard"] = 0] = "Standard";
    BallotType[BallotType["Absentee"] = 1] = "Absentee";
    BallotType[BallotType["Provisional"] = 2] = "Provisional";
})(BallotType = exports.BallotType || (exports.BallotType = {}));
exports.BallotTypeSchema = z.nativeEnum(BallotType);
// Updating this value is a breaking change.
exports.BallotTypeMaximumValue = 2 ** 4 - 1;
exports.CandidateContestOptionSchema = z.object({
    type: z.literal('candidate'),
    id: generic_1.Id,
    contestId: generic_1.Id,
    name: z.string(),
    isWriteIn: z.boolean(),
    optionIndex: z.number().nonnegative(),
});
exports.YesNoContestOptionSchema = z.object({
    type: z.literal('yesno'),
    id: z.union([z.literal('yes'), z.literal('no')]),
    contestId: generic_1.Id,
    name: z.string(),
    optionIndex: z.number().nonnegative(),
});
exports.MsEitherNeitherContestOptionSchema = z.object({
    type: z.literal('ms-either-neither'),
    id: generic_1.Id,
    contestId: generic_1.Id,
    name: z.string(),
    optionIndex: z.number().nonnegative(),
});
exports.ContestOption = z.union([
    exports.CandidateContestOptionSchema,
    exports.YesNoContestOptionSchema,
    exports.MsEitherNeitherContestOptionSchema,
]);
exports.UninterpretableBallotAdjudicationReasonInfoSchema = z.object({
    type: z.literal(AdjudicationReason.UninterpretableBallot),
});
exports.MarginalMarkAdjudicationReasonInfoSchema = z.object({
    type: z.literal(AdjudicationReason.MarginalMark),
    contestId: generic_1.Id,
    optionId: generic_1.Id,
    optionIndex: z.number(),
});
exports.OvervoteAdjudicationReasonInfoSchema = z.object({
    type: z.literal(AdjudicationReason.Overvote),
    contestId: generic_1.Id,
    optionIds: z.array(generic_1.Id),
    optionIndexes: z.array(z.number().nonnegative()),
    expected: z.number(),
});
exports.UndervoteAdjudicationReasonInfoSchema = z.object({
    type: z.literal(AdjudicationReason.Undervote),
    contestId: generic_1.Id,
    optionIds: z.array(generic_1.Id),
    optionIndexes: z.array(z.number().nonnegative()),
    expected: z.number(),
});
exports.WriteInAdjudicationReasonInfoSchema = z.object({
    type: z.literal(AdjudicationReason.WriteIn),
    contestId: generic_1.Id,
    optionId: generic_1.Id,
    optionIndex: z.number().nonnegative(),
});
exports.UnmarkedWriteInAdjudicationReasonInfoSchema = z.object({
    type: z.literal(AdjudicationReason.UnmarkedWriteIn),
    contestId: generic_1.Id,
    optionId: generic_1.Id,
    optionIndex: z.number().nonnegative(),
});
exports.BlankBallotAdjudicationReasonInfoSchema = z.object({
    type: z.literal(AdjudicationReason.BlankBallot),
});
exports.AdjudicationReasonInfoSchema = z.union([
    exports.UninterpretableBallotAdjudicationReasonInfoSchema,
    exports.MarginalMarkAdjudicationReasonInfoSchema,
    exports.OvervoteAdjudicationReasonInfoSchema,
    exports.UndervoteAdjudicationReasonInfoSchema,
    exports.WriteInAdjudicationReasonInfoSchema,
    exports.UnmarkedWriteInAdjudicationReasonInfoSchema,
    exports.BlankBallotAdjudicationReasonInfoSchema,
]);
exports.HMPBBallotPageMetadataSchema = z.object({
    electionHash: generic_1.HexString,
    precinctId: generic_1.Id,
    ballotStyleId: generic_1.Id,
    locales: exports.BallotLocaleSchema,
    pageNumber: z.number(),
    isTestMode: z.boolean(),
    ballotType: exports.BallotTypeSchema,
    ballotId: z.string().optional(),
});
exports.BallotMetadataSchema = z.object({
    electionHash: generic_1.HexString,
    precinctId: generic_1.Id,
    ballotStyleId: generic_1.Id,
    locales: exports.BallotLocaleSchema,
    isTestMode: z.boolean(),
    ballotType: exports.BallotTypeSchema,
});
exports.TargetShapeSchema = z.object({
    bounds: geometry_1.RectSchema,
    inner: geometry_1.RectSchema,
});
exports.BallotStrayMarkSchema = z.object({
    type: z.literal('stray'),
    bounds: geometry_1.RectSchema,
    contest: exports.AnyContestSchema.optional(),
    option: z.union([
        exports.CandidateSchema,
        z.literal('yes'),
        z.literal('no'),
        exports.YesNoOptionSchema,
    ]),
});
exports.BallotCandidateTargetMarkSchema = z.object({
    type: z.literal('candidate'),
    bounds: geometry_1.RectSchema,
    contest: exports.CandidateContestSchema,
    target: exports.TargetShapeSchema,
    option: exports.CandidateSchema,
    score: z.number().min(0).max(1),
    scoredOffset: geometry_1.OffsetSchema,
    writeInTextScore: z.number().min(0).max(1).optional(),
});
exports.BallotYesNoTargetMarkSchema = z.object({
    type: z.literal('yesno'),
    bounds: geometry_1.RectSchema,
    contest: exports.YesNoContestSchema,
    target: exports.TargetShapeSchema,
    option: z.union([z.literal('yes'), z.literal('no')]),
    score: z.number(),
    scoredOffset: geometry_1.OffsetSchema,
});
exports.BallotMsEitherNeitherTargetMarkSchema = z.object({
    type: z.literal('ms-either-neither'),
    bounds: geometry_1.RectSchema,
    contest: exports.MsEitherNeitherContestSchema,
    target: exports.TargetShapeSchema,
    option: exports.YesNoOptionSchema,
    score: z.number(),
    scoredOffset: geometry_1.OffsetSchema,
});
exports.BallotTargetMarkSchema = z.union([
    exports.BallotCandidateTargetMarkSchema,
    exports.BallotYesNoTargetMarkSchema,
    exports.BallotMsEitherNeitherTargetMarkSchema,
]);
exports.BallotMarkSchema = z.union([
    exports.BallotStrayMarkSchema,
    exports.BallotTargetMarkSchema,
]);
exports.MarkInfoSchema = z.object({
    marks: z.array(exports.BallotMarkSchema),
    ballotSize: geometry_1.SizeSchema,
});
exports.AdjudicationInfoSchema = z.object({
    requiresAdjudication: z.boolean(),
    enabledReasons: z.array(exports.AdjudicationReasonSchema),
    enabledReasonInfos: z.array(exports.AdjudicationReasonInfoSchema),
    ignoredReasonInfos: z.array(exports.AdjudicationReasonInfoSchema),
});
exports.BlankPageSchema = z.object({
    type: z.literal('BlankPage'),
});
exports.InterpretedBmdPageSchema = z.object({
    type: z.literal('InterpretedBmdPage'),
    ballotId: generic_1.Id,
    metadata: exports.BallotMetadataSchema,
    votes: exports.VotesDictSchema,
});
exports.InterpretedHmpbPageSchema = z.object({
    type: z.literal('InterpretedHmpbPage'),
    ballotId: z.string().optional(),
    metadata: exports.HMPBBallotPageMetadataSchema,
    markInfo: exports.MarkInfoSchema,
    votes: exports.VotesDictSchema,
    adjudicationInfo: exports.AdjudicationInfoSchema,
});
exports.InvalidElectionHashPageSchema = z.object({
    type: z.literal('InvalidElectionHashPage'),
    expectedElectionHash: z.string(),
    actualElectionHash: z.string(),
});
exports.InvalidTestModePageSchema = z.object({
    type: z.literal('InvalidTestModePage'),
    metadata: z.union([exports.BallotMetadataSchema, exports.HMPBBallotPageMetadataSchema]),
});
exports.InvalidPrecinctPageSchema = z.object({
    type: z.literal('InvalidPrecinctPage'),
    metadata: z.union([exports.BallotMetadataSchema, exports.HMPBBallotPageMetadataSchema]),
});
exports.UninterpretedHmpbPageSchema = z.object({
    type: z.literal('UninterpretedHmpbPage'),
    metadata: exports.HMPBBallotPageMetadataSchema,
});
exports.UnreadablePageSchema = z.object({
    type: z.literal('UnreadablePage'),
    reason: z.string().optional(),
});
exports.ImageInfoSchema = z.object({
    url: z.string(),
});
exports.PageInterpretationSchema = z.union([
    exports.BlankPageSchema,
    exports.InterpretedBmdPageSchema,
    exports.InterpretedHmpbPageSchema,
    exports.InvalidElectionHashPageSchema,
    exports.InvalidTestModePageSchema,
    exports.InvalidPrecinctPageSchema,
    exports.UninterpretedHmpbPageSchema,
    exports.UnreadablePageSchema,
]);
exports.BallotPageInfoSchema = z.object({
    image: exports.ImageInfoSchema,
    interpretation: exports.PageInterpretationSchema,
    adjudicationFinishedAt: api_1.ISO8601TimestampSchema.optional(),
});
exports.BallotSheetInfoSchema = z.object({
    id: generic_1.Id,
    front: exports.BallotPageInfoSchema,
    back: exports.BallotPageInfoSchema,
    adjudicationReason: exports.AdjudicationReasonSchema.optional(),
});
exports.CardDataTypesSchema = z.union([
    z.literal('voter'),
    z.literal('pollworker'),
    z.literal('admin'),
]);
const CardDataInternalSchema = z.object({
    t: exports.CardDataTypesSchema,
});
exports.CardDataSchema = CardDataInternalSchema;
exports.VoterCardDataSchema = CardDataInternalSchema.extend({
    t: z.literal('voter'),
    c: z.number(),
    bs: generic_1.Id,
    pr: generic_1.Id,
    uz: z.number().optional(),
    bp: z.number().optional(),
    u: z.number().optional(),
    m: generic_1.Id.optional(),
});
exports.PollworkerCardDataSchema = CardDataInternalSchema.extend({
    t: z.literal('pollworker'),
    h: generic_1.HexString,
});
exports.AdminCardDataSchema = CardDataInternalSchema.extend({
    t: z.literal('admin'),
    h: generic_1.HexString,
    p: z.string().optional(),
});
exports.AnyCardDataSchema = z.union([
    exports.VoterCardDataSchema,
    exports.PollworkerCardDataSchema,
    exports.AdminCardDataSchema,
]);
/**
 * Gets contests which belong to a ballot style in an election.
 */
const getContests = ({ ballotStyle, election, }) => election.contests.filter((c) => ballotStyle.districts.includes(c.districtId) &&
    ballotStyle.partyId === c.partyId);
exports.getContests = getContests;
/**
 * Get all MS either-neither contests.
 */
const getEitherNeitherContests = (contests) => {
    return contests.filter((c) => c.type === 'ms-either-neither');
};
exports.getEitherNeitherContests = getEitherNeitherContests;
const expandEitherNeitherContests = (contests) => {
    return contests.flatMap((contest) => contest.type !== 'ms-either-neither'
        ? [contest]
        : [
            {
                type: 'yesno',
                id: contest.eitherNeitherContestId,
                title: `${contest.title} – Either/Neither`,
                districtId: contest.districtId,
                section: contest.section,
                description: contest.description,
                yesOption: contest.eitherOption,
                noOption: contest.neitherOption,
                ...(contest.partyId ? { partyId: contest.partyId } : {}),
            },
            {
                type: 'yesno',
                id: contest.pickOneContestId,
                title: `${contest.title} – Pick One`,
                districtId: contest.districtId,
                section: contest.section,
                description: contest.description,
                yesOption: contest.firstOption,
                noOption: contest.secondOption,
                ...(contest.partyId ? { partyId: contest.partyId } : {}),
            },
        ]);
};
exports.expandEitherNeitherContests = expandEitherNeitherContests;
/**
 * Retrieves a precinct by id.
 */
const getPrecinctById = ({ election, precinctId, }) => election.precincts.find((p) => p.id === precinctId);
exports.getPrecinctById = getPrecinctById;
/**
 * Retrieves a ballot style by id.
 */
const getBallotStyle = ({ ballotStyleId, election, }) => election.ballotStyles.find((bs) => bs.id === ballotStyleId);
exports.getBallotStyle = getBallotStyle;
/**
 * Retrieve a contest from a set of contests based on ID
 * special-cases Ms Either Neither contests
 */
const findContest = ({ contests, contestId, }) => {
    return contests.find((c) => c.type === 'ms-either-neither'
        ? c.eitherNeitherContestId === contestId ||
            c.pickOneContestId === contestId
        : c.id === contestId);
};
exports.findContest = findContest;
/**
 * Validates the votes for a given ballot style in a given election.
 *
 * @throws When an inconsistency is found.
 */
const validateVotes = ({ votes, ballotStyle, election, }) => {
    const contests = exports.getContests({ election, ballotStyle });
    for (const contestId of Object.getOwnPropertyNames(votes)) {
        const contest = exports.findContest({ contests, contestId });
        if (!contest) {
            throw new Error(`found a vote with contest id ${JSON.stringify(contestId)}, but no such contest exists in ballot style ${ballotStyle.id} (expected one of ${contests.map((c) => c.id).join(', ')})`);
        }
    }
};
exports.validateVotes = validateVotes;
/**
 * @deprecated Does not support i18n. 'party.fullname` should be used instead.
 * Gets the adjective used to describe the political party for a primary
 * election, e.g. "Republican" or "Democratic".
 */
const getPartyPrimaryAdjectiveFromBallotStyle = ({ ballotStyleId, election, }) => {
    const parts = /(\d+)(\w+)/i.exec(ballotStyleId);
    const abbrev = parts === null || parts === void 0 ? void 0 : parts[2];
    const party = election.parties.find((p) => p.abbrev === abbrev);
    const name = party === null || party === void 0 ? void 0 : party.name;
    return (name === 'Democrat' && 'Democratic') || name || '';
};
exports.getPartyPrimaryAdjectiveFromBallotStyle = getPartyPrimaryAdjectiveFromBallotStyle;
/**
 * Gets the full name of the political party for a primary election,
 * e.g. "Republican Party" or "Democratic Party".
 */
const getPartyFullNameFromBallotStyle = ({ ballotStyleId, election, }) => {
    var _a;
    const ballotStyle = exports.getBallotStyle({ ballotStyleId, election });
    const party = election.parties.find((p) => p.id === (ballotStyle === null || ballotStyle === void 0 ? void 0 : ballotStyle.partyId));
    return (_a = party === null || party === void 0 ? void 0 : party.fullName) !== null && _a !== void 0 ? _a : '';
};
exports.getPartyFullNameFromBallotStyle = getPartyFullNameFromBallotStyle;
function getDistrictIdsForPartyId(election, partyId) {
    return election.ballotStyles
        .filter((bs) => bs.partyId === partyId)
        .flatMap((bs) => bs.districts);
}
exports.getDistrictIdsForPartyId = getDistrictIdsForPartyId;
/**
 * Helper function to build a `VotesDict` more easily, primarily for testing.
 *
 * @param contests The contests the voter voted in, probably from `getContests`.
 * @param shorthand A mapping of contest id to "vote", where a vote can be a
 * `Vote`, the string id of a candidate, multiple string ids for candidates, or
 * just a `Candidate` by itself.
 *
 * @example
 *
 * // Vote by candidate id.
 * vote(contests, { president: 'boone-lian' })
 *
 * // Vote by yesno contest.
 * vote(contests, { 'question-a': 'yes' })
 *
 * // Multiple votes.
 * vote(contests, {
 *   president: 'boone-lian',
 *   'question-a': 'yes'
 * })
 *
 * // Multiple candidate selections.
 * vote(contests, {
 *   'city-council': ['rupp', 'davis']
 * })
 */
function vote(contests, shorthand) {
    return Object.getOwnPropertyNames(shorthand).reduce((result, contestId) => {
        const contest = exports.findContest({ contests, contestId });
        if (!contest) {
            throw new Error(`unknown contest ${contestId}`);
        }
        const choice = shorthand[contestId];
        if (contest.type !== 'candidate') {
            return { ...result, [contestId]: choice };
        }
        if (Array.isArray(choice) && typeof choice[0] === 'string') {
            return {
                ...result,
                [contestId]: contest.candidates.filter((c) => choice.includes(c.id)),
            };
        }
        if (typeof choice === 'string') {
            return {
                ...result,
                [contestId]: [contest.candidates.find((c) => c.id === choice)],
            };
        }
        return {
            ...result,
            [contestId]: Array.isArray(choice) ? choice : [choice],
        };
    }, {});
}
exports.vote = vote;
function isVotePresent(v) {
    return !!v && v.length > 0;
}
exports.isVotePresent = isVotePresent;
/**
 * Helper function to get array of locale codes used in election definition.
 */
const getElectionLocales = (election, baseLocale = 'en-US') => election._lang ? [baseLocale, ...Object.keys(election._lang)] : [baseLocale];
exports.getElectionLocales = getElectionLocales;
function copyWithLocale(value, locale) {
    if (Array.isArray(value)) {
        return value.map((element) => copyWithLocale(element, locale));
    }
    if (typeof value === 'undefined') {
        return value;
    }
    if (typeof value === 'object') {
        const record = value;
        const lang = '_lang' in record && record._lang;
        if (!lang) {
            return value;
        }
        const stringsEntry = Object.entries(lang).find(([key]) => key.toLowerCase() === locale.toLowerCase());
        if (!stringsEntry || !stringsEntry[1]) {
            return value;
        }
        const strings = stringsEntry[1];
        const result = {};
        for (const [key, val] of Object.entries(record)) {
            if (key === '_lang') {
                continue;
            }
            if (key in strings) {
                result[key] = strings[key];
            }
            else {
                result[key] = copyWithLocale(val, locale);
            }
        }
        return result;
    }
    return value;
}
/**
 * Copies an election definition preferring strings from the matching locale.
 */
function withLocale(election, locale) {
    return copyWithLocale(election, locale);
}
exports.withLocale = withLocale;
function safeParseElection(value) {
    if (typeof value === 'string') {
        return generic_1.safeParseJSON(value, exports.ElectionSchema);
    }
    return generic_1.safeParse(exports.ElectionSchema, value);
}
exports.safeParseElection = safeParseElection;
/**
 * Parses `value` as a JSON `Election`, computing the election hash if the
 * result is `Ok`.
 */
function safeParseElectionDefinition(value) {
    const result = safeParseElection(value);
    return result.isErr()
        ? result
        : generic_1.ok({
            election: result.ok(),
            electionData: value,
            electionHash: crypto_1.createHash('sha256').update(value).digest('hex'),
        });
}
exports.safeParseElectionDefinition = safeParseElectionDefinition;
/**
 * @deprecated use `safeParseElection(…)` instead
 */
function parseElection(value) {
    const result = safeParseElection(value);
    if (result.isErr()) {
        throw result.err();
    }
    return result.ok();
}
exports.parseElection = parseElection;
