"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_mock_1 = __importDefault(require("fetch-mock"));
const jest_fetch_mock_1 = __importDefault(require("jest-fetch-mock"));
const util_1 = require("util");
beforeEach(() => {
    jest_fetch_mock_1.default.enableMocks();
    fetch_mock_1.default.reset();
    fetch_mock_1.default.mock();
});
globalThis.TextDecoder = util_1.TextDecoder;
globalThis.TextEncoder = util_1.TextEncoder;
