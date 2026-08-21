import { parseDate } from "./dates";

const stamp = (date) => `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;

const icsFile = ({ id, title, description, location }, start, end) => {
    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//ESN Skövde//Calendar//EN",
        "BEGIN:VEVENT",
        `UID:${id}@esnskovde.org`,
        `DTSTART:${stamp(start)}`,
        `DTEND:${stamp(end)}`,
        `SUMMARY:${title ?? ""}`,
        `DESCRIPTION:${description ?? ""}`,
        `LOCATION:${location ?? ""}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
    ];
    return `data:text/calendar;charset=utf8,${encodeURIComponent(lines.join("\r\n"))}`;
};

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
