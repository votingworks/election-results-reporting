import { z } from 'zod';
import { Precinct } from './election';
export declare enum PrecinctSelectionKind {
    SinglePrecinct = "SinglePrecinct",
    AllPrecincts = "AllPrecincts"
}
export declare const PrecinctSelectionKindSchema: z.ZodNativeEnum<typeof PrecinctSelectionKind>;
export declare type PrecinctSelection = {
    kind: PrecinctSelectionKind.AllPrecincts;
} | {
    kind: PrecinctSelectionKind.SinglePrecinct;
    precinctId: Precinct['id'];
};
export declare const PrecinctSelectionSchema: z.ZodSchema<PrecinctSelection>;
