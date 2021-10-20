"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
/**
 * Implements the storage API using Kiosk Storage as the backing store.
 */
class KioskStorage {
    constructor(kiosk) {
        this.kiosk = kiosk;
        assert_1.strict(kiosk);
    }
    /**
     * Gets an object from storage by key.
     */
    async get(key) {
        assert_1.strict(typeof key === 'string');
        return this.kiosk.storage.get(key);
    }
    /**
     * Sets an object in storage by key.
     */
    async set(key, value) {
        assert_1.strict(typeof key === 'string');
        await this.kiosk.storage.set(key, value);
    }
    /**
     * Removes an object in storage by key.
     */
    async remove(key) {
        assert_1.strict(typeof key === 'string');
        await this.kiosk.storage.remove(key);
    }
    /**
     * Clears all objects out of storage.
     */
    async clear() {
        await this.kiosk.storage.clear();
    }
}
exports.default = KioskStorage;
