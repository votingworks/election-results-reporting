import * as z from 'zod';
import { ISO8601Timestamp } from './api';
import { Dictionary, Optional, Result } from './generic';
import { Offset, Rect, Size } from './geometry';
export declare type Translations = Record<string, Record<string, string> | undefined>;
export declare const TranslationsSchema: z.ZodSchema<Translations>;
export interface Candidate {
    readonly id: string;
    readonly name: string;
    readonly partyId?: string;
    readonly isWriteIn?: boolean;
}
export declare const CandidateSchema: z.ZodSchema<Candidate>;
export declare const writeInCandidate: Candidate;
export declare type OptionalCandidate = Optional<Candidate>;
export declare const OptionalCandidateSchema: z.ZodSchema<OptionalCandidate>;
export declare type ContestTypes = 'candidate' | 'yesno' | 'ms-either-neither';
export declare const ContestTypesSchema: z.ZodSchema<ContestTypes>;
export interface Contest {
    readonly id: string;
    readonly districtId: string;
    readonly partyId?: string;
    readonly section: string;
    readonly title: string;
    readonly type: ContestTypes;
}
export declare const ContestSchema: z.ZodSchema<Contest>;
export interface CandidateContest extends Contest {
    readonly type: 'candidate';
    readonly seats: number;
    readonly candidates: readonly Candidate[];
    readonly allowWriteIns: boolean;
}
export declare const CandidateContestSchema: z.ZodSchema<CandidateContest>;
export interface YesNoOption {
    readonly id: string;
    readonly label: string;
}
export declare const YesNoOptionSchema: z.ZodSchema<YesNoOption>;
export interface YesNoContest extends Contest {
    readonly type: 'yesno';
    readonly description: string;
    readonly shortTitle?: string;
    readonly yesOption?: YesNoOption;
    readonly noOption?: YesNoOption;
}
export declare const YesNoContestSchema: z.ZodSchema<YesNoContest>;
export interface MsEitherNeitherContest extends Contest {
    readonly type: 'ms-either-neither';
    readonly eitherNeitherContestId: string;
    readonly pickOneContestId: string;
    readonly description: string;
    readonly eitherNeitherLabel: string;
    readonly pickOneLabel: string;
    readonly eitherOption: YesNoOption;
    readonly neitherOption: YesNoOption;
    readonly firstOption: YesNoOption;
    readonly secondOption: YesNoOption;
}
export declare const MsEitherNeitherContestSchema: z.ZodSchema<MsEitherNeitherContest>;
export declare type AnyContest = CandidateContest | YesNoContest | MsEitherNeitherContest;
export declare const AnyContestSchema: z.ZodSchema<AnyContest>;
export declare type Contests = readonly AnyContest[];
export declare const ContestsSchema: z.ZodEffects<z.ZodArray<z.ZodType<AnyContest, z.ZodTypeDef, AnyContest>>, AnyContest[]>;
export interface BallotStyle {
    readonly id: string;
    readonly precincts: readonly string[];
    readonly districts: readonly string[];
    readonly partyId?: string;
}
export declare const BallotStyleSchema: z.ZodSchema<BallotStyle>;
export declare const BallotStylesSchema: z.ZodEffects<z.ZodNonEmptyArray<z.ZodType<BallotStyle, z.ZodTypeDef, BallotStyle>>, [BallotStyle, ...BallotStyle[]]>;
export interface Party {
    readonly id: string;
    readonly name: string;
    readonly fullName: string;
    readonly abbrev: string;
}
export declare const PartySchema: z.ZodSchema<Party>;
export declare type Parties = readonly Party[];
export declare const PartiesSchema: z.ZodSchema<Parties>;
export interface Precinct {
    readonly id: string;
    readonly name: string;
}
export declare const PrecinctSchema: z.ZodSchema<Precinct>;
export declare const PrecinctsSchema: z.ZodEffects<z.ZodNonEmptyArray<z.ZodType<Precinct, z.ZodTypeDef, Precinct>>, [Precinct, ...Precinct[]]>;
export interface District {
    readonly id: string;
    readonly name: string;
}
export declare const DistrictSchema: z.ZodSchema<District>;
export declare const DistrictsSchema: z.ZodEffects<z.ZodNonEmptyArray<z.ZodType<District, z.ZodTypeDef, District>>, [District, ...District[]]>;
export interface County {
    readonly id: string;
    readonly name: string;
}
export declare const CountySchema: z.ZodSchema<County>;
export interface BallotLocale {
    readonly primary: string;
    readonly secondary?: string;
}
export declare const BallotLocaleSchema: z.ZodSchema<BallotLocale>;
export declare type BallotStrings = Record<string, string | Translations>;
export declare const BallotStringsSchema: z.ZodSchema<BallotStrings>;
export declare enum BallotPaperSize {
    Letter = "letter",
    Legal = "legal",
    Custom8Point5X17 = "custom8.5x17"
}
export declare const BallotPaperSizeSchema: z.ZodSchema<BallotPaperSize>;
export interface BallotLayout {
    paperSize: BallotPaperSize;
    layoutDensity?: number;
}
export declare const BallotLayoutSchema: z.ZodSchema<BallotLayout>;
export declare enum AdjudicationReason {
    UninterpretableBallot = "UninterpretableBallot",
    MarginalMark = "MarginalMark",
    Overvote = "Overvote",
    Undervote = "Undervote",
    WriteIn = "WriteIn",
    UnmarkedWriteIn = "UnmarkedWriteIn",
    BlankBallot = "BlankBallot"
}
export declare const AdjudicationReasonSchema: z.ZodSchema<AdjudicationReason>;
export interface MarkThresholds {
    readonly marginal: number;
    readonly definite: number;
    readonly writeInText?: number;
}
export declare const MarkThresholdsSchema: z.ZodSchema<MarkThresholds>;
export interface Election {
    readonly _lang?: Translations;
    /** @deprecated Use `precinctScanAdjudicationReasons` or `centralScanAdjudicationReasons` */
    readonly adjudicationReasons?: readonly AdjudicationReason[];
    readonly ballotLayout?: BallotLayout;
    readonly ballotStrings?: BallotStrings;
    readonly ballotStyles: readonly BallotStyle[];
    readonly centralScanAdjudicationReasons?: readonly AdjudicationReason[];
    readonly contests: Contests;
    readonly county: County;
    readonly date: string;
    readonly districts: readonly District[];
    readonly markThresholds?: MarkThresholds;
    readonly parties: Parties;
    readonly precinctScanAdjudicationReasons?: readonly AdjudicationReason[];
    readonly precincts: readonly Precinct[];
    readonly seal?: string;
    readonly sealURL?: string;
    readonly state: string;
    readonly title: string;
}
export declare const ElectionSchema: z.ZodSchema<Election>;
export declare type OptionalElection = Optional<Election>;
export declare const OptionalElectionSchema: z.ZodSchema<OptionalElection>;
export interface ElectionDefinition {
    election: Election;
    electionData: string;
    electionHash: string;
}
export declare const ElectionDefinitionSchema: z.ZodSchema<ElectionDefinition>;
export declare type OptionalElectionDefinition = Optional<ElectionDefinition>;
export declare const OptionalElectionDefinitionSchema: z.ZodSchema<OptionalElectionDefinition>;
export declare type CandidateVote = readonly Candidate[];
export declare const CandidateVoteSchema: z.ZodSchema<CandidateVote>;
export declare type YesNoVote = readonly ['yes'] | readonly ['no'] | readonly ['yes', 'no'] | readonly ['no', 'yes'] | readonly [];
export declare type YesOrNo = Exclude<YesNoVote[0] | YesNoVote[1], undefined>;
export declare const YesNoVoteSchema: z.ZodSchema<YesNoVote>;
export declare type OptionalYesNoVote = Optional<YesNoVote>;
export declare const OptionalYesNoVoteSchema: z.ZodSchema<OptionalYesNoVote>;
export declare type Vote = CandidateVote | YesNoVote;
export declare const VoteSchema: z.ZodSchema<Vote>;
export declare type OptionalVote = Optional<Vote>;
export declare const OptionalVoteSchema: z.ZodSchema<OptionalVote>;
export declare type VotesDict = Dictionary<Vote>;
export declare const VotesDictSchema: z.ZodSchema<VotesDict>;
export declare enum BallotType {
    Standard = 0,
    Absentee = 1,
    Provisional = 2
}
export declare const BallotTypeSchema: z.ZodSchema<BallotType>;
export declare const BallotTypeMaximumValue: number;
export interface CandidateContestOption {
    type: CandidateContest['type'];
    id: Candidate['id'];
    contestId: CandidateContest['id'];
    name: Candidate['name'];
    isWriteIn: boolean;
    optionIndex: number;
}
export declare const CandidateContestOptionSchema: z.ZodSchema<CandidateContestOption>;
export interface YesNoContestOption {
    type: YesNoContest['type'];
    id: Exclude<YesNoVote[0] | YesNoVote[1], undefined>;
    contestId: YesNoContest['id'];
    name: string;
    optionIndex: number;
}
export declare const YesNoContestOptionSchema: z.ZodSchema<YesNoContestOption>;
export interface MsEitherNeitherContestOption {
    type: MsEitherNeitherContest['type'];
    id: MsEitherNeitherContest['eitherOption']['id'] | MsEitherNeitherContest['neitherOption']['id'] | MsEitherNeitherContest['firstOption']['id'] | MsEitherNeitherContest['secondOption']['id'];
    contestId: MsEitherNeitherContest['eitherNeitherContestId'] | MsEitherNeitherContest['pickOneContestId'];
    name: string;
    optionIndex: number;
}
export declare const MsEitherNeitherContestOptionSchema: z.ZodSchema<MsEitherNeitherContestOption>;
export declare type ContestOption = CandidateContestOption | YesNoContestOption | MsEitherNeitherContestOption;
export declare const ContestOption: z.ZodSchema<ContestOption>;
export interface UninterpretableBallotAdjudicationReasonInfo {
    type: AdjudicationReason.UninterpretableBallot;
}
export declare const UninterpretableBallotAdjudicationReasonInfoSchema: z.ZodSchema<UninterpretableBallotAdjudicationReasonInfo>;
export interface MarginalMarkAdjudicationReasonInfo {
    type: AdjudicationReason.MarginalMark;
    contestId: Contest['id'];
    optionId: ContestOption['id'];
    optionIndex: number;
}
export declare const MarginalMarkAdjudicationReasonInfoSchema: z.ZodSchema<MarginalMarkAdjudicationReasonInfo>;
export interface OvervoteAdjudicationReasonInfo {
    type: AdjudicationReason.Overvote;
    contestId: Contest['id'];
    optionIds: readonly ContestOption['id'][];
    optionIndexes: readonly number[];
    expected: number;
}
export declare const OvervoteAdjudicationReasonInfoSchema: z.ZodSchema<OvervoteAdjudicationReasonInfo>;
export interface UndervoteAdjudicationReasonInfo {
    type: AdjudicationReason.Undervote;
    contestId: Contest['id'];
    optionIds: readonly ContestOption['id'][];
    optionIndexes: readonly number[];
    expected: number;
}
export declare const UndervoteAdjudicationReasonInfoSchema: z.ZodSchema<UndervoteAdjudicationReasonInfo>;
export interface WriteInAdjudicationReasonInfo {
    type: AdjudicationReason.WriteIn;
    contestId: Contest['id'];
    optionId: ContestOption['id'];
    optionIndex: number;
}
export declare const WriteInAdjudicationReasonInfoSchema: z.ZodSchema<WriteInAdjudicationReasonInfo>;
export interface UnmarkedWriteInAdjudicationReasonInfo {
    type: AdjudicationReason.UnmarkedWriteIn;
    contestId: Contest['id'];
    optionId: ContestOption['id'];
    optionIndex: number;
}
export declare const UnmarkedWriteInAdjudicationReasonInfoSchema: z.ZodSchema<UnmarkedWriteInAdjudicationReasonInfo>;
export interface BlankBallotAdjudicationReasonInfo {
    type: AdjudicationReason.BlankBallot;
}
export declare const BlankBallotAdjudicationReasonInfoSchema: z.ZodSchema<BlankBallotAdjudicationReasonInfo>;
export declare type AdjudicationReasonInfo = UninterpretableBallotAdjudicationReasonInfo | MarginalMarkAdjudicationReasonInfo | OvervoteAdjudicationReasonInfo | UndervoteAdjudicationReasonInfo | WriteInAdjudicationReasonInfo | UnmarkedWriteInAdjudicationReasonInfo | BlankBallotAdjudicationReasonInfo;
export declare const AdjudicationReasonInfoSchema: z.ZodSchema<AdjudicationReasonInfo>;
export interface HMPBBallotPageMetadata {
    electionHash: string;
    precinctId: Precinct['id'];
    ballotStyleId: BallotStyle['id'];
    locales: BallotLocale;
    pageNumber: number;
    isTestMode: boolean;
    ballotType: BallotType;
    ballotId?: string;
}
export declare const HMPBBallotPageMetadataSchema: z.ZodSchema<HMPBBallotPageMetadata>;
export declare type BallotMetadata = Omit<HMPBBallotPageMetadata, 'pageNumber' | 'ballotId'>;
export declare const BallotMetadataSchema: z.ZodSchema<BallotMetadata>;
export interface TargetShape {
    bounds: Rect;
    inner: Rect;
}
export declare const TargetShapeSchema: z.ZodSchema<TargetShape>;
export interface BallotStrayMark {
    type: 'stray';
    bounds: Rect;
    contest?: AnyContest;
    option?: Candidate | 'yes' | 'no' | YesNoOption;
}
export declare const BallotStrayMarkSchema: z.ZodSchema<BallotStrayMark>;
export interface BallotCandidateTargetMark {
    type: CandidateContest['type'];
    bounds: Rect;
    contest: CandidateContest;
    target: TargetShape;
    option: Candidate;
    score: number;
    scoredOffset: Offset;
    writeInTextScore?: number;
}
export declare const BallotCandidateTargetMarkSchema: z.ZodSchema<BallotCandidateTargetMark>;
export interface BallotYesNoTargetMark {
    type: YesNoContest['type'];
    bounds: Rect;
    contest: YesNoContest;
    target: TargetShape;
    option: 'yes' | 'no';
    score: number;
    scoredOffset: Offset;
}
export declare const BallotYesNoTargetMarkSchema: z.ZodSchema<BallotYesNoTargetMark>;
export interface BallotMsEitherNeitherTargetMark {
    type: MsEitherNeitherContest['type'];
    bounds: Rect;
    contest: MsEitherNeitherContest;
    target: TargetShape;
    option: YesNoOption;
    score: number;
    scoredOffset: Offset;
}
export declare const BallotMsEitherNeitherTargetMarkSchema: z.ZodSchema<BallotMsEitherNeitherTargetMark>;
export declare type BallotTargetMark = BallotCandidateTargetMark | BallotYesNoTargetMark | BallotMsEitherNeitherTargetMark;
export declare const BallotTargetMarkSchema: z.ZodSchema<BallotTargetMark>;
export declare type BallotMark = BallotStrayMark | BallotTargetMark;
export declare const BallotMarkSchema: z.ZodSchema<BallotMark>;
export interface MarkInfo {
    marks: BallotMark[];
    ballotSize: Size;
}
export declare const MarkInfoSchema: z.ZodSchema<MarkInfo>;
export interface AdjudicationInfo {
    requiresAdjudication: boolean;
    enabledReasons: readonly AdjudicationReason[];
    enabledReasonInfos: readonly AdjudicationReasonInfo[];
    ignoredReasonInfos: readonly AdjudicationReasonInfo[];
}
export declare const AdjudicationInfoSchema: z.ZodSchema<AdjudicationInfo>;
export interface BlankPage {
    type: 'BlankPage';
}
export declare const BlankPageSchema: z.ZodSchema<BlankPage>;
export interface InterpretedBmdPage {
    type: 'InterpretedBmdPage';
    ballotId: string;
    metadata: BallotMetadata;
    votes: VotesDict;
}
export declare const InterpretedBmdPageSchema: z.ZodSchema<InterpretedBmdPage>;
export interface InterpretedHmpbPage {
    type: 'InterpretedHmpbPage';
    ballotId?: string;
    metadata: HMPBBallotPageMetadata;
    markInfo: MarkInfo;
    votes: VotesDict;
    adjudicationInfo: AdjudicationInfo;
}
export declare const InterpretedHmpbPageSchema: z.ZodSchema<InterpretedHmpbPage>;
export interface InvalidElectionHashPage {
    type: 'InvalidElectionHashPage';
    expectedElectionHash: string;
    actualElectionHash: string;
}
export declare const InvalidElectionHashPageSchema: z.ZodSchema<InvalidElectionHashPage>;
export interface InvalidTestModePage {
    type: 'InvalidTestModePage';
    metadata: BallotMetadata | HMPBBallotPageMetadata;
}
export declare const InvalidTestModePageSchema: z.ZodSchema<InvalidTestModePage>;
export interface InvalidPrecinctPage {
    type: 'InvalidPrecinctPage';
    metadata: BallotMetadata | HMPBBallotPageMetadata;
}
export declare const InvalidPrecinctPageSchema: z.ZodSchema<InvalidPrecinctPage>;
export interface UninterpretedHmpbPage {
    type: 'UninterpretedHmpbPage';
    metadata: HMPBBallotPageMetadata;
}
export declare const UninterpretedHmpbPageSchema: z.ZodSchema<UninterpretedHmpbPage>;
export interface UnreadablePage {
    type: 'UnreadablePage';
    reason?: string;
}
export declare const UnreadablePageSchema: z.ZodSchema<UnreadablePage>;
export interface ImageInfo {
    url: string;
}
export declare const ImageInfoSchema: z.ZodSchema<ImageInfo>;
export declare type PageInterpretation = BlankPage | InterpretedBmdPage | InterpretedHmpbPage | InvalidElectionHashPage | InvalidTestModePage | InvalidPrecinctPage | UninterpretedHmpbPage | UnreadablePage;
export declare const PageInterpretationSchema: z.ZodSchema<PageInterpretation>;
export interface BallotPageInfo {
    image: ImageInfo;
    interpretation: PageInterpretation;
    adjudicationFinishedAt?: ISO8601Timestamp;
}
export declare const BallotPageInfoSchema: z.ZodSchema<BallotPageInfo>;
export interface BallotSheetInfo {
    id: string;
    front: BallotPageInfo;
    back: BallotPageInfo;
    adjudicationReason?: AdjudicationReason;
}
export declare const BallotSheetInfoSchema: z.ZodSchema<BallotSheetInfo>;
export interface CompletedBallot {
    readonly electionHash: string;
    readonly ballotStyleId: BallotStyle['id'];
    readonly precinctId: Precinct['id'];
    readonly ballotId: string;
    readonly votes: VotesDict;
    readonly isTestMode: boolean;
    readonly ballotType: BallotType;
}
export declare type CardDataTypes = 'voter' | 'pollworker' | 'admin';
export declare const CardDataTypesSchema: z.ZodSchema<CardDataTypes>;
export interface CardData {
    readonly t: CardDataTypes;
}
export declare const CardDataSchema: z.ZodSchema<CardData>;
export interface VoterCardData extends CardData {
    readonly t: 'voter';
    /** Created date */
    readonly c: number;
    /** Ballot style ID */
    readonly bs: string;
    /** Precinct ID */
    readonly pr: string;
    /** Used (voided) */
    readonly uz?: number;
    /** Ballot printed date */
    readonly bp?: number;
    /** Updated date */
    readonly u?: number;
    /** Mark machine ID */
    readonly m?: string;
}
export declare const VoterCardDataSchema: z.ZodSchema<VoterCardData>;
export interface PollworkerCardData extends CardData {
    readonly t: 'pollworker';
    /** Election hash */
    readonly h: string;
}
export declare const PollworkerCardDataSchema: z.ZodSchema<PollworkerCardData>;
export interface AdminCardData extends CardData {
    readonly t: 'admin';
    /** Election hash */
    readonly h: string;
    /** Card Passcode */
    readonly p?: string;
}
export declare const AdminCardDataSchema: z.ZodSchema<AdminCardData>;
export declare type AnyCardData = VoterCardData | PollworkerCardData | AdminCardData;
export declare const AnyCardDataSchema: z.ZodSchema<AnyCardData>;
/**
 * Gets contests which belong to a ballot style in an election.
 */
