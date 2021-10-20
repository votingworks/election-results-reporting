/// <reference types="kiosk-browser" />
import { Storage } from '../types';
/**
 * Implements the storage API using Kiosk Storage as the backing store.
 */
export default class KioskStorage implements Storage {
    readonly kiosk: KioskBrowser.Kiosk;
    constructor(kiosk: KioskBrowser.Kiosk);
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
    remove(key: string): Promise<void>;
    /**
     * Clears all objects out of storage.
     */
    clear(): Promise<void>;
}
