import * as z from 'zod';
export declare type ISO8601Timestamp = string;
export declare const ISO8601TimestampSchema: z.ZodEffects<z.ZodString, string>;
export declare type OkResponse<Props = Record<string, unknown>> = {
    status: 'ok';
} & Props;
export declare const OkResponseSchema: z.ZodSchema<OkResponse>;
export interface ErrorsResponse {
    status: 'error';
    errors: {
        type: string;
        message: string;
    }[];
}
export declare const ErrorsResponseSchema: z.ZodSchema<ErrorsResponse>;
