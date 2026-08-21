import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CalendarPlus, MapPin, Plane, ExternalLink } from "lucide-react";

import Container from "../ui/Container";
import Button from "../ui/Button";
import Img from "../ui/Img";
import Skeleton from "../ui/Skeleton";
import useSupabaseQuery from "../../hooks/useSupabaseQuery";
import { fetchTrips } from "../../lib/events";
import { formatDateRange, hasPassed } from "../../lib/dates";
import { addToCalendar } from "../../lib/calendar";
import { cn } from "../../lib/cn";

const INTERVAL = 8000;

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TripsCarousel = () => {
    const { t } = useTranslation();
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const { data, loading, error, available } = useSupabaseQuery(
        (client) => fetchTrips(client, 10),
        []
    );

    const trips = data ?? [];
    const count = trips.length;
    const timer = useRef(null);

    const goTo = useCallback(
        (next) => setIndex(((next % count) + count) % count),
        [count]
    );

    // Auto-advance, paused on hover, focus, or a reduced-motion preference.
    useEffect(() => {
        if (count <= 1 || paused || prefersReducedMotion()) return undefined;
        timer.current = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
        return () => clearInterval(timer.current);
    }, [count, paused]);

    // Keep the index valid if the trip list changes underneath us.
    useEffect(() => {
        if (count && index >= count) setIndex(0);
    }, [count, index]);

    if (loading) {
        return (
            <Container width="wide" className="pt-10">
                <Skeleton className="h-[26rem] w-full rounded-panel sm:h-[30rem]" />
            </Container>
        );
    }

    // Trips are a bonus section — when there is nothing to show, or nothing to
    // show it from, the page simply starts at the events below.
    if (!available || error || count === 0) return null;

    const trip = trips[index];
    const finished = hasPassed(trip.endsAt);

    const onCalendar = () => {
        try {
            addToCalendar({
                id: `trip-${trip.id}`,
                title: trip.title,
                description: trip.subtitle,
                location: trip.location,
                start: trip.startsAt,
                end: trip.endsAt,
            });
            toast.success(t("events.addedToCalendar"));
        } catch {
            toast.error(t("events.calendarError"));
        }
    };

    return (
        <Container width="wide" className="pt-10">
            <section
                aria-roledescription="carousel"
                aria-label={t("events.trips", { defaultValue: "Trips" })}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocusCapture={() => setPaused(true)}
                onBlurCapture={() => setPaused(false)}
                className="panel relative isolate overflow-hidden"
            >
                <div className="absolute inset-0 -z-10">
                    <Img
                        key={trip.id}
                        src={trip.thumbnail}
                        fallbackName="trip-placeholder"
                        alt=""
                        sizes="100vw"
                        className="h-full w-full animate-fade-in"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/80 to-[#05070f]/35" />
                </div>

                <div className="flex min-h-[26rem] flex-col justify-end p-7 sm:min-h-[30rem] sm:p-10">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
                            <Plane className="h-3.5 w-3.5" strokeWidth={2.5} />
                            {t("events.trips", { defaultValue: "Trips" })}
                        </span>
                        {finished && (
                            <span className="rounded-full bg-black/50 px-3 py-1.5 font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">
                                {t("events.finished")}
                            </span>
                        )}
                    </div>

                    <h2 className="mt-5 max-w-2xl text-display text-3xl text-white sm:text-5xl">
                        {trip.title}
                    </h2>

                    {trip.subtitle && (
                        <p className="measure mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
                            {trip.subtitle}
                        </p>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/75">
                        <span className="inline-flex items-center gap-2">
                            <CalendarPlus className="h-4 w-4" strokeWidth={2} />
                            {formatDateRange(trip.startsAt, trip.endsAt)}
                        </span>
                        {trip.location && (
                            <span className="inline-flex items-center gap-2">
                                <MapPin className="h-4 w-4" strokeWidth={2} />
                                {trip.location}
                            </span>
                        )}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        {trip.detailsLink && (
                            <Button href={trip.detailsLink} size="lg">
                                {t("events.carousel.moreDetails")}
                                <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
                            </Button>
                        )}
                        {!finished && (
                            <Button variant="onImage" size="lg" onClick={onCalendar}>
                                <CalendarPlus className="h-4 w-4" strokeWidth={2.5} />
                                {t("events.addToCalendar")}
                            </Button>
                        )}
                    </div>

                    {count > 1 && (
                        <div className="mt-9 flex items-center justify-between gap-4 border-t border-white/15 pt-6">
                            <div className="flex gap-2" role="tablist" aria-label="Trips">
                                {trips.map((item, dot) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={dot === index}
                                        aria-label={item.title}
                                        onClick={() => goTo(dot)}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all duration-300",
                                            dot === index
                                                ? "w-8 bg-white"
                                                : "w-1.5 bg-white/40 hover:bg-white/70"
                                        )}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => goTo(index - 1)}
                                    aria-label={t("events.previousTrip", { defaultValue: "Previous trip" })}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                                >
                                    <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => goTo(index + 1)}
                                    aria-label={t("events.nextTrip", { defaultValue: "Next trip" })}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                                >
                                    <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </Container>
    );
};

export default TripsCarousel;
