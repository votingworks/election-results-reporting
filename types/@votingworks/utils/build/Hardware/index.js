"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHardware = exports.MemoryHardware = exports.KioskHardware = void 0;
const KioskHardware_1 = __importDefault(require("./KioskHardware"));
exports.KioskHardware = KioskHardware_1.default;
const MemoryHardware_1 = __importDefault(require("./MemoryHardware"));
exports.MemoryHardware = MemoryHardware_1.default;
__exportStar(require("./utils"), exports);
/**
 * Get Hardware based upon environment.
 */
async function getHardware() {
    return window.kiosk
        ? // Running in kiosk-browser, so use that to access real hardware.
            new KioskHardware_1.default(window.kiosk)
        : // Running in normal browser, so emulate hardware.
            await MemoryHardware_1.default.buildDemo();
}
exports.getHardware = getHardware;