export declare const getContests: ({ ballotStyle, election, }: {
    ballotStyle: BallotStyle;
    election: Election;
}) => Contests;
/**
 * Get all MS either-neither contests.
 */
export declare const getEitherNeitherContests: (contests: Contests) => MsEitherNeitherContest[];
export declare const expandEitherNeitherContests: (contests: Contests) => Exclude<AnyContest, MsEitherNeitherContest>[];
/**
 * Retrieves a precinct by id.
 */
export declare const getPrecinctById: ({ election, precinctId, }: {
    election: Election;
    precinctId: string;
}) => Precinct | undefined;
/**
 * Retrieves a ballot style by id.
 */
export declare const getBallotStyle: ({ ballotStyleId, election, }: {
    ballotStyleId: string;
    election: Election;
}) => BallotStyle | undefined;
/**
 * Retrieve a contest from a set of contests based on ID
 * special-cases Ms Either Neither contests
 */
export declare const findContest: ({ contests, contestId, }: {
    contests: Contests;
    contestId: string;
}) => AnyContest | undefined;
/**
 * Validates the votes for a given ballot style in a given election.
 *
 * @throws When an inconsistency is found.
 */
export declare const validateVotes: ({ votes, ballotStyle, election, }: {
    votes: VotesDict;
    ballotStyle: BallotStyle;
    election: Election;
}) => void;
/**
 * @deprecated Does not support i18n. 'party.fullname` should be used instead.
 * Gets the adjective used to describe the political party for a primary
 * election, e.g. "Republican" or "Democratic".
 */
