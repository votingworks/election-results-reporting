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
/**
 * Implements the storage API using `localStorage` as the backing store.
 */
export declare class LocalStorage implements Storage {
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
/**
 * Implements the storage API using Kiosk Storage as the backing store.
 */
export declare class KioskStorage implements Storage {
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
/**
 * Implements the storage API for storing objects in memory. Data stored in
 * this object only lasts as long as the program runs.
 */
export declare class MemoryStorage implements Storage {
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
