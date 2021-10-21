/**
 * Finds an element in `array` that matches `predicate`, optionally returning
 * `defaultValue` if no element matches.
 *
 * @throws when no element matches and no default value is provided
 */
export declare function find<T, S extends T>(array: readonly T[], predicate: (element: T) => element is S): S;
export declare function find<T>(array: readonly T[], predicate: (element: T) => boolean, defaultValue?: T): T;
