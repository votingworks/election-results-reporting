"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
/**
 * Implements the storage API using `localStorage` as the backing store.
 */
class LocalStorage {
    /**
     * Gets an object from storage by key.
     */
    async get(key) {
        assert_1.strict(typeof key === 'string');
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : undefined;
    }
    /**
     * Sets an object in storage by key.
     */
    async set(key, value) {
        assert_1.strict(typeof key === 'string');
        window.localStorage.setItem(key, JSON.stringify(value));
    }
    /**
     * Removes an object in storage by key.
     */
    async remove(key) {
        assert_1.strict(typeof key === 'string');
        window.localStorage.removeItem(key);
    }
    /**
     * Clears all objects out of storage.
     */
    async clear() {
        window.localStorage.clear();
    }
}
exports.default = LocalStorage;
