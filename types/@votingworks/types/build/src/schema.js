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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeParseElectionDefinition = exports.safeParseElection = exports.parseElection = exports.safeParseJSON = exports.safeParse = exports.AnyCardData = exports.AdminCardData = exports.PollworkerCardData = exports.VoterCardData = exports.CardData = exports.CardDataTypes = exports.BallotType = exports.VotesDict = exports.OptionalVote = exports.Vote = exports.OptionalYesNoVote = exports.YesNoVote = exports.CandidateVote = exports.OptionalElectionDefinition = exports.ElectionDefinition = exports.OptionalElection = exports.Election = exports.County = exports.Districts = exports.District = exports.Precincts = exports.Precinct = exports.Parties = exports.Party = exports.BallotStyles = exports.BallotStyle = exports.BallotPaperSize = exports.AdjudicationReason = exports.MarkThresholds = exports.Contests = exports.AnyContest = exports.MsEitherOrContest = exports.YesNoContest = exports.YesNoOption = exports.CandidateContest = exports.Contest = exports.ContestTypes = exports.OptionalCandidate = exports.Candidate = exports.ISO8601Date = exports.HexString = exports.Id = exports.Translations = void 0;
const iso8601_1 = __importDefault(require("@antongolub/iso8601"));
const crypto_1 = require("crypto");
const z = __importStar(require("zod"));
const t = __importStar(require("./election"));
const election_1 = require("./election");
const generic_1 = require("./generic");
// Generic
exports.Translations = z.record(z.record(z.string()));
exports.Id = z
    .string()
    .nonempty()
    .refine((id) => !id.startsWith('_'), 'IDs may not start with an underscore')
    .refine((id) => /^[-_a-z\d]+$/i.test(id), 'IDs may only contain letters, numbers, dashes, and underscores');
exports.HexString = z
    .string()
    .nonempty()
    .refine((hex) => /^[0-9a-f]*$/i.test(hex), 'hex strings must contain only 0-9 and a-f');
exports.ISO8601Date = z
    .string()
    .refine(iso8601_1.default, 'dates must be in ISO8601 format');
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
// Candidates
exports.Candidate = z.object({
    _lang: exports.Translations.optional(),
    id: exports.Id,
    name: z.string().nonempty(),
    partyId: exports.Id.optional(),
    isWriteIn: z.boolean().optional(),
});
exports.OptionalCandidate = exports.Candidate.optional();
// Contests
exports.ContestTypes = z.union([
    z.literal('candidate'),
    z.literal('yesno'),
    z.literal('ms-either-neither'),
]);
const ContestInternal = z.object({
    _lang: exports.Translations.optional(),
    id: exports.Id,
    districtId: exports.Id,
    partyId: exports.Id.optional(),
    section: z.string().nonempty(),
    title: z.string().nonempty(),
    type: exports.ContestTypes,
});
exports.Contest = ContestInternal;
exports.CandidateContest = ContestInternal.merge(z.object({
    type: z.literal('candidate'),
    seats: z.number().int().positive(),
    candidates: z.array(exports.Candidate),
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
exports.YesNoOption = z.object({
    id: exports.Id,
    label: z.string().nonempty(),
});
exports.YesNoContest = ContestInternal.merge(z.object({
    type: z.literal('yesno'),
    description: z.string().nonempty(),
    shortTitle: z.string().nonempty().optional(),
    yesOption: exports.YesNoOption.optional(),
    noOption: exports.YesNoOption.optional(),
}));
exports.MsEitherOrContest = ContestInternal.merge(z.object({
    type: z.literal('ms-either-neither'),
    eitherNeitherContestId: exports.Id,
    pickOneContestId: exports.Id,
    description: z.string().nonempty(),
    eitherNeitherLabel: z.string().nonempty(),
    pickOneLabel: z.string().nonempty(),
    eitherOption: exports.YesNoOption,
    neitherOption: exports.YesNoOption,
    firstOption: exports.YesNoOption,
    secondOption: exports.YesNoOption,
}));
exports.AnyContest = z.union([
    exports.CandidateContest,
    exports.YesNoContest,
    exports.MsEitherOrContest,
]);
exports.Contests = z.array(exports.AnyContest).superRefine((contests, ctx) => {
    for (const [index, id] of findDuplicateIds(contests)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, 'id'],
            message: `Duplicate contest '${id}' found.`,
        });
    }
});
// Hand-marked paper & adjudication
exports.MarkThresholds = z
    .object({
    marginal: z.number().min(0).max(1),
    definite: z.number().min(0).max(1),
})
    .refine(({ marginal, definite }) => marginal <= definite, 'marginal mark threshold must be less than or equal to definite mark threshold');
