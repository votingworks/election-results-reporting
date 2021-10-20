"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deferredQueue = exports.deferred = void 0;
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
function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}
exports.deferred = deferred;
/**
 * An asynchronous FIFO queue.
 */
class DeferredQueue {
    constructor() {
        this.deferredGets = [];
        this.settlements = [];
    }
    /**
     * Determines whether any existing values are present.
     */
    isEmpty() {
        return this.settlements.length === 0;
    }
    /**
     * Gets a promise for the next value in the queue. If there is a value ready,
     * the promise is resolved immediately with that value. Otherwise it is
     * deferred until a settlement is added. Note that this promise may reject if
     * `reject` or `rejectAll` has been called.
     */
    get() {
        const nextSettlement = this.settlements.shift();
        if (nextSettlement) {
            if (nextSettlement.status === 'fulfilled') {
                return Promise.resolve(nextSettlement.value);
            }
            return Promise.reject(nextSettlement.reason);
        }
        if (typeof this.settleAllWith !== 'undefined') {
            if (this.settleAllWith.status === 'fulfilled') {
                return Promise.resolve(this.settleAllWith.value);
            }
            return Promise.reject(this.settleAllWith.reason);
        }
        const deferredGet = deferred();
        this.deferredGets.push(deferredGet);
        return deferredGet.promise;
    }
    /**
     * Adds a resolution with `value` to the end of the queue.
     */
    resolve(value) {
        this.assertMutable();
        const nextDeferredGet = this.deferredGets.shift();
        if (nextDeferredGet) {
            nextDeferredGet.resolve(value);
        }
        else {
            this.settlements.push({ status: 'fulfilled', value });
        }
    }
    /**
     * Once all existing settlements are consumed, all subsequent calls to `get`
     * will be resolved with `value`.
     */
    resolveAll(value) {
        this.assertMutable();
        this.settleAllWith = { status: 'fulfilled', value };
        for (const { resolve } of this.deferredGets) {
            resolve(value);
        }
        this.deferredGets.length = 0;
    }
    /**
     * Adds a rejection for `reason` to the end of the queue.
     */
    reject(reason) {
        this.assertMutable();
        const nextDeferredGet = this.deferredGets.shift();
        if (nextDeferredGet) {
            nextDeferredGet.reject(reason);
        }
        else {
            this.settlements.push({ status: 'rejected', reason });
        }
    }
    /**
     * Once all existing settlements are consumed, all subsequent calls to `get`
     * will be rejected for `reason`.
     */
    rejectAll(reason) {
        this.assertMutable();
        this.settleAllWith = { status: 'rejected', reason };
        for (const { reject } of this.deferredGets) {
            reject(reason);
        }
        this.deferredGets.length = 0;
    }
    /**
     * Ensures settlements can still be added to the queue.
     */
    assertMutable() {
        if (typeof this.settleAllWith !== 'undefined') {
            throw new Error('resolveAll or rejectAll already called');
        }
    }
}
/**
 * Builds an async FIFO queue.
 */
function deferredQueue() {
    return new DeferredQueue();
}
exports.deferredQueue = deferredQueue;
