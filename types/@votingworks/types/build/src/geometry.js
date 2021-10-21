"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeSchema = exports.CornersSchema = exports.RectSchema = exports.OffsetSchema = exports.PointSchema = void 0;
const zod_1 = require("zod");
exports.PointSchema = zod_1.z.object({
    x: zod_1.z.number(),
    y: zod_1.z.number(),
});
exports.OffsetSchema = zod_1.z.object({
    x: zod_1.z.number(),
    y: zod_1.z.number(),
});
exports.RectSchema = zod_1.z.object({
    x: zod_1.z.number(),
    y: zod_1.z.number(),
    width: zod_1.z.number(),
    height: zod_1.z.number(),
});
exports.CornersSchema = zod_1.z.tuple([
    exports.PointSchema,
    exports.PointSchema,
    exports.PointSchema,
    exports.PointSchema,
]);
exports.SizeSchema = zod_1.z.object({
    width: zod_1.z.number(),
    height: zod_1.z.number(),
});
