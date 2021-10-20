import { z } from 'zod';
export interface Dictionary<T> {
    [key: string]: Optional<T>;
}
export declare type Optional<T> = T | undefined;
export interface Provider<T> {
    get(): Promise<T>;
}
/**
 * Represents either success with a value `T` or failure with error `E`.
 */
export declare type Result<T, E> = Ok<T> | Err<E>;
export interface Ok<T> {
    /**
     * Returns `true`.
     */
    isOk(): this is Ok<T>;
    /**
     * Returns `false`.
     */
    isErr(): this is Err<never>;
    /**
     * Returns the contained value.
     */
    ok(): T;
    /**
     * Returns `undefined`.
     */
    err(): undefined;
    /**
     * Returns the contained value.
     */
    unsafeUnwrap(): T;
    /**
     * Throws the contained value.
     */
    unsafeUnwrapErr(): never;
}
export interface Err<E> {
    /**
     * Returns `false`.
     */
    isOk(): this is Ok<never>;
    /**
     * Returns `true`.
     */
    isErr(): this is Err<E>;
    /**
     * Returns `undefined`.
     */
    ok(): undefined;
    /**
     * Returns the contained error.
     */
    err(): E;
    /**
     * Throws the contained error.
     */
    unsafeUnwrap(): never;
    /**
     * Returns the contained error.
     */
    unsafeUnwrapErr(): E;
}
/**
 * Returns an empty `Result`.
 */
export declare function ok<E>(): Result<void, E>;
/**
 * Returns a `Result` containing `value`.
 */
export declare function ok<T, E>(value: T): Result<T, E>;
/**
 * Returns a `Result` containing `error`.
 */
export declare function err<T, E>(error: E): Result<T, E>;
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
export declare const Id: z.ZodEffects<z.ZodString, string>;
export declare const WriteInId: z.ZodEffects<z.ZodString, string>;
export declare const HexString: z.ZodSchema<string>;
export declare const ISO8601Date: z.ZodEffects<z.ZodString, string>;
export declare const MachineId: z.ZodEffects<z.ZodString, string>;
