import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CalendarPlus, MapPin, Share2, Ticket, Clock } from "lucide-react";

import Img from "../ui/Img";
import MapLink from "../ui/MapLink";
import { formatDay, formatTime, badgeDate, daysUntil, hasPassed } from "../../lib/dates";
import { addToCalendar } from "../../lib/calendar";
import { isPrerender } from "../../lib/prerender";
import { shareLink } from "../../lib/share";
import { eventPlaceQuery } from "../../lib/maps";
import { cn } from "../../lib/cn";
import useLang from "../../hooks/useLang";

const PRIMARY_ACTION =
    "inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-full bg-signal-ink px-4 py-0 text-center font-display text-sm font-bold leading-4 text-on-signal transition hover:brightness-110";

const IconAction = ({ icon: Icon, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline/[var(--hairline-opacity)] text-ink-muted transition-colors hover:border-signal hover:text-signal-ink"
    >
        <Icon className="h-4 w-4" strokeWidth={2} />
    </button>
);

const EventCard = ({ event, past = false }) => {
    const { t } = useTranslation();
    const { lang } = useLang();

    const days = daysUntil(event.datetime);
    const finished = past || hasPassed(event.datetime);
    const hasTickets = Boolean(event.ticketPurchaseLink) && !finished;
    // Null for a location that is not a place, such as an online event.
    const placeQuery = eventPlaceQuery(event.location);
    const badge = badgeDate(event.datetime, lang);

    /* "Today" / "Tomorrow" / "in 5 days" — only worth showing for the near
       future, and never in the prerendered page: that is served until the next
       build, and a label frozen into it is wrong a day later. The app adds it
       when it starts; the absolute dates stay. */
    const countdown =
        !isPrerender && !finished && days !== null && days >= 0 && days <= 14
            ? days === 0
                ? t("events.today", { defaultValue: "Today" })
                : days === 1
                  ? t("events.tomorrow", { defaultValue: "Tomorrow" })
                  : t("events.inDays", { count: days, defaultValue: `In ${days} days` })
            : null;

    const onShare = async () => {
        /* Always the Events page, wherever the card is: shared from the
           homepage, which only shows the next three events, the link stopped
           finding its card as soon as another event came up. BASE_URL keeps
           the base path of a project-page deploy. */
        const url = new URL(
            `${import.meta.env.BASE_URL}${lang}/events/#event-${encodeURIComponent(event.id)}`,
            window.location.origin
        ).href;
        try {
            const result = await shareLink({ title: event.title, text: event.subtitle, url });
            if (result === "copied") toast.success(t("events.shareLinkCopied"));
        } catch {
            toast.error(t("events.shareError"));
        }
    };

    const onCalendar = () => {
        try {
            addToCalendar({
                id: `event-${event.id}`,
                title: event.title,
                description: event.subtitle,
                location: event.location,
                start: event.datetime,
            });
            toast.success(t("events.addedToCalendar"));
        } catch {
            toast.error(t("events.calendarError"));
        }
    };

    return (
        <article
            id={`event-${event.id}`}
            className={cn(
                /* h-full: the grid item is the <Reveal> wrapper, so without this
                   the card only grows to its own content and cards in the same
                   row end at different heights. */
                "panel group flex h-full flex-col overflow-hidden transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-signal/45"
            )}
        >
            <div className="relative">
                <Img
                    src={event.thumbnail}
                    fallbackName="trip-placeholder"
                    alt=""
                    ratio="16 / 10"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                    credit={event.imageCredit}
                    imgClassName={cn(
                        "transition-transform duration-700 ease-out group-hover:scale-[1.04]",
                        /* A finished event greys its photo rather than fading the
                           whole card, which took the card's text below 4.5:1. */
                        finished && "grayscale-[0.35]"
                    )}
                />

                <div className="absolute left-4 top-4 flex flex-col gap-2">
                    <span className="inline-flex flex-col items-center rounded-2xl bg-black/65 px-3 py-2 leading-none text-white backdrop-blur-md">
                        <span className="font-display text-xl font-bold">{badge.day}</span>
                        <span className="mt-1 font-display text-[0.6rem] uppercase tracking-[0.14em] text-white/80">
                            {badge.month}
                        </span>
                    </span>
                </div>

                {(countdown || finished) && (
                    <span
                        className={cn(
                            "absolute right-4 top-4 rounded-full px-3 py-1.5 font-display text-[0.7rem] font-bold uppercase tracking-wider backdrop-blur-md",
                            /* The finished pill sits straight on the photo. Over a
                               white patch of it, black/60 measured 4.37:1; black/70
                               is 6.2:1 at worst. */
                            finished
                                ? "bg-black/70 text-white/80"
                                : "bg-signal-ink text-on-signal"
                        )}
                    >
                        {finished ? t("events.finished") : countdown}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-6">
                <h3 className="text-display text-xl text-ink">{event.title}</h3>

                {event.subtitle ? (
                    <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                        {event.subtitle}
                    </p>
                ) : (
                    /* subtitle is nullable, and it is the only thing holding the
                       meta and action rows down against the bottom of the card. */
                    <div className="flex-1" aria-hidden="true" />
                )}

                <dl className="mt-5 flex flex-col gap-2 text-sm text-ink-muted">
                    <div className="flex items-center gap-2.5">
                        <dt className="sr-only">{t("events.when", { defaultValue: "When" })}</dt>
                        <Clock className="h-4 w-4 shrink-0 text-signal-ink" strokeWidth={2} />
                        <dd>
                            {formatDay(event.datetime, lang)} · {formatTime(event.datetime, lang)}
                        </dd>
                    </div>
                    {event.location && (
                        <div className="flex items-center gap-2.5">
                            <dt className="sr-only">
                                {t("events.where", { defaultValue: "Where" })}
                            </dt>
                            <MapPin className="h-4 w-4 shrink-0 text-signal-ink" strokeWidth={2} />
                            <dd>
                                {placeQuery ? (
                                    <MapLink query={placeQuery}>{event.location}</MapLink>
                                ) : (
                                    event.location
                                )}
                            </dd>
                        </div>
                    )}
                </dl>

                <div className="mt-6 flex items-center gap-2 border-t border-hairline/[var(--hairline-opacity)] pt-5">
                    {/* One big pill whatever the card offers: Buy Tickets when there is
                        a ticket link, Add to Calendar when there is not, so the row
                        looks the same on every card. A finished event has neither.
                        h-9 like the icon buttons beside it, whether the label wraps
                        or not: a taller pill (40px, or 60 with two lines) pushed
                        the dates and the divider out of line with the neighbouring
                        cards. */}
                    {hasTickets && (
                        <a
                            href={event.ticketPurchaseLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={PRIMARY_ACTION}
                        >
                            <Ticket className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                            {t("events.buyTickets")}
                        </a>
                    )}
                    {!hasTickets && !finished && (
                        <button type="button" onClick={onCalendar} className={PRIMARY_ACTION}>
                            <CalendarPlus className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                            {t("events.addToCalendar")}
                        </button>
                    )}

                    <div className={cn("flex gap-2", finished && "ml-auto")}>
                        {/* With tickets the calendar is the quiet second action; without,
                            it is already the pill beside this. */}
                        {hasTickets && (
                            <IconAction
                                icon={CalendarPlus}
                                label={t("events.addToCalendar")}
                                onClick={onCalendar}
                            />
                        )}
                        <IconAction icon={Share2} label={t("events.share")} onClick={onShare} />
                    </div>
                </div>
            </div>
        </article>
    );
};

export default EventCard;
