import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CalendarPlus, MapPin, Share2, Ticket, Clock } from "lucide-react";

import Img from "../ui/Img";
import { formatDate, formatTime, daysUntil, hasPassed } from "../../lib/dates";
import { addToCalendar } from "../../lib/calendar";
import { shareLink } from "../../lib/share";
import { cn } from "../../lib/cn";

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

    const days = daysUntil(event.datetime);
    const finished = past || hasPassed(event.datetime);

    // "Today" / "Tomorrow" / "in 5 days" — only worth showing for the near future.
    const countdown =
        !finished && days !== null && days >= 0 && days <= 14
            ? days === 0
                ? t("events.today", { defaultValue: "Today" })
                : days === 1
                  ? t("events.tomorrow", { defaultValue: "Tomorrow" })
                  : t("events.inDays", { count: days, defaultValue: `In ${days} days` })
            : null;

    const onShare = async () => {
        const url = `${window.location.origin}${window.location.pathname}#event-${event.id}`;
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
                "panel group flex flex-col overflow-hidden transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-signal/45",
                finished && "opacity-[0.86]"
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
                        finished && "grayscale-[0.35]"
                    )}
                />

                <div className="absolute left-4 top-4 flex flex-col gap-2">
                    <span className="inline-flex flex-col items-center rounded-2xl bg-black/65 px-3 py-2 leading-none text-white backdrop-blur-md">
                        <span className="font-display text-xl font-bold">
                            {formatDate(event.datetime, "d")}
                        </span>
                        <span className="mt-1 font-display text-[0.6rem] uppercase tracking-[0.14em] text-white/80">
                            {formatDate(event.datetime, "MMM")}
                        </span>
                    </span>
                </div>

                {(countdown || finished) && (
                    <span
                        className={cn(
                            "absolute right-4 top-4 rounded-full px-3 py-1.5 font-display text-[0.7rem] font-bold uppercase tracking-wider backdrop-blur-md",
                            finished
                                ? "bg-black/60 text-white/80"
                                : "bg-signal-ink text-on-signal"
                        )}
                    >
                        {finished ? t("events.finished") : countdown}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-6">
                <h3 className="text-display text-xl text-ink">{event.title}</h3>

                {event.subtitle && (
                    <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                        {event.subtitle}
                    </p>
                )}

                <dl className="mt-5 flex flex-col gap-2 text-sm text-ink-muted">
                    <div className="flex items-center gap-2.5">
                        <dt className="sr-only">{t("events.when", { defaultValue: "When" })}</dt>
                        <Clock className="h-4 w-4 shrink-0 text-signal-ink" strokeWidth={2} />
                        <dd>
                            {formatDate(event.datetime, "EEEE d MMMM")} · {formatTime(event.datetime)}
                        </dd>
                    </div>
                    {event.location && (
                        <div className="flex items-center gap-2.5">
                            <dt className="sr-only">
                                {t("events.where", { defaultValue: "Where" })}
                            </dt>
                            <MapPin className="h-4 w-4 shrink-0 text-signal-ink" strokeWidth={2} />
                            <dd>{event.location}</dd>
                        </div>
                    )}
                </dl>

                <div className="mt-6 flex items-center gap-2 border-t border-hairline/[var(--hairline-opacity)] pt-5">
                    {event.ticketPurchaseLink && !finished && (
                        <a
                            href={event.ticketPurchaseLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-signal-ink px-4 py-2.5 font-display text-sm font-bold text-on-signal transition hover:brightness-110"
                        >
                            <Ticket className="h-4 w-4" strokeWidth={2.5} />
                            {t("events.buyTickets")}
                        </a>
                    )}

                    <div className={cn("flex gap-2", !event.ticketPurchaseLink && "ml-auto")}>
                        {!finished && (
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
