"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@votingworks/types");
const base64_js_1 = require("base64-js");
const fetchJSON_1 = require("../fetchJSON");
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
exports.default = WebServiceCard;
