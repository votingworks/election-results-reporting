"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStorage = exports.LocalStorage = exports.KioskStorage = void 0;
const KioskStorage_1 = __importDefault(require("./KioskStorage"));
exports.KioskStorage = KioskStorage_1.default;
const LocalStorage_1 = __importDefault(require("./LocalStorage"));
exports.LocalStorage = LocalStorage_1.default;
const MemoryStorage_1 = __importDefault(require("./MemoryStorage"));
exports.MemoryStorage = MemoryStorage_1.default;
