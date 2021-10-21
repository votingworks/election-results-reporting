/**
 * Empty case of `zip`, yields nothing.
 */
export declare function zip(): Generator<[]>;
/**
 * Yields elements of `one`, functionally equivalent to using `one` itself.
 */
export declare function zip<T>(one: Iterable<T>): Generator<[T]>;
/**
 * Yields tuples of size 2 with elements from `one` and `two`.
 *
 * @throws if not all iterables are the same length
 */
export declare function zip<T, U>(one: Iterable<T>, two: Iterable<U>): Generator<[T, U]>;
/**
 * Yields tuples of size 3 with elements from `one`, `two`, and `three`.
 *
 * @throws if not all iterables are the same length
 */
export declare function zip<T, U, V>(one: Iterable<T>, two: Iterable<U>, three: Iterable<V>): Generator<[T, U, V]>;
/**
 * Yields tuples of size 4 with elements from `one`, `two`, `three`, and `four`.
 *
 * @throws if not all iterables are the same length
 */
export declare function zip<T, U, V, W>(one: Iterable<T>, two: Iterable<U>, three: Iterable<V>, four: Iterable<W>): Generator<[T, U, V, W]>;
/**
 * Yields tuples of size 5 with elements from `one`, `two`, `three`, `four`, and
 * `five`.
 *
 * @throws if not all iterables are the same length
 */
export declare function zip<T, U, V, W, X>(one: Iterable<T>, two: Iterable<U>, three: Iterable<V>, four: Iterable<W>, five: Iterable<X>): Generator<[T, U, V, W, X]>;
/**
 * Yields tuples of `iterables.length` length from each iterable.
 *
 * @throws if not all iterables are the same length
 */
export declare function zip(...iterables: Iterable<unknown>[]): Generator<unknown[]>;
/**
 * Empty case of `zipMin`, yields nothing.
 */
export declare function zipMin(): Generator<[]>;
/**
 * Yields elements of `one`, functionally equivalent to using `one` itself.
 */
export declare function zipMin<T>(one: Iterable<T>): Generator<[T]>;
/**
 * Yields tuples of size 2 with elements from `one` and `two`.
 */
export declare function zipMin<T, U>(one: Iterable<T>, two: Iterable<U>): Generator<[T, U]>;
/**
 * Yields tuples of size 3 with elements from `one`, `two`, and `three`.
 */
export declare function zipMin<T, U, V>(one: Iterable<T>, two: Iterable<U>, three: Iterable<V>): Generator<[T, U, V]>;
/**
 * Yields tuples of size 4 with elements from `one`, `two`, `three`, and `four`.
 */
export declare function zipMin<T, U, V, W>(one: Iterable<T>, two: Iterable<U>, three: Iterable<V>, four: Iterable<W>): Generator<[T, U, V, W]>;
/**
 * Yields tuples of size 5 with elements from `one`, `two`, `three`, `four`, and
 * `five`.
 */
export declare function zipMin<T, U, V, W, X>(one: Iterable<T>, two: Iterable<U>, three: Iterable<V>, four: Iterable<W>, five: Iterable<X>): Generator<[T, U, V, W, X]>;
/**
 * Yields tuples of `iterables.length` length from each iterable.
 */
export declare function zipMin(...iterables: Iterable<unknown>[]): Generator<unknown[]>;
/**
 * Yields elements from `iterable`, but in reverse order. Consumes all elements
 * upfront, requiring both the time and space to do so.
 */
export declare function reversed<T>(iterable: Iterable<T>): Generator<T>;
/**
 * Yields elements from `iterable` after applying `mapfn`.
 */
export declare function map<T, U>(iterable: Iterable<T>, mapfn: (element: T, index: number) => U): Generator<U>;
/**
 * Takes up to the first `count` elements from `iterable`.
 */
export declare function take<T>(count: number, iterable: Iterable<T>): T[];
/**
 * Ignore the first `count` values from the given iterable.
 */
export declare function drop<T>(count: number, iterable: Iterable<T>): Generator<T>;
/**
 * Builds an infinite generator starting at 0 yielding successive integers.
 */
export declare function integers(): Generator<number>;
/**
 * Builds an infinite generator starting at `from` yielding successive integers.
 */
export declare function integers(opts: {
    from: number;
}): Generator<number>;
/**
 * Builds a generator starting at 0 up to and including `through`.
 */
export declare function integers(opts: {
    through: number;
}): Generator<number>;
/**
 * Builds a generator starting at `from` up to and including `through`.
 */
export declare function integers(opts: {
    from: number;
    through: number;
}): Generator<number>;
/**
 * Builds an infinite generator starting at 1 yielding successive integers.
 */
export declare const naturals: () => Generator<number>;
