"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localeWeekdayAndDate = exports.localeLongDateAndTime = exports.DEFAULT_LOCALE = exports.count = void 0;
const countFormatter = new Intl.NumberFormat(undefined, { useGrouping: true });
/**
 * Format integers for display as whole numbers, i.e. a count of something.
 */
function count(value) {
    return countFormatter.format(value);
}
exports.count = count;
exports.DEFAULT_LOCALE = 'en-US';
function localeLongDateAndTime(time) {
    return new Intl.DateTimeFormat(exports.DEFAULT_LOCALE, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
    }).format(time);
}
exports.localeLongDateAndTime = localeLongDateAndTime;
function localeWeekdayAndDate(time) {
    return new Intl.DateTimeFormat(exports.DEFAULT_LOCALE, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(time);
}
exports.localeWeekdayAndDate = localeWeekdayAndDate;
