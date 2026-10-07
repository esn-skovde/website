import { dateTimeFormat } from "./intl";

/* Every event happens in Skövde, so its date and time are read in Stockholm's
   time zone, not the device's: left to the device, an 18:00 event showed as
   21:30 in India, and the build, which runs in UTC, baked in 16:00. */
export const VENUE_TZ = "Europe/Stockholm";

/** Supabase timestamps are strings, and some rows have nulls or bad values. */
export const parseDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

/* The venue's formatter for a language. Only where an engine rejects the time
   zone does it fall back to the visitor's own, since a date an hour or two off
   beats none; null, if even that fails, shows as an empty string. */
const venueFormat = (lang, options) =>
    dateTimeFormat(lang, { ...options, timeZone: VENUE_TZ }) ?? dateTimeFormat(lang, options);

const formatVenue = (value, lang, options) => {
    const date = parseDate(value);
    return date ? (venueFormat(lang, options)?.format(date) ?? "") : "";
};

/** "Friday 2 October", in the page's language. */
export const formatDay = (value, lang) =>
    formatVenue(value, lang, { weekday: "long", day: "numeric", month: "long" });

/** "18:00". hourCycle rather than hour12: false, which prints midnight as "24:00" in some engines. */
export const formatTime = (value, lang) =>
    formatVenue(value, lang, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

/**
 * The two lines of an event card's date badge: "2" and "Oct".
 *
 * The month loses the full stop its short form carries in some languages
 * ("okt."): the badge is set in capitals, where it only adds clutter. The day
 * comes from the parts because Norwegian's plain format is "2.".
 */
export const badgeDate = (value, lang) => {
    const date = parseDate(value);
    const parts = date
        ? venueFormat(lang, { day: "numeric", month: "short" })?.formatToParts(date)
        : null;
    const part = (type) => parts?.find((p) => p.type === type)?.value ?? "";
    return { day: part("day"), month: part("month").replace(/\.$/, "") };
};

/**
 * "4 Oct 2026", "2 – 6 Oct 2026" or "30 Oct – 1 Nov 2026": the engine drops
 * whatever the two ends share, and shows one date when both fall on the same
 * day at the venue.
 *
 * Newer locale data sets the dash off with thin spaces, which some engines
 * ship and some replace with plain ones. Plain is what the site has always
 * printed, and it makes the same text everywhere.
 */
export const formatDateRange = (start, end, lang) => {
    const from = parseDate(start);
    if (!from) return "";
    const format = venueFormat(lang, { day: "numeric", month: "short", year: "numeric" });
    if (!format) return "";

    const to = parseDate(end);
    // Engines that follow the older spec throw on a range that runs backwards.
    if (!to || to < from) return format.format(from);
    if (typeof format.formatRange === "function") {
        return format.formatRange(from, to).replace(/\u2009/g, " ");
    }

    const [first, last] = [format.format(from), format.format(to)];
    return first === last ? first : `${first} – ${last}`;
};

export const hasPassed = (value) => {
    const date = parseDate(value);
    return date ? date.getTime() < Date.now() : false;
};

export const isUpcoming = (value) => {
    const date = parseDate(value);
    return date ? date.getTime() > Date.now() : false;
};

/**
 * The calendar day a date falls on at the venue, as the UTC midnight that
 * starts it: two of these differ by a whole number of days, whatever the
 * device's time zone or daylight saving does in between.
 */
export const venueDay = (date) => {
    const parts = venueFormat("en", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    })?.formatToParts(date);
    if (!parts) return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

    const part = (type) => Number(parts.find((p) => p.type === type).value);
    return Date.UTC(part("year"), part("month") - 1, part("day"));
};

/** Calendar days from today to a date, both counted at the venue, or null. Used for the "in 3 days" badge. */
export const daysUntil = (value) => {
    const date = parseDate(value);
    return date ? (venueDay(date) - venueDay(new Date())) / 86400000 : null;
};
