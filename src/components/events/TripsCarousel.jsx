import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
    ArrowLeft,
    ArrowRight,
    CalendarPlus,
    MapPin,
    Pause,
    Play,
    Plane,
    ExternalLink,
} from "lucide-react";

import Container from "../ui/Container";
import Button from "../ui/Button";
import MapLink from "../ui/MapLink";
import Img from "../ui/Img";
import Skeleton from "../ui/Skeleton";
import StarRule from "../ui/StarRule";
import useSupabaseQuery from "../../hooks/useSupabaseQuery";
import { fetchTrips } from "../../lib/events";
import { formatDateRange, hasPassed } from "../../lib/dates";
import { addToCalendar } from "../../lib/calendar";
import { tripPlaceQuery } from "../../lib/maps";
import { cn } from "../../lib/cn";
import useLang from "../../hooks/useLang";

const INTERVAL = 5000;

// How far a finger has to travel sideways, in px, to count as a swipe.
const SWIPE_DISTANCE = 40;

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Focus the keyboard moved, not the press that also focuses a button in some
   browsers: pressing Pause must not first read as "focus entered, stop" and
   then as "pause", which would start the rotation again. */
const keyboardFocus = (element) => {
    try {
        return element.matches(":focus-visible");
    } catch {
        return true; // no way to ask, so every focus counts
    }
};

/* Both the loading placeholder and the hero are at least this tall, so the page
   does not shift when the trips arrive. It is the hero, like the guide's. */
const HERO_HEIGHT = "min-h-[max(30rem,62svh)]";

/* A slide's words, and its buttons, are drawn in two places: once for the slide
   on show, and once, hidden, for every other slide. The hidden copies sit in the
   same grid cell, so the stage is always as tall as the tallest slide and a slide
   with fewer lines, or no buttons, does not make the page jump when it comes up.
   Both go through the same code, so a copy is exactly as tall as its slide.
   `Heading` is the real h2 for the slide itself and a plain div for a copy. */
