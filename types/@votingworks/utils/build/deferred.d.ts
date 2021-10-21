export interface Deferred<T> {
    promise: Promise<T>;
    resolve(value: T): void;
    reject(reason: unknown): void;
}
/**
 * Builds a deferred promise that separates the promise itself from the resolve
 * and reject functions, allowing easily passing a promise elsewhere for easy
 * resolution later.
 *
 * @example
 *
 * const { promise, resolve, reject } = deferred<number>()
 * giveThePromiseToSomeone(promise)
 * computeAThingWithACallback((value) => {
 *   if (typeof value === 'number') {
 *     resolve(value)
 *   } else {
 *     reject(new Error('computation failed'))
 *   }
 * })
 */
export declare function deferred<T>(): Deferred<T>;
/**
 * An asynchronous FIFO queue.
 */
declare class DeferredQueue<T> {
    private readonly deferredGets;
    private readonly settlements;
    private settleAllWith?;
    /**
     * Determines whether any existing values are present.
     */
    isEmpty(): boolean;
    /**
     * Gets a promise for the next value in the queue. If there is a value ready,
     * the promise is resolved immediately with that value. Otherwise it is
     * deferred until a settlement is added. Note that this promise may reject if
     * `reject` or `rejectAll` has been called.
     */
    get(): Promise<T>;
    /**
     * Adds a resolution with `value` to the end of the queue.
     */
    resolve(value: T): void;
    /**
     * Once all existing settlements are consumed, all subsequent calls to `get`
     * will be resolved with `value`.
     */
    resolveAll(value: T): void;
    /**
     * Adds a rejection for `reason` to the end of the queue.
     */
    reject(reason?: unknown): void;
    /**
     * Once all existing settlements are consumed, all subsequent calls to `get`
     * will be rejected for `reason`.
     */
    rejectAll(reason?: unknown): void;
    /**
     * Ensures settlements can still be added to the queue.
     */
    private assertMutable;
}
/**
 * Builds an async FIFO queue.
 */
export declare function deferredQueue<T>(): DeferredQueue<T>;
export {};
