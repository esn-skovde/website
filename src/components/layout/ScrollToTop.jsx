import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { pageKeyFor } from "../../lib/routes";

/* A page keeps changing height for a while after it boots: the event lists
   swap their skeletons for cards, fonts and images arrive. Each change moves
   a #fragment's target away from where the browser put it, so the target is
   put back after every one, until this long after it first appears. */
const PIN_MS = 5000;

/* Any of these means the reader is moving the page themselves. */
const TAKEOVER = ["wheel", "touchstart", "keydown", "pointerdown"];

/** Holds #id where an anchor jump puts it while the page settles. Returns the cleanup. */
const pinTo = (id) => {
    let timer = 0;

    const land = () => {
        const target = document.getElementById(id);
        if (!target) return;
        // "instant": html has scroll-behavior:smooth, and an animated scroll
        // heads for a position that the next change makes wrong.
        target.scrollIntoView({ block: "start", behavior: "instant" });
        /* scrollIntoView lines up the box as it is drawn. An event card still
           sliding in through <Reveal> is drawn 1.25rem below where it comes
           to rest, which left it under the header once it got there. */
        let drift = 0;
        for (let node = target; node; node = node.parentElement) {
            const { transform } = getComputedStyle(node);
            if (transform !== "none") drift += new DOMMatrixReadOnly(transform).m42;
        }
        if (drift) window.scrollBy({ top: -drift, behavior: "instant" });
        timer ||= window.setTimeout(stop, PIN_MS);
    };

    const mutations = new MutationObserver(land);
    const resizes = new ResizeObserver(land);
    const stop = () => {
        mutations.disconnect();
        resizes.disconnect();
        window.clearTimeout(timer);
        TAKEOVER.forEach((type) => window.removeEventListener(type, stop, true));
    };

    mutations.observe(document.getElementById("main") ?? document.body, {
        childList: true,
        subtree: true,
    });
    resizes.observe(document.body);
    TAKEOVER.forEach((type) => window.addEventListener(type, stop, { capture: true, passive: true }));
    land();
    return stop;
};

/**
 * Routers keep the scroll position across navigations; users expect a new page
 * to start at the top. A URL with a #fragment lands on its target instead. The
 * same page in another language is not a new page: the reader stays where they
 * are.
 */
const ScrollToTop = () => {
    const location = useLocation();
    const { pathname, hash } = location;
    /* The location the visitor arrived at. State, not a ref, so that
       StrictMode's second run of the effect still sees the arrival. */
    const [arrival] = useState(location);
    const arrived = location === arrival;
    const shown = useRef(pathname);

    useEffect(() => {
        // Another page, not just another URL: /en/events/ and /sv/events/ are one.
        const moved = pageKeyFor(shown.current) !== pageKeyFor(pathname);
        const switched = !moved && shown.current !== pathname;
        shown.current = pathname;

        if (!hash) {
            // The page arrived at stays where the browser put it: on a
            // reload, that is where the reader was.
            if (moved) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            return undefined;
        }

        let id;
        try {
            id = decodeURIComponent(hash.slice(1));
        } catch {
            return undefined; // a malformed escape names no element
        }

        /* A link within the page to something already on it — the guide's
           chips, its hero buttons, the skip link. The browser's own smooth
           scroll is right there, and pinning would cut it short. */
        const target = document.getElementById(id);
        if (!arrived && !moved && target) {
            /* A language switch reflows the text, which moves the section the
               reader is at: held where it was if its start is on screen. A
               reader who has scrolled on, or far from a fragment left in the
               address, is left where they are, not taken back to it. */
            const { top } = target.getBoundingClientRect();
            return switched && top >= 0 && top < window.innerHeight ? pinTo(id) : undefined;
        }

        return pinTo(id);
    }, [arrived, pathname, hash]);

    return null;
};

export default ScrollToTop;
