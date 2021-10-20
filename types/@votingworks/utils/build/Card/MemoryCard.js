"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@votingworks/types");
/**
 * Implements the `Card` API with an in-memory implementation.
 */
class MemoryCard {
    constructor() {
        this.present = false;
    }
    /**
     * Reads basic information about the card, including whether one is present,
     * what its short value is and whether it has a long value.
     */
    async readStatus() {
        const { present, shortValue } = this;
        if (present) {
            const longValueExists = typeof this.longValue !== 'undefined' && this.longValue.length > 0;
            return {
                present,
                shortValue,
                longValueExists,
            };
        }
        return { present };
    }
    /**
     * Reads the long value as an object, or `undefined` if there is no long
     * value and validates it using `schema`.
     */
    async readLongObject(schema) {
        const { longValue } = this;
        if (!longValue || longValue.length === 0) {
            return types_1.ok(undefined);
        }
        const longValueJSON = new TextDecoder().decode(longValue);
        return types_1.safeParseJSON(longValueJSON, schema);
    }
    /**
     * Reads the long value as a string, or `undefined` if there is no long
     * value.
     */
    async readLongString() {
        const { longValue } = this;
        if (!longValue) {
            return;
        }
        return new TextDecoder().decode(longValue);
    }
    /**
     * Reads the long value as binary data, or `undefined` if there is no long
     * value.
     */
    async readLongUint8Array() {
        return this.longValue;
    }
    /**
     * Writes a new short value to the card.
     */
    async writeShortValue(value) {
        if (!this.present) {
            throw new Error('cannot write short value when no card is present');
        }
        this.shortValue = value;
    }
    /**
     * Writes a new long value as a serialized object.
     */
    async writeLongObject(value) {
        await this.writeLongUint8Array(new TextEncoder().encode(JSON.stringify(value)));
    }
    /**
     * Writes binary data to the long value.
     */
    async writeLongUint8Array(value) {
        if (!this.present) {
            throw new Error('cannot write long value when no card is present');
        }
        this.longValue = Uint8Array.from(value);
    }
    /**
     * Removes the simulated in-memory card.
     */
    removeCard() {
        this.present = false;
        this.shortValue = undefined;
        this.longValue = undefined;
        return this;
    }
    /**
     * Inserts a simulated in-memory card with specified long and short values.
     */
    insertCard(shortValue, longValue) {
        this.shortValue =
            typeof shortValue === 'string' ? shortValue : JSON.stringify(shortValue);
        this.longValue =
            typeof longValue === 'undefined'
                ? undefined
                : longValue instanceof Uint8Array
                    ? Uint8Array.from(longValue)
                    : new TextEncoder().encode(longValue);
        this.present = true;
        return this;
    }
}
exports.default = MemoryCard;
