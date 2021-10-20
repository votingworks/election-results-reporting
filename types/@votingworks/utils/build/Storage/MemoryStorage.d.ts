import { Storage } from '../types';
/**
 * Implements the storage API for storing objects in memory. Data stored in
 * this object only lasts as long as the program runs.
 */
export default class MemoryStorage implements Storage {
    private data;
    /**
     * @param initial data to load into storage
     */
    constructor(initial?: Record<string, unknown>);
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
