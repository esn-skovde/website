import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown, ChevronLeft, ChevronRight, List } from "lucide-react";

import { SECTIONS } from "./sections";
import { cn } from "../../lib/cn";

const PANEL_ID = "guide-sections-panel";

// The round buttons at either end of the bar, and the "All sections" button
// between them, are 36px tall in a 54px bar: their top edge is 9px under the
// bar's, one pixel clear of the page's scroll padding (see index.css), which
// is what keeps Tab from scrolling the page as it walks along the bar.
const CONTROL =
    "border border-hairline/[var(--hairline-opacity)] text-ink-muted transition-colors duration-200";

/**
 * Sticky bar for a long guide: where you are, one step either way, and every
 * section behind "All sections". One row at every width, so the page below it
 * never has to guess how tall it is.
 *
 * Everything in it is a link to a #fragment, as the guide's chips were, and
 * the list of sections is a native <details>, so on a phone with no scripting
 * the sections are still all there to be reached. The script only adds what
 * <details> lacks: Escape, a click or Tab outside, and a click on a section
 * all close it.
 */
const GuideNav = () => {
    const { t } = useTranslation();
    const [active, setActive] = useState(SECTIONS[0].id);
    const [open, setOpen] = useState(false);
    const barRef = useRef(null);
    const detailsRef = useRef(null);
    const summaryRef = useRef(null);

    const index = Math.max(
        0,
        SECTIONS.findIndex(({ id }) => id === active)
    );
    const current = SECTIONS[index];
    const previous = SECTIONS[index - 1];
    const next = SECTIONS[index + 1];

    useEffect(() => {
        const bar = barRef.current;
        const root = document.documentElement;
        const nodes = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean);
        let band;

        const track = () => {
            /* Anchors and keyboard focus are held below the bar through
               --guide-nav-height (see index.css). CSS can only guess the
               bar's height, which depends on the root font size, so the
               measured one replaces it: 0 where it doesn't stick. */
            const sticky = getComputedStyle(bar).position === "sticky";
            root.style.setProperty(
                "--guide-nav-height",
                sticky ? `${bar.getBoundingClientRect().height}px` : "0px"
            );

            band?.disconnect();
            if (!nodes.length) return;

            /* The line an anchor jump puts a section's top on: the scroll
               padding plus the section's scroll margin. The last section that
               has reached it is the one being read, so the bar always names
               one — a band at a fixed share of the screen sat above that
               line on short screens and named the section before. The 1px band
               just below the line only says when to look again; the answer
               comes from every section, not just the ones that crossed it. */
            const line =
                parseFloat(getComputedStyle(root).scrollPaddingTop) +
                parseFloat(getComputedStyle(nodes[0]).scrollMarginTop);
            const edge = Math.round(line) + 1;

            band = new IntersectionObserver(
                () => {
                    const reading = nodes.filter((node) => node.getBoundingClientRect().top <= edge).pop();
                    // Above the first section, in the hero, the first one is the true answer.
                    setActive((reading ?? nodes[0]).id);
                },
                { rootMargin: `-${edge}px 0px -${Math.max(0, window.innerHeight - edge - 1)}px 0px` }
            );
            nodes.forEach((node) => band.observe(node));
            /* The page around the sections as well: a jump from the hero
               straight to the footer, or back — Home or End with reduced
               motion — crosses the band with no section in it at either end. */
            band.observe(nodes[0].parentElement);
        };

        track();
        // Again whenever the bar changes height or the window is resized: the band is in pixels.
        const resize = new ResizeObserver(track);
        resize.observe(bar);
        window.addEventListener("resize", track);
        return () => {
            band?.disconnect();
            resize.disconnect();
            window.removeEventListener("resize", track);
            root.style.removeProperty("--guide-nav-height");
        };
    }, []);

    // Shuts the list; returns focus to its button for Escape, which is pressed from inside it.
    const close = useCallback((returnFocus) => {
        if (detailsRef.current) detailsRef.current.open = false;
        setOpen(false);
        if (returnFocus) summaryRef.current?.focus({ preventScroll: true });
    }, []);

    // Click-outside and Escape, as in the header's language picker. Focus leaving it is handled on the <details>.
    useEffect(() => {
        if (!open) return undefined;
        const onPointerDown = (event) => {
            if (!detailsRef.current?.contains(event.target)) close(false);
        };
        const onKeyDown = (event) => event.key === "Escape" && close(true);
        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open, close]);

    const step = (target, label, Icon) =>
        target ? (
            <a
                href={`#${target.id}`}
                aria-label={label}
                className={cn(
                    CONTROL,
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full hover:border-signal hover:text-signal-ink"
                )}
            >
                <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} aria-hidden="true" />
            </a>
        ) : (
            /* No section that way: a link with nowhere to go. It has no href,
               so Tab passes it, and a screen reader still finds it, dimmed. */
            <a
                role="link"
                aria-disabled="true"
                aria-label={label}
                className={cn(CONTROL, "grid h-9 w-9 shrink-0 cursor-not-allowed place-items-center rounded-full opacity-40")}
            >
                <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} aria-hidden="true" />
            </a>
        );

    return (
        /* On a short screen — the max-height in index.css — the bar scrolls
           away with the page instead of sticking under the header. */
        <div
            ref={barRef}
            data-guide-nav=""
            className="sticky top-nav z-30 h-[3.375rem] border-b border-hairline/[var(--hairline-opacity)] glass [@media(max-height:500px)]:static"
        >
            {/* Container, but with a smaller gutter on a phone: every pixel
                counts for the title there. */}
            <div className="mx-auto h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav
                    aria-label={t("newToCity.guide.navLabel")}
                    className="flex h-full items-center gap-2 sm:gap-3"
                >
                    {step(previous, t("newToCity.guide.previous"), ChevronLeft)}

                    {/* Where you are. The position is a number to look at, and
                        a sentence for a screen reader; the title is the one
                        thing that gives way when the room runs out. */}
                    <div className="flex min-w-0 flex-1 items-center gap-2 md:w-72 md:flex-none lg:w-80">
                        <span
                            aria-hidden="true"
                            className="shrink-0 text-xs tabular-nums text-ink-faint"
                        >
                            {index + 1} / {SECTIONS.length}
                        </span>
                        <span className="sr-only">
                            {t("newToCity.guide.position", {
                                current: index + 1,
                                total: SECTIONS.length,
                            })}
                        </span>
                        <span
                            aria-hidden="true"
                            className="shrink-0 text-base leading-none max-[359px]:hidden"
                        >
                            {current.emoji}
                        </span>
                        <span className="min-w-0 truncate font-display text-[0.9375rem] font-bold text-ink">
                            {t(`newToCity.sections.${current.key}.title`)}
                        </span>
                    </div>

                    {/* The reading position, as a share of the sections. Only a
                        picture of what the number beside it says. */}
                    <div
                        aria-hidden="true"
                        className="hidden h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-ink/15 md:block"
                    >
                        <div
                            className="h-full origin-left rounded-full bg-signal-ink transition-transform duration-300 ease-out"
                            style={{ transform: `scaleX(${(index + 1) / SECTIONS.length})` }}
                        />
                    </div>

                    {/* A disclosure of links, like the language picker: no ARIA
                        menu, no arrow keys, and a plain list when scripting is off. */}
                    <details
                        ref={detailsRef}
                        className="group shrink-0"
                        onToggle={(event) => setOpen(event.currentTarget.open)}
                        onBlur={(event) => {
                            /* Focus moving to another control closes it. A null
                               relatedTarget is a click on bare ground — the
                               panel's padding — which the pointer listener
                               above tells apart from a click outside. */
                            if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
                                close(false);
                            }
                        }}
                    >
                        <summary
                            ref={summaryRef}
                            aria-expanded={open}
                            aria-controls={open ? PANEL_ID : undefined}
                            className={cn(
                                CONTROL,
                                "flex h-9 cursor-pointer list-none items-center gap-1.5 rounded-full px-2.5 min-[480px]:px-3.5",
                                "font-display text-[0.8125rem] font-bold [&::-webkit-details-marker]:hidden",
                                "hover:border-signal hover:text-signal-ink group-open:border-signal group-open:text-signal-ink"
                            )}
                        >
                            <List className="h-4 w-4 min-[480px]:hidden" strokeWidth={2.25} aria-hidden="true" />
                            {/* The words only where there is room: a phone's bar
                                is better spent on the title. Kept for a screen reader. */}
                            <span className="sr-only min-[480px]:not-sr-only">{t("newToCity.guide.allSections")}</span>
                            <ChevronDown
                                className="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
                                strokeWidth={2.25}
                                aria-hidden="true"
                            />
                        </summary>

                        <div
                            id={PANEL_ID}
                            className="absolute inset-x-0 top-full border-b border-hairline/[var(--hairline-opacity)] bg-surface shadow-[0_22px_32px_-22px_rgb(var(--shadow-color)/0.55)] group-open:animate-fade-in"
                        >
                            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
                                <ul className="grid max-h-[calc(100svh-var(--nav-height)-var(--guide-nav-height)-1rem)] gap-1 overflow-y-auto overscroll-contain p-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {SECTIONS.map(({ id, key, emoji }) => (
                                        <li key={id}>
                                            <a
                                                href={`#${id}`}
                                                aria-current={id === active ? "true" : undefined}
                                                onClick={() => close(false)}
                                                className={cn(
                                                    "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 font-display text-[0.9375rem] font-bold transition-colors duration-200",
                                                    id === active
                                                        ? "bg-signal/10 text-signal-ink"
                                                        : "text-ink-muted hover:bg-surface-2 hover:text-ink"
                                                )}
                                            >
                                                <span aria-hidden="true" className="shrink-0 text-lg leading-none">
                                                    {emoji}
                                                </span>
                                                <span className="min-w-0 flex-1">{t(`newToCity.sections.${key}.title`)}</span>
                                                {id === active && (
                                                    <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                                                )}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </details>

                    {step(next, t("newToCity.guide.next"), ChevronRight)}
                </nav>
            </div>
        </div>
    );
};

export default GuideNav;
