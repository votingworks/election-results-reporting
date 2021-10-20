import { z } from 'zod';
export interface ImageData {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}
export declare const ImageDataSchema: z.ZodSchema<ImageData>;
