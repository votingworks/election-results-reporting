"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJSON = void 0;
async function fetchJSON(input, init) {
    var _a;
    const response = await fetch(input, {
        ...init,
        headers: {
            Accept: 'application/json',
            ...((_a = init === null || init === void 0 ? void 0 : init.headers) !== null && _a !== void 0 ? _a : {}),
        },
    });
    if (!response.ok) {
        throw new Error('fetch response is not ok');
    }
    const json = await response.json();
    return json;
}
exports.fetchJSON = fetchJSON;
