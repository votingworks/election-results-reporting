"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStorage = exports.KioskStorage = exports.LocalStorage = void 0;
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
exports.LocalStorage = LocalStorage;
/**
 * Implements the storage API using Kiosk Storage as the backing store.
 */
class KioskStorage {
    /**
     * Gets an object from storage by key.
     */
    async get(key) {
        assert_1.strict(typeof key === 'string');
        return window.kiosk.storage.get(key);
    }
    /**
     * Sets an object in storage by key.
     */
    async set(key, value) {
        assert_1.strict(typeof key === 'string');
        await window.kiosk.storage.set(key, value);
    }
    /**
     * Removes an object in storage by key.
     */
    async remove(key) {
        assert_1.strict(typeof key === 'string');
        await window.kiosk.storage.remove(key);
    }
    /**
     * Clears all objects out of storage.
     */
    async clear() {
        await window.kiosk.storage.clear();
    }
}
exports.KioskStorage = KioskStorage;
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
exports.MemoryStorage = MemoryStorage;
