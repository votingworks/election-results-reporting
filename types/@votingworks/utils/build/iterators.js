"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.naturals = exports.integers = exports.drop = exports.take = exports.map = exports.reversed = exports.zipMin = exports.zip = void 0;
function* zip(...iterables) {
    const iterators = iterables.map((iterable) => iterable[Symbol.iterator]());
    while (true) {
        const nexts = iterators.map((iterator) => iterator.next());
        const dones = nexts.filter(({ done }) => done);
        if (dones.length === nexts.length) {
            break;
        }
        else if (dones.length > 0) {
            throw new Error('not all iterables are the same length');
        }
        yield nexts.map(({ value }) => value);
    }
}
exports.zip = zip;
function* zipMin(...iterables) {
    const iterators = iterables.map((iterable) => iterable[Symbol.iterator]());
    while (true) {
        const nexts = iterators.map((iterator) => iterator.next());
        const dones = nexts.filter(({ done }) => done);
        if (dones.length === nexts.length) {
            break;
        }
        else if (dones.length > 0) {
            break;
        }
        yield nexts.map(({ value }) => value);
    }
}
exports.zipMin = zipMin;
/**
 * Yields elements from `iterable`, but in reverse order. Consumes all elements
 * upfront, requiring both the time and space to do so.
 */
function* reversed(iterable) {
    const elements = [...iterable];
    for (let i = elements.length - 1; i >= 0; i -= 1) {
        yield elements[i];
    }
}
exports.reversed = reversed;
/**
 * Yields elements from `iterable` after applying `mapfn`.
 */
function* map(iterable, mapfn) {
    let index = 0;
    for (const element of iterable) {
        yield mapfn(element, index);
        index += 1;
    }
}
exports.map = map;
/**
 * Takes up to the first `count` elements from `iterable`.
 */
function take(count, iterable) {
    const iterator = iterable[Symbol.iterator]();
    const result = [];
    for (let i = 0; i < count; i += 1) {
        const { value, done } = iterator.next();
        if (done) {
            break;
        }
        result.push(value);
    }
    return result;
}
exports.take = take;
/**
 * Ignore the first `count` values from the given iterable.
 */
function* drop(count, iterable) {
    const iterator = iterable[Symbol.iterator]();
    for (let i = 0; i < count; i += 1) {
        iterator.next();
    }
    for (;;) {
        const result = iterator.next();
        if (result.done) {
            break;
        }
        yield result.value;
    }
}
exports.drop = drop;
function* integers({ from = 0, through = Infinity, } = {}) {
    for (let i = from; i <= through; i += 1) {
        yield i;
    }
}
exports.integers = integers;
/**
 * Builds an infinite generator starting at 1 yielding successive integers.
 */
const naturals = () => integers({ from: 1 });
exports.naturals = naturals;
