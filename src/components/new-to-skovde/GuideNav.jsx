import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Container from "../ui/Container";
import { SECTIONS } from "./sections";
import { cn } from "../../lib/cn";

/**
 * Sticky table of contents for a long guide. It tracks which section is
 * currently under the reader and keeps that chip in view, so on a phone the
 * rail always shows where you are rather than always starting from the left.
 */
const GuideNav = () => {
    const { t } = useTranslation();
    const [active, setActive] = useState(SECTIONS[0].id);
    const barRef = useRef(null);
    const railRef = useRef(null);

    useEffect(() => {
        const bar = barRef.current;
        const root = document.documentElement;
        const nodes = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean);
        let band;

        const track = () => {
            /* Anchors and keyboard focus are held below the rail through
               --guide-nav-height (see index.css). CSS can only guess the
               rail's height, which depends on the fonts and on how the chips
               wrap, so the measured one replaces it: 0 where it doesn't stick. */
            const sticky = getComputedStyle(bar).position === "sticky";
            root.style.setProperty(
                "--guide-nav-height",
                sticky ? `${bar.getBoundingClientRect().height}px` : "0px"
            );

            band?.disconnect();
            if (!nodes.length) return;

            /* The line an anchor jump puts a section's top on: the scroll
               padding plus the section's scroll margin. The last section that
               has reached it is the one being read, so a chip always lights
               itself — a band at a fixed share of the screen sat above that
               line on short screens and lit the section before. The 1px band
               just below the line only says when to look again; the answer
               comes from every section, not just the ones that crossed it. */
            const line =
                parseFloat(getComputedStyle(root).scrollPaddingTop) +
                parseFloat(getComputedStyle(nodes[0]).scrollMarginTop);
            const edge = Math.round(line) + 1;

            band = new IntersectionObserver(
                () => {
                    const reading = nodes.filter((node) => node.getBoundingClientRect().top <= edge).pop();
                    // Above the first section, in the hero, the first chip is the true answer.
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
        // Again whenever the rail changes height or the window is resized: the band is in pixels.
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

    useEffect(() => {
        const rail = railRef.current;
        const chip = rail?.querySelector(`[data-chip="${active}"]`);
        if (!rail || !chip) return;
        // Centre the chip by setting scrollLeft directly: scrollIntoView would
        // also move the page vertically.
        const target = chip.offsetLeft - rail.clientWidth / 2 + chip.clientWidth / 2;
        rail.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    }, [active]);

    return (
        /* On a short screen — the max-height in index.css — the rail scrolls
           away with the page instead of sticking under the header. */
        <div
            ref={barRef}
            data-guide-nav=""
            className="sticky top-nav z-30 border-b border-hairline/[var(--hairline-opacity)] glass [@media(max-height:500px)]:static"
        >
            <Container width="wide" className="px-0 sm:px-0 lg:px-0">
                <nav aria-label={t("newToCity.title")}>
                    {/* From lg the chips wrap onto a second row: with no
                        scrollbar to show, a mouse could not reach the ones cut
                        off at the end of a single row. The Container already
                        pads the page, so the rail drops its own gutter there
                        and the chips a little padding: Spanish needs both to
                        fit in two rows at 1024px. */}
                    <ul
                        ref={railRef}
                        className="scrollbar-none flex gap-1.5 overflow-x-auto px-4 py-2.5 sm:px-6 lg:flex-wrap lg:justify-center lg:overflow-x-visible lg:px-0"
                    >
                        {SECTIONS.map(({ id, key, emoji }) => (
                            <li key={id}>
                                <a
                                    href={`#${id}`}
                                    data-chip={id}
                                    aria-current={active === id ? "true" : undefined}
                                    className={cn(
                                        "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 lg:px-2.5",
                                        "font-display text-[0.8125rem] font-bold transition-colors duration-200",
                                        active === id
                                            ? "bg-signal-ink text-on-signal"
                                            : "text-ink-muted hover:bg-signal/10 hover:text-signal-ink"
                                    )}
                                >
                                    <span aria-hidden="true">{emoji}</span>
                                    {t(`newToCity.sections.${key}.title`)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </Container>
        </div>
    );
};

export default GuideNav;
