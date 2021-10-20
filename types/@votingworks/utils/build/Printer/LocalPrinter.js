"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('utils:printer');
class LocalPrinter {
    async print(options) {
        debug('ignoring options given to print: %o', options);
        window.print();
    }
}
exports.default = LocalPrinter;
