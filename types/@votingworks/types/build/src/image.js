"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageDataSchema = void 0;
const zod_1 = require("zod");
exports.ImageDataSchema = zod_1.z.object({
    width: zod_1.z.number().nonnegative(),
    height: zod_1.z.number().nonnegative(),
    data: zod_1.z.instanceof(Uint8ClampedArray),
});
