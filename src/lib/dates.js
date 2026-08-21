import { format, isPast, isFuture } from "date-fns";

/** Supabase timestamps are strings, and some rows have nulls or bad values. */
export const parseDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value, pattern = "d MMM yyyy") => {
    const date = parseDate(value);
    return date ? format(date, pattern) : "";
};

export const formatTime = (value) => formatDate(value, "HH:mm");

/** "12 – 14 May 2026", collapsing to a single date when start and end match. */
export const formatDateRange = (start, end) => {
    const from = parseDate(start);
    const to = parseDate(end);
    if (!from) return "";
    if (!to || from.toDateString() === to.toDateString()) return format(from, "d MMM yyyy");
    if (from.getFullYear() === to.getFullYear() && from.getMonth() === to.getMonth()) {
        return `${format(from, "d")} – ${format(to, "d MMM yyyy")}`;
    }
    return `${format(from, "d MMM")} – ${format(to, "d MMM yyyy")}`;
};

export const hasPassed = (value) => {
    const date = parseDate(value);
    return date ? isPast(date) : false;
};

export const isUpcoming = (value) => {
    const date = parseDate(value);
    return date ? isFuture(date) : false;
};

/** Days until a date, or null. Used for the "in 3 days" badge. */
export const daysUntil = (value) => {
    const date = parseDate(value);
    if (!date) return null;
    const ms = date.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
    return Math.round(ms / 86400000);
};
