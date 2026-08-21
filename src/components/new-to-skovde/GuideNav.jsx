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
    const railRef = useRef(null);

    useEffect(() => {
        const nodes = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean);
        if (!nodes.length) return undefined;

        /* A narrow band just below the sticky bar: whatever crosses it is what
           the reader is looking at. Without the band every tall section counts
           as visible at once and the highlight jitters. */
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting);
                if (!visible.length) {
                    /* Above the first section — in the hero — nothing crosses the
                       band, and the highlight would be left wherever the reader
                       last was. On a reload restored to the top that means the
                       rail opens scrolled to the end, pointing at the wrong
                       chip. Back at the top, the first chip is the true answer. */
                    if (nodes[0].getBoundingClientRect().top > 0) setActive(SECTIONS[0].id);
                    return;
                }
                const topmost = visible.reduce((a, b) =>
                    a.boundingClientRect.top <= b.boundingClientRect.top ? a : b
                );
                setActive(topmost.target.id);
            },
            { rootMargin: "-22% 0px -70% 0px", threshold: 0 }
        );

        nodes.forEach((node) => observer.observe(node));
        return () => observer.disconnect();
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
        <div className="sticky top-nav z-30 border-b border-hairline/[var(--hairline-opacity)] glass">
            <Container width="wide" className="px-0 sm:px-0 lg:px-0">
                <nav aria-label={t("newToCity.title")}>
                    <ul
                        ref={railRef}
                        className="scrollbar-none flex gap-1.5 overflow-x-auto px-4 py-2.5 sm:px-6"
                    >
                        {SECTIONS.map(({ id, key, emoji }) => (
                            <li key={id}>
                                <a
                                    href={`#${id}`}
                                    data-chip={id}
                                    aria-current={active === id ? "true" : undefined}
                                    className={cn(
                                        "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5",
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
