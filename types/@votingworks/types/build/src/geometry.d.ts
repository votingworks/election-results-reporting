import { z } from 'zod';
export interface Point {
    readonly x: number;
    readonly y: number;
}
export declare const PointSchema: z.ZodSchema<Point>;
export interface Offset {
    readonly x: number;
    readonly y: number;
}
export declare const OffsetSchema: z.ZodSchema<Offset>;
export interface Rect {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}
export declare const RectSchema: z.ZodSchema<Rect>;
export declare type Corners = readonly [Point, Point, Point, Point];
export declare const CornersSchema: z.ZodSchema<Corners>;
export interface Size {
    readonly width: number;
    readonly height: number;
}
export declare const SizeSchema: z.ZodSchema<Size>;
