import { parseDate } from "./dates";

const stamp = (date) => `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;

/* A TEXT value (RFC 5545 3.3.11): a backslash, semicolon or comma is escaped
   and a line break becomes \n. The backslash goes first, or it would double the
   ones the others add. A colon stays as it is, since "\:" is no valid escape.
   Left raw, a comma ended a location early in Apple's parser and a line break
   in a subtitle started a property of its own out of what followed it. */
const text = (value) =>
    String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/[;,]/g, "\\$&")
        .replace(/\r\n|\r|\n/g, "\\n");

const encoder = new TextEncoder();

/* A content line is at most 75 octets (3.1); a longer one is folded with a line
   break and one space. Octets are UTF-8 bytes, not characters, and the cut
   falls between characters, so an å, a dash or an emoji is never split. The
   space that starts a continuation line counts toward its 75. */
const fold = (line) => {
    const pieces = [];
    let piece = "";
    let size = 0;
    for (const char of line) {
        const bytes = encoder.encode(char).length;
        if (size + bytes > (pieces.length ? 74 : 75)) {
            pieces.push(piece);
            piece = "";
            size = 0;
        }
        piece += char;
        size += bytes;
    }
    pieces.push(piece);
    return pieces.join("\r\n ");
};

/**
 * The text of the .ics file for one event. `now` is its DTSTAMP, a parameter so
 * that a test can pin it. Every line, the last too, ends in CRLF.
 */
export const buildIcs = ({ id, title, description, location }, start, end, now = new Date()) => {
    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//ESN Skövde//Calendar//EN",
        "BEGIN:VEVENT",
        `UID:${id}@esnskovde.org`,
        `DTSTAMP:${stamp(now)}`,
        `DTSTART:${stamp(start)}`,
        `DTEND:${stamp(end)}`,
        `SUMMARY:${text(title)}`,
        `DESCRIPTION:${text(description)}`,
        `LOCATION:${text(location)}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
    ];
    return `${lines.map(fold).join("\r\n")}\r\n`;
};

const icsFile = (event, start, end) =>
    `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(event, start, end))}`;

/**
 * Opens the visitor's calendar for an event.
 * Falls back to a one-hour block when only a start time is known.
 */
export const addToCalendar = ({ id, title, description, location, start, end }) => {
    const startDate = parseDate(start);
    if (!startDate) throw new Error("Event has no usable start date");
    const endDate = parseDate(end) ?? new Date(startDate.getTime() + 3600000);

    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: title ?? "",
        dates: `${stamp(startDate)}/${stamp(endDate)}`,
        details: description ?? "",
        location: location ?? "",
    });

    const agent = navigator.userAgent.toLowerCase();
    const ics = icsFile({ id, title, description, location }, startDate, endDate);

    if (/iphone|ipad|ipod/.test(agent)) {
        window.location.href = ics;
        return;
    }

    if (/macintosh/.test(agent) && !/chrome|firefox/.test(agent)) {
        const link = document.createElement("a");
        link.href = ics;
        link.download = `${String(title ?? "event").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        return;
    }

    window.open(`https://calendar.google.com/calendar/render?${params}`, "_blank", "noopener");
};
