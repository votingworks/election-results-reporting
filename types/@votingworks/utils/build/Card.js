"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryCard = exports.WebServiceCard = void 0;
const types_1 = require("@votingworks/types");
const base64_js_1 = require("base64-js");
const fetchJSON_1 = require("./fetchJSON");
/**
 * Implements the `Card` API by accessing it through a web service.
 */
class WebServiceCard {
    /**
     * Reads basic information about the card, including whether one is present,
     * what its short value is and whether it has a long value.
     */
    async readStatus() {
        return await fetchJSON_1.fetchJSON('/card/read');
    }
    /**
     * Reads the long value as an object, or `undefined` if there is no long
     * value and validates it using `schema`.
     */
    async readLongObject(schema) {
        const response = await fetch('/card/read_long');
        const { longValue } = await response.json();
        return longValue ? types_1.safeParseJSON(longValue, schema) : types_1.ok(undefined);
    }
    /**
     * Reads the long value as a string, or `undefined` if there is no long
     * value.
     */
    async readLongString() {
        const response = await fetch('/card/read_long');
        const { longValue } = await response.json();
        return longValue || undefined;
    }
    /**
     * Reads the long value as binary data, or `undefined` if there is no long
     * value.
     */
    async readLongUint8Array() {
        const response = await fetch('/card/read_long_b64');
        const { longValue } = await response.json();
        return longValue ? base64_js_1.toByteArray(longValue) : undefined;
    }
    /**
     * Writes a new short value to the card.
     */
    async writeShortValue(value) {
        await fetch('/card/write', {
            method: 'post',
            body: value,
            headers: { 'Content-Type': 'application/json' },
        });
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
        const longValueBase64 = base64_js_1.fromByteArray(value);
        const formData = new FormData();
        formData.append('long_value', longValueBase64);
        await fetch('/card/write_long_b64', {
            method: 'post',
            body: formData,
        });
    }
}
exports.WebServiceCard = WebServiceCard;
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
        return schema
            ? types_1.safeParseJSON(longValueJSON, schema)
            : JSON.parse(longValueJSON);
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
exports.MemoryCard = MemoryCard;
