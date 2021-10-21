import * as z from 'zod';
import * as t from './election';
import { Result } from './generic';
export declare const Translations: z.ZodRecord<z.ZodRecord<z.ZodString>>;
export declare const Id: z.ZodEffects<z.ZodString, string>;
export declare const HexString: z.ZodSchema<string>;
export declare const ISO8601Date: z.ZodEffects<z.ZodString, string>;
export declare const Candidate: z.ZodSchema<t.Candidate>;
export declare const OptionalCandidate: z.ZodOptional<z.ZodType<t.Candidate, z.ZodTypeDef, t.Candidate>>;
export declare const ContestTypes: z.ZodSchema<t.ContestTypes>;
export declare const Contest: z.ZodSchema<t.Contest>;
export declare const CandidateContest: z.ZodSchema<t.CandidateContest>;
export declare const YesNoOption: z.ZodSchema<t.YesNoOption>;
export declare const YesNoContest: z.ZodSchema<t.YesNoContest>;
export declare const MsEitherOrContest: z.ZodSchema<t.MsEitherNeitherContest>;
export declare const AnyContest: z.ZodSchema<t.AnyContest>;
export declare const Contests: z.ZodEffects<z.ZodArray<z.ZodType<t.AnyContest, z.ZodTypeDef, t.AnyContest>>, t.AnyContest[]>;
export declare const MarkThresholds: z.ZodSchema<t.MarkThresholds>;
export declare const AdjudicationReason: z.ZodSchema<t.AdjudicationReason>;
export declare const BallotPaperSize: z.ZodSchema<t.BallotPaperSize>;
export declare const BallotStyle: z.ZodSchema<t.BallotStyle>;
export declare const BallotStyles: z.ZodEffects<z.ZodArray<z.ZodType<t.BallotStyle, z.ZodTypeDef, t.BallotStyle>>, t.BallotStyle[]>;
export declare const Party: z.ZodSchema<t.Party>;
export declare const Parties: z.ZodSchema<t.Parties>;
export declare const Precinct: z.ZodSchema<t.Precinct>;
export declare const Precincts: z.ZodEffects<z.ZodArray<z.ZodType<t.Precinct, z.ZodTypeDef, t.Precinct>>, t.Precinct[]>;
export declare const District: z.ZodSchema<t.District>;
export declare const Districts: z.ZodEffects<z.ZodArray<z.ZodType<t.District, z.ZodTypeDef, t.District>>, t.District[]>;
export declare const County: z.ZodSchema<t.County>;
export declare const Election: z.ZodSchema<t.Election>;
export declare const OptionalElection: z.ZodSchema<t.OptionalElection>;
export declare const ElectionDefinition: z.ZodSchema<t.ElectionDefinition>;
export declare const OptionalElectionDefinition: z.ZodSchema<t.OptionalElectionDefinition>;
export declare const CandidateVote: z.ZodSchema<t.CandidateVote>;
export declare const YesNoVote: z.ZodSchema<t.YesNoVote>;
export declare const OptionalYesNoVote: z.ZodSchema<t.OptionalYesNoVote>;
export declare const Vote: z.ZodSchema<t.Vote>;
export declare const OptionalVote: z.ZodSchema<t.OptionalVote>;
export declare const VotesDict: z.ZodSchema<t.VotesDict>;
export declare const BallotType: z.ZodNativeEnum<typeof t.BallotType>;
export declare const CardDataTypes: z.ZodSchema<t.CardDataTypes>;
export declare const CardData: z.ZodSchema<t.CardData>;
export declare const VoterCardData: z.ZodSchema<t.VoterCardData>;
export declare const PollworkerCardData: z.ZodSchema<t.PollworkerCardData>;
export declare const AdminCardData: z.ZodSchema<t.AdminCardData>;
export declare const AnyCardData: z.ZodSchema<t.AnyCardData>;
/**
 * Parse `value` using `parser`. Note that this takes an object that is already
 * supposed to be of type `T`, not a JSON string. For that, use `safeParseJSON`.
 *
 * @returns `Ok` when the parse succeeded, `Err` otherwise.
 */
export declare function safeParse<T>(parser: z.ZodType<T>, value: unknown): Result<T, z.ZodError>;
/**
 * Parse JSON without throwing an exception if it's malformed. On success the
 * result will be `Ok<unknown>` and you'll need to validate the result yourself.
 * Given malformed JSON, the result will be `Err<SyntaxError>`. Add a parser
 * argument to automatically validate the resulting value after deserializing
 * the JSON.
 */
export declare function safeParseJSON(text: string): Result<unknown, SyntaxError>;
/**
 * Parse JSON and then validate the result with `parser`.
 */
export declare function safeParseJSON<T>(text: string, parser: z.ZodType<T>): Result<T, z.ZodError | SyntaxError>;
/**
 * @deprecated use `safeParseElection(…)` instead
 */
export declare function parseElection(value: unknown): t.Election;
/**
 * Parses `value` as an `Election` encoded as a JSON string. Equivalent to
 * `safeParseJSON(Election, value)`.
 */
export declare function safeParseElection(value: string): Result<t.Election, z.ZodError | SyntaxError>;
/**
 * Parses `value` as an `Election` object. Equivalent to
 * `safeParse(Election, value)`.
 */
export declare function safeParseElection(value: unknown): Result<t.Election, z.ZodError>;
/**
 * Parses `value` as a JSON `Election`, computing the election hash if the
 * result is `Ok`.
 */
export declare function safeParseElectionDefinition(value: string): Result<t.ElectionDefinition, z.ZodError | SyntaxError>;
