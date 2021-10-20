"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrinter = void 0;
const LocalPrinter_1 = __importDefault(require("./LocalPrinter"));
function getPrinter() {
    var _a;
    return (_a = window.kiosk) !== null && _a !== void 0 ? _a : new LocalPrinter_1.default();
}
exports.getPrinter = getPrinter;
