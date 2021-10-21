"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Implements the storage API for storing objects in memory. Data stored in
 * this object only lasts as long as the program runs.
 */
class MemoryStorage {
    /**
     * @param initial data to load into storage
     */
    constructor(initial) {
        this.data = new Map();
        if (initial) {
            for (const key in initial) {
                /* istanbul ignore else */
                if (Object.prototype.hasOwnProperty.call(initial, key)) {
                    void this.set(key, initial[key]);
                }
            }
        }
    }
    /**
     * Gets an object from storage by key.
     */
    async get(key) {
        const serialized = this.data.get(key);
        if (typeof serialized === 'undefined') {
            return serialized;
        }
        return JSON.parse(serialized);
    }
    /**
     * Sets an object in storage by key.
     */
    async set(key, value) {
        this.data.set(key, JSON.stringify(value));
    }
    /**
     * Removes an object in storage by key.
     */
    async remove(key) {
        this.data.delete(key);
    }
    /**
     * Clears all objects out of storage.
     */
    async clear() {
        this.data.clear();
    }
}
exports.default = MemoryStorage;