exports.AdjudicationReason = z.lazy(() => z.nativeEnum(election_1.AdjudicationReason));
exports.BallotPaperSize = z.lazy(() => z.nativeEnum(election_1.BallotPaperSize));
// Election
exports.BallotStyle = z.object({
    _lang: exports.Translations.optional(),
    id: exports.Id,
    precincts: z.array(exports.Id),
    districts: z.array(exports.Id),
    partyId: exports.Id.optional(),
});
exports.BallotStyles = z
    .array(exports.BallotStyle)
    .superRefine((ballotStyles, ctx) => {
    for (const [index, id] of findDuplicateIds(ballotStyles)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, 'id'],
            message: `Duplicate ballot style '${id}' found.`,
        });
    }
});
exports.Party = z.object({
    _lang: exports.Translations.optional(),
    id: exports.Id,
    name: z.string().nonempty(),
    fullName: z.string().nonempty(),
    abbrev: z.string().nonempty(),
});
exports.Parties = z
    .array(exports.Party)
    .superRefine((parties, ctx) => {
    for (const [index, id] of findDuplicateIds(parties)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, 'id'],
            message: `Duplicate party '${id}' found.`,
        });
    }
});
exports.Precinct = z.object({
    _lang: exports.Translations.optional(),
    id: exports.Id,
    name: z.string().nonempty(),
});
exports.Precincts = z.array(exports.Precinct).superRefine((precincts, ctx) => {
    for (const [index, id] of findDuplicateIds(precincts)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, 'id'],
            message: `Duplicate precinct '${id}' found.`,
        });
    }
});
exports.District = z.object({
    _lang: exports.Translations.optional(),
    id: exports.Id,
    name: z.string().nonempty(),
});
exports.Districts = z.array(exports.District).superRefine((districts, ctx) => {
    for (const [index, id] of findDuplicateIds(districts)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, 'id'],
            message: `Duplicate district '${id}' found.`,
        });
    }
});
exports.County = z.object({
    _lang: exports.Translations.optional(),
    id: exports.Id,
    name: z.string().nonempty(),
});
const BallotLayout = z.object({
    paperSize: exports.BallotPaperSize,
});
exports.Election = z
    .object({
    _lang: exports.Translations.optional(),
    adjudicationReasons: z.array(exports.AdjudicationReason).optional(),
    ballotLayout: BallotLayout.optional(),
    ballotStrings: z.record(z.union([z.string(), exports.Translations])).optional(),
    ballotStyles: exports.BallotStyles,
    contests: exports.Contests,
    county: exports.County,
    date: exports.ISO8601Date,
    districts: exports.Districts,
    markThresholds: exports.MarkThresholds.optional(),
    parties: exports.Parties,
    precincts: exports.Precincts,
    seal: z.string().nonempty().optional(),
    sealURL: z.string().nonempty().optional(),
    state: z.string().nonempty(),
    title: z.string().nonempty(),
})
    .superRefine((election, ctx) => {
    for (const [ballotStyleIndex, { id, districts, precincts },] of election.ballotStyles.entries()) {
        for (const [districtIndex, districtId] of districts.entries()) {
            if (!election.districts.some(({ id }) => id === districtId)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [
                        'ballotStyles',
                        ballotStyleIndex,
                        'districts',
                        districtIndex,
                    ],
                    message: `Ballot style '${id}' has district '${districtId}', but no such district is defined. Districts defined: [${election.districts
                        .map(({ id }) => id)
                        .join(', ')}].`,
                });
            }
        }
        for (const [precinctIndex, precinctId] of precincts.entries()) {
            if (!election.precincts.some(({ id }) => id === precinctId)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [
                        'ballotStyles',
                        ballotStyleIndex,
                        'precincts',
                        precinctIndex,
                    ],
                    message: `Ballot style '${id}' has precinct '${precinctId}', but no such precinct is defined. Precincts defined: [${election.precincts
                        .map(({ id }) => id)
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
});
exports.OptionalElection = exports.Election.optional();
exports.ElectionDefinition = z.object({
    election: exports.Election,
    electionData: z.string(),
    electionHash: z.string(),
});
exports.OptionalElectionDefinition = exports.ElectionDefinition.optional();
// Votes
exports.CandidateVote = z.array(exports.Candidate);
exports.YesNoVote = z.union([
    z.tuple([z.literal('yes')]),
    z.tuple([z.literal('no')]),
    z.tuple([z.literal('yes'), z.literal('no')]),
    z.tuple([z.literal('no'), z.literal('yes')]),
    z.tuple([]),
]);
exports.OptionalYesNoVote = exports.YesNoVote.optional();
exports.Vote = z.union([exports.CandidateVote, exports.YesNoVote]);
exports.OptionalVote = exports.Vote.optional();
exports.VotesDict = z.record(exports.Vote);
exports.BallotType = z.nativeEnum(t.BallotType);
exports.CardDataTypes = z.union([
    z.literal('voter'),
    z.literal('pollworker'),
    z.literal('admin'),
]);
const CardDataInternal = z.object({
    t: exports.CardDataTypes,
});
exports.CardData = CardDataInternal;
exports.VoterCardData = CardDataInternal.extend({
    t: z.literal('voter'),
    c: z.number(),
    bs: exports.Id,
    pr: exports.Id,
    uz: z.number().optional(),
    bp: z.number().optional(),
    u: z.number().optional(),
    m: exports.Id.optional(),
});
exports.PollworkerCardData = CardDataInternal.extend({
    t: z.literal('pollworker'),
    h: exports.HexString,
});
exports.AdminCardData = CardDataInternal.extend({
    t: z.literal('admin'),
    h: exports.HexString,
});
exports.AnyCardData = z.union([
    exports.VoterCardData,
    exports.PollworkerCardData,
    exports.AdminCardData,
]);
/**
 * Parse `value` using `parser`. Note that this takes an object that is already
 * supposed to be of type `T`, not a JSON string. For that, use `safeParseJSON`.
 *
 * @returns `Ok` when the parse succeeded, `Err` otherwise.
 */
function safeParse(parser, value) {
    const result = parser.safeParse(value);
    if (!result.success) {
        return generic_1.err(result.error);
    }
    return generic_1.ok(result.data);
}
exports.safeParse = safeParse;
function safeParseJSON(text, parser) {
    let parsed;
    try {
        parsed = JSON.parse(text);
    }
    catch (error) {
        return generic_1.err(error);
    }
    return parser ? safeParse(parser, parsed) : generic_1.ok(parsed);
}
exports.safeParseJSON = safeParseJSON;
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
function safeParseElection(value) {
    if (typeof value === 'string') {
        return safeParseJSON(value, exports.Election);
    }
    else {
        return safeParse(exports.Election, value);
    }
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