export declare const getPartyPrimaryAdjectiveFromBallotStyle: ({ ballotStyleId, election, }: {
    ballotStyleId: string;
    election: Election;
}) => string;
/**
 * Gets the full name of the political party for a primary election,
 * e.g. "Republican Party" or "Democratic Party".
 */
export declare const getPartyFullNameFromBallotStyle: ({ ballotStyleId, election, }: {
    ballotStyleId: string;
    election: Election;
}) => string;
export declare function getDistrictIdsForPartyId(election: Election, partyId: string): string[];
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
export declare function vote(contests: Contests, shorthand: {
    [key: string]: Vote | string | readonly string[] | Candidate;
}): VotesDict;
export declare function isVotePresent(v?: Vote): boolean;
/**
 * Helper function to get array of locale codes used in election definition.
 */
export declare const getElectionLocales: (election: Election, baseLocale?: string) => string[];
/**
 * Copies an election definition preferring strings from the matching locale.
 */
export declare function withLocale(election: Election, locale: string): Election;
/**
 * Parses `value` as an `Election` encoded as a JSON string. Equivalent to
 * `safeParseJSON(Election, value)`.
 */
export declare function safeParseElection(value: string): Result<Election, z.ZodError | SyntaxError>;
/**
 * Parses `value` as an `Election` object. Equivalent to
 * `safeParse(Election, value)`.
 */
export declare function safeParseElection(value: unknown): Result<Election, z.ZodError>;
/**
 * Parses `value` as a JSON `Election`, computing the election hash if the
 * result is `Ok`.
 */
export declare function safeParseElectionDefinition(value: string): Result<ElectionDefinition, z.ZodError | SyntaxError>;
/**
 * @deprecated use `safeParseElection(…)` instead
 */
export declare function parseElection(value: unknown): Election;
