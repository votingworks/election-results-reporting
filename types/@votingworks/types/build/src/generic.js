"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineId = exports.ISO8601Date = exports.HexString = exports.WriteInId = exports.Id = exports.safeParseJSON = exports.safeParse = exports.err = exports.ok = void 0;
const iso8601_1 = __importDefault(require("@antongolub/iso8601"));
const zod_1 = require("zod");
function ok(value = undefined) {
    return {
        isErr: () => false,
        isOk: () => true,
        err: () => undefined,
        ok: () => value,
        unsafeUnwrap: () => value,
        unsafeUnwrapErr: () => {
            throw value;
        },
    };
}
exports.ok = ok;
/**
 * Returns a `Result` containing `error`.
 */
function err(error) {
    return {
        isErr: () => true,
        isOk: () => false,
        err: () => error,
        ok: () => undefined,
        unsafeUnwrap: () => {
            throw error;
        },
        unsafeUnwrapErr: () => error,
    };
}
exports.err = err;
/**
 * Parse `value` using `parser`. Note that this takes an object that is already
 * supposed to be of type `T`, not a JSON string. For that, use `safeParseJSON`.
 *
 * @returns `Ok` when the parse succeeded, `Err` otherwise.
 */
function safeParse(parser, value) {
    const result = parser.safeParse(value);
    if (!result.success) {
        return err(result.error);
    }
    return ok(result.data);
}
exports.safeParse = safeParse;
function safeParseJSON(text, parser) {
    let parsed;
    try {
        parsed = JSON.parse(text);
    }
    catch (error) {
        return err(error);
    }
    return parser ? safeParse(parser, parsed) : ok(parsed);
}
exports.safeParseJSON = safeParseJSON;
exports.Id = zod_1.z
    .string()
    .nonempty()
    .refine((id) => !id.startsWith('_'), 'IDs may not start with an underscore')
    .refine((id) => /^[-_a-z\d]+$/i.test(id), 'IDs may only contain letters, numbers, dashes, and underscores');
exports.WriteInId = zod_1.z
    .string()
    .nonempty()
    .refine((id) => id.startsWith('__write-in'), 'Write-In IDs must start with __write-in');
exports.HexString = zod_1.z
    .string()
    .nonempty()
    .refine((hex) => /^[0-9a-f]*$/i.test(hex), 'hex strings must contain only 0-9 and a-f');
exports.ISO8601Date = zod_1.z
    .string()
    .refine(iso8601_1.default, 'dates must be in ISO8601 format');
exports.MachineId = zod_1.z
    .string()
    .nonempty()
    .refine((id) => /^[-A-Z\d]+$/.test(id), 'Machine IDs may only contain numbers, uppercase letters, and dashes');
