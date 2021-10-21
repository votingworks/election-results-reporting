import { DateTime } from 'luxon';
export declare const AMERICA_TIMEZONES: string[];
export declare const MONTHS_SHORT: string[];
export declare const formatTimeZoneName: (date: DateTime) => string;
export declare const formatFullDateTimeZone: (date: DateTime, { includeTimezone }?: {
    includeTimezone?: boolean | undefined;
}) => string | undefined;
export declare const formatLongDate: (date: DateTime, timeZone?: string | undefined) => string;
/**
 * Get days in given month and year.
 */
export declare function getDaysInMonth(year: number, month: number): DateTime[];
