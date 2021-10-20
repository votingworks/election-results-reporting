import { Optional, Result } from '@votingworks/types';
import { z } from 'zod';
import { Card, CardAPI } from '../types';
/**
 * Implements the `Card` API with an in-memory implementation.
 */
export default class MemoryCard implements Card {
    private present;
    private shortValue?;
    private longValue?;
    /**
     * Reads basic information about the card, including whether one is present,
     * what its short value is and whether it has a long value.
     */
    readStatus(): Promise<CardAPI>;
    /**
     * Reads the long value as an object, or `undefined` if there is no long
     * value and validates it using `schema`.
     */
    readLongObject<T>(schema: z.ZodSchema<T>): Promise<Result<Optional<T>, SyntaxError | z.ZodError>>;
    /**
     * Reads the long value as a string, or `undefined` if there is no long
     * value.
     */
    readLongString(): Promise<Optional<string>>;
    /**
     * Reads the long value as binary data, or `undefined` if there is no long
     * value.
     */
    readLongUint8Array(): Promise<Optional<Uint8Array>>;
    /**
     * Writes a new short value to the card.
     */
    writeShortValue(value: string): Promise<void>;
    /**
     * Writes a new long value as a serialized object.
     */
    writeLongObject(value: unknown): Promise<void>;
    /**
     * Writes binary data to the long value.
     */
    writeLongUint8Array(value: Uint8Array): Promise<void>;
    /**
     * Removes the simulated in-memory card.
     */
    removeCard(): this;
    /**
     * Inserts a simulated in-memory card with specified long and short values.
     */
    insertCard(shortValue?: string | unknown, longValue?: string | Uint8Array): this;
}
