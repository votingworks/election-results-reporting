"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrinter = exports.NullPrinter = exports.LocalPrinter = void 0;
const LocalPrinter_1 = __importDefault(require("./LocalPrinter"));
exports.LocalPrinter = LocalPrinter_1.default;
const NullPrinter_1 = __importDefault(require("./NullPrinter"));
exports.NullPrinter = NullPrinter_1.default;
function getPrinter() {
    var _a;
    return (_a = window.kiosk) !== null && _a !== void 0 ? _a : new LocalPrinter_1.default();
}
exports.getPrinter = getPrinter;
