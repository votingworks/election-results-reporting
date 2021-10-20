/// <reference types="kiosk-browser" />
import { CompressedTally, Optional, PrecinctSelection, Result } from '@votingworks/types';
import { Observable } from 'rxjs';
import { z } from 'zod';
export declare enum TallySourceMachineType {
    PRECINCT_SCANNER = "precinct_scanner"
}
export declare const TallySourceMachineTypeSchema: z.ZodNativeEnum<typeof TallySourceMachineType>;
export interface PrecinctScannerCardTally {
    readonly tallyMachineType: TallySourceMachineType.PRECINCT_SCANNER;
    readonly tally: CompressedTally;
    readonly machineId: string;
    readonly timeSaved: number;
    readonly totalBallotsScanned: number;
    readonly isLiveMode: boolean;
    readonly isPollsOpen: boolean;
    readonly absenteeBallots: number;
    readonly precinctBallots: number;
    readonly precinctSelection: PrecinctSelection;
}
export declare const PrecinctScannerCardTallySchema: z.ZodSchema<PrecinctScannerCardTally>;
/**
 * Identity function useful for asserting the type of the argument/return value.
 * Mainly useful with an object literal argument used in a context where a
 * variable declaration with an explicit type annotation is inelegant, such as
 * when providing a response to `fetch-mock`.
 *
 * @example
 *
 * fetchMock.get('/api', typedAs<MyResponseType>({
 *   status: 'ok',
 *   value: 42,
 * }))
 *
 * @example
 *
 * expect(value).toEqual(typedAs<MyType>({
 *   a: 1,
 *   b: 2,
 * }))
 */
export declare function typedAs<Type>(value: Type): Type;
/**
 * Describes the API for application-level persistent storage. Values must be
 * objects that can be persisted via JSON.stringify and JSON.parse.
 */
export interface Storage {
    /**
     * Gets an object from storage by key.
     */
    get(key: string): Promise<unknown>;
    /**
     * Sets an object in storage by key.
     */
    set(key: string, value: unknown): Promise<void>;
    /**
     * Removes an object in storage by key.
     */
    remove(key: unknown): Promise<void>;
    /**
     * Clears all objects out of storage.
     */
    clear(): Promise<void>;
}
export interface CardAbsentAPI {
    present: false;
}
export interface CardPresentAPI {
    present: true;
    shortValue?: string;
    longValueExists?: boolean;
}
export declare type CardAPI = CardAbsentAPI | CardPresentAPI;
/**
 * Defines the API for accessing a smart card reader.
 */
export interface Card {
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
}
export interface PrinterStatus {
    connected: boolean;
}
/**
 * Defines the API for accessing hardware status.
 */
export interface Hardware {
    /**
     * Reads Battery status
     */
    readBatteryStatus(): Promise<KioskBrowser.BatteryInfo>;
    /**
     * Reads Printer status
     */
    readPrinterStatus(): Promise<PrinterStatus>;
    /**
     * Subscribe to USB device updates.
     */
    devices: Observable<Iterable<KioskBrowser.Device>>;
    /**
     * Subscribe to USB device updates.
     */
    printers: Observable<Iterable<KioskBrowser.PrinterInfo>>;
}
export interface PrintOptions extends KioskBrowser.PrintOptions {
    sides: Exclude<KioskBrowser.PrintOptions['sides'], undefined>;
}
export interface Printer {
    print(options: PrintOptions): Promise<void>;
}
