"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDaysInMonth = exports.formatLongDate = exports.formatFullDateTimeZone = exports.formatTimeZoneName = exports.MONTHS_SHORT = exports.AMERICA_TIMEZONES = void 0;
const luxon_1 = require("luxon");
exports.AMERICA_TIMEZONES = [
    'Pacific/Honolulu',
    'America/Anchorage',
    'America/Los_Angeles',
    'America/Phoenix',
    'America/Denver',
    'America/Chicago',
    'America/New_York',
];
function* getShortMonthNames() {
    const monthShortNameFormatter = new Intl.DateTimeFormat(undefined, {
        month: 'short',
    });
    const year = new Date().getFullYear();
    for (let month = 0; new Date(year, month, 1).getFullYear() === year; month += 1) {
        yield monthShortNameFormatter.format(new Date(year, month, 1));
    }
}
exports.MONTHS_SHORT = [...getShortMonthNames()];
const formatTimeZoneName = (date) => 
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
new Intl.DateTimeFormat(undefined, {
    timeZoneName: 'long',
    timeZone: date.zoneName,
})
    .formatToParts(date.toJSDate())
    .find((part) => part.type === 'timeZoneName').value;
exports.formatTimeZoneName = formatTimeZoneName;
const formatFullDateTimeZone = (date, { includeTimezone = false } = {}) => new Intl.DateTimeFormat(undefined, {
    timeZone: date.zoneName,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: includeTimezone ? 'short' : undefined,
}).format(date.toJSDate());
exports.formatFullDateTimeZone = formatFullDateTimeZone;
const formatLongDate = (date, timeZone) => new Intl.DateTimeFormat(undefined, {
    timeZone,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
}).format(date.toJSDate());
exports.formatLongDate = formatLongDate;
/**
 * Get days in given month and year.
 */
function getDaysInMonth(year, month) {
    let date = luxon_1.DateTime.fromObject({ year, month, day: 1 });
    const days = [];
    while (date.month === month) {
        days.push(date);
        date = date.plus(luxon_1.Duration.fromObject({ day: 1 }));
    }
    return days;
}
exports.getDaysInMonth = getDaysInMonth;
