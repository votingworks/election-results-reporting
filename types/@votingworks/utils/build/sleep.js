"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
/**
 * Returns a promise that resolves after `duration`.
 *
 * @param duration milliseconds to wait
 */
async function sleep(duration) {
    await new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}
exports.sleep = sleep;