const SlideCopy = ({ trip, lang, Heading = "h2" }) => (
    <>
        <Heading className="mt-5 max-w-2xl text-display text-3xl text-balance text-white sm:text-5xl">
            {trip.title}
        </Heading>

        {trip.subtitle && (
            <p className="measure mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
                {trip.subtitle}
            </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/75">
            <span className="inline-flex items-center gap-2">
                <CalendarPlus className="h-4 w-4" strokeWidth={2} />
                {formatDateRange(trip.startsAt, trip.endsAt, lang)}
            </span>
            {trip.location && (
                <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" strokeWidth={2} />
                    {tripPlaceQuery(trip.location) ? (
                        /* white, not the page's signal colour, which is for a light or
                           dark ground and not for a photo behind a dark scrim */
                        <MapLink
                            query={tripPlaceQuery(trip.location)}
                            pinClassName="text-white/90"
                            className="hover:text-white"
                        >
                            {trip.location}
                        </MapLink>
                    ) : (
                        trip.location
                    )}
                </span>
            )}
        </div>
    </>
);

const SlideActions = ({ trip, onCalendar }) => {
    const { t } = useTranslation();

    return (
        <>
            {trip.detailsLink && (
                <Button href={trip.detailsLink} size="lg">
                    {t("events.carousel.moreDetails")}
                    <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
                </Button>
            )}
            {!hasPassed(trip.endsAt) && (
                <Button variant="onImage" size="lg" onClick={onCalendar}>
                    <CalendarPlus className="h-4 w-4" strokeWidth={2.5} />
                    {t("events.addToCalendar")}
                </Button>
            )}
        </>
    );
};

/* A hidden copy: out of sight, out of the tab order, out of the accessibility
   tree, and out of reach of the pointer. It only holds the space. */
const SIZER = "invisible col-start-1 row-start-1 select-none";

/**
 * The Events page's hero. `title` is the page's heading: it is read out and
 * indexed but not drawn, because the carousel is what the page opens with.
 * `fallback` takes over when there are no trips to show.
 */
const TripsCarousel = ({ title, fallback = null }) => {
    const { t } = useTranslation();
    const { lang } = useLang();
    const [index, setIndex] = useState(0);
    /* The slides turn by themselves until the reader says otherwise. Using a
       control, swiping or tabbing in stops them for good, and only Play starts
       them again (WCAG 2.2.2). Hovering and a hidden tab only hold them for as
       long as they last. With reduced motion they never start. */
    const [stopped, setStopped] = useState(prefersReducedMotion);
    const [hovered, setHovered] = useState(false);
    const [hidden, setHidden] = useState(() => typeof document !== "undefined" && document.hidden);

    const { data, loading, error, available } = useSupabaseQuery(
        (client) => fetchTrips(client, 10),
        []
    );

    const trips = data ?? [];
    const count = trips.length;
    const timer = useRef(null);
    const swipe = useRef(null);

    // Only the reader's own moves come through here, so each one stops the rotation.
    const goTo = useCallback(
        (next) => {
            setStopped(true);
            setIndex(((next % count) + count) % count);
        },
        [count]
    );

    const rotating = count > 1 && !stopped && !hovered && !hidden;

    // Auto-advance, while nothing is holding it.
    useEffect(() => {
        if (!rotating) return undefined;
        timer.current = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
        return () => clearInterval(timer.current);
    }, [count, rotating]);

    useEffect(() => {
        const sync = () => setHidden(document.hidden);
        document.addEventListener("visibilitychange", sync);
        return () => document.removeEventListener("visibilitychange", sync);
    }, []);

    // Keep the index valid if the trip list changes underneath us.
    useEffect(() => {
        if (count && index >= count) setIndex(0);
    }, [count, index]);

    if (loading) {
        return (
            <>
                {title && <h1 className="sr-only">{title}</h1>}
                <Skeleton className={cn(HERO_HEIGHT, "w-full rounded-none")} />
            </>
        );
    }

    // Trips are a bonus — when there is nothing to show, or nothing to show
    // them from, the page opens with its usual header instead.
    if (!available || error || count === 0) return fallback;

    const trip = trips[index];
    const finished = hasPassed(trip.endsAt);
    const others = trips.filter((item) => item.id !== trip.id);

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

    /* A swipe turns the slide, as it does in a phone's own carousels. Fingers
       and pens only: a mouse drag is a text selection. The slide area leaves
       vertical panning to the page (touch-pan-y), so scrolling past it works. */
    const onPointerDown = (event) => {
        if (event.pointerType === "mouse") return;
        swipe.current = { x: event.clientX, y: event.clientY };
    };

    const onPointerUp = (event) => {
        const from = swipe.current;
        swipe.current = null;
        if (!from) return;
        const dx = event.clientX - from.x;
        if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(event.clientY - from.y)) {
            goTo(index + (dx < 0 ? 1 : -1));
        }
    };

    const ToggleIcon = stopped ? Play : Pause;
    const toggleLabel = stopped ? t("events.carousel.play") : t("events.carousel.pause");

    return (
        <>
            {title && <h1 className="sr-only">{title}</h1>}
            <section
                aria-roledescription={t("events.carousel.role")}
                aria-label={t("events.trips", { defaultValue: "Trips" })}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onFocus={(event) => {
                    if (keyboardFocus(event.target)) setStopped(true);
                }}
                className="relative isolate overflow-hidden"
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

                <div
                    onPointerDown={onPointerDown}
                    onPointerUp={onPointerUp}
                    onPointerCancel={() => {
                        swipe.current = null;
                    }}
                    className={cn("flex touch-pan-y touch-pinch-zoom flex-col justify-end", HERO_HEIGHT)}
                >
                    <Container width="wide" className="py-10 sm:py-14">
                        <div className="flex flex-wrap items-center gap-2.5">
                            {/* Backed in black, not washed in white: the chip sits high
                                on the photo, where the scrim thins out, and over a
                                bright photo a white wash left its label at about 3:1. */}
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
                                <Plane className="h-3.5 w-3.5" strokeWidth={2.5} />
                                {t("events.trips", { defaultValue: "Trips" })}
                            </span>
                            {finished && (
                                <span className="rounded-full bg-black/50 px-3 py-1.5 font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">
                                    {t("events.finished")}
                                </span>
                            )}
                            {/* First in the tab order, so a keyboard reader can stop the
                                slides before reaching anything else in the carousel. */}
                            {count > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStopped((value) => !value)}
                                    aria-label={toggleLabel}
                                    title={toggleLabel}
                                    className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                                >
                                    <ToggleIcon className="h-4 w-4" strokeWidth={2.5} />
                                </button>
                            )}
                        </div>

                        {/* Read out when it changes, but only once the rotation has
                            stopped: while it turns by itself, a screen reader would be
                            interrupted every few seconds. */}
                        <div className="grid">
                            <div
                                aria-live={stopped ? "polite" : "off"}
                                aria-atomic="true"
                                className="col-start-1 row-start-1"
                            >
                                <SlideCopy trip={trip} lang={lang} />
                            </div>
                            {others.map((item) => (
                                <div key={item.id} aria-hidden="true" inert className={SIZER}>
                                    <SlideCopy trip={item} lang={lang} Heading="div" />
                                </div>
                            ))}
                        </div>

                        {/* One row: the actions on the left, the slide controls on the
                            right. Under sm the controls drop below the actions. */}
                        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-6">
                            <div className="grid">
                                <div className="col-start-1 row-start-1 flex flex-wrap content-start items-center gap-3">
                                    <SlideActions trip={trip} onCalendar={onCalendar} />
                                </div>
                                {others.map((item) => (
                                    <div
                                        key={item.id}
                                        aria-hidden="true"
                                        inert
                                        className={cn(SIZER, "flex flex-wrap content-start items-center gap-3")}
                                    >
                                        <SlideActions trip={item} />
                                    </div>
                                ))}
                            </div>

                            {count > 1 && (
                                <div className="ml-auto flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end sm:gap-5">
                                    {/* Plain buttons, not tabs: nothing here is a tab panel, and
                                        tabs promise arrow-key navigation. Each is a 24px target
                                        around its 6px pill (WCAG 2.5.8). */}
                                    <div className="flex min-w-0 flex-wrap items-center">
                                        {trips.map((item, dot) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                aria-label={t("events.carousel.slideLabel", {
                                                    n: dot + 1,
                                                    total: count,
                                                    title: item.title,
                                                })}
                                                aria-current={dot === index ? "true" : undefined}
                                                onClick={() => goTo(dot)}
                                                className="group inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        "h-1.5 rounded-full transition-all duration-300",
                                                        dot === index
                                                            ? "w-8 bg-white"
                                                            : "w-1.5 bg-white/40 group-hover:bg-white/70"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex shrink-0 gap-2">
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
                    </Container>
                </div>

                <StarRule />
            </section>
        </>
    );
};

export default TripsCarousel;
