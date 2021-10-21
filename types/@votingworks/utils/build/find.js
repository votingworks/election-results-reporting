"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.find = void 0;
function find(array, predicate, defaultValue) {
    const result = array.find(predicate);
    if (result === undefined) {
        if (defaultValue === undefined) {
            throw new Error('unable to find an element matching a predicate');
        }
        return defaultValue;
    }
    return result;
}
exports.find = find;
