/* Keeps the reader's place when the language changes under them.

   A language switch swaps every string on the page and the text reflows: the
   guide is 22954px tall in English and 24456px in German on a phone. The
   browsers that have CSS scroll anchoring (Chrome, Firefox) make up for it
   most of the time; Safari has none, so on an iPhone the reader landed a
   screen or two from where they were, and a switch from the footer left the
   footer they had just used below the fold.

   Nothing remounts when the language changes (the same route renders the same
   elements, only their text differs), so the element the reader is at can be
   held on to. markPlace() notes it, and where it is on screen, when a language
   link is clicked, before anything has moved. keepPlace() runs once the new
   text is in: it puts that element back where it was, for as long as the page
   keeps reflowing, and stops the moment the reader scrolls for themselves.
   What it corrects is how far the element has moved by now, so where the
   browser has already made up for the change there is nothing left to do.

   Plain JS over the DOM, called from ScrollToTop. */

// How long the place is held once the new text has arrived.
const WATCH_MS = 5000;
// How long a switch may take to bring its text before the place is let go.
const WAIT_MS = 20000;
/* Any of these means the reader is moving the page themselves. */
const TAKEOVER = ["wheel", "touchstart", "keydown", "pointerdown"];

let place = null;

/* html has scroll-padding-top for the fixed header: the line the content
   starts under, and the one a reader's eye goes to first. */
const readingLine = () => {
    const line = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    return Number.isFinite(line) ? line : 0;
};

/* Where the element sits when its entrance animation has finished: a <Reveal>
   still sliding in is drawn a little lower than it will rest (ScrollToTop's
   pinTo makes the same allowance). */
const restingTop = (element) => {
    let drift = 0;
    for (let node = element; node; node = node.parentElement) {
        const { transform } = getComputedStyle(node);
        if (transform !== "none") drift += new DOMMatrixReadOnly(transform).m42;
    }
    return element.getBoundingClientRect().top - drift;
};

/* Fixed and sticky things stay where they are on the screen whatever the page
   does, and an absolutely placed one moves with its container rather than with
   the text beside it, so none of them can say where the reader is. */
const outOfFlow = (style) => ["fixed", "sticky", "absolute"].includes(style.position);

/**
 * The first thing in the page at or below the reading line: the block the line
 * runs through (its deepest part that does), or else the next one to start.
 * The same pick scroll anchoring makes, from where the reader actually sees.
 */
const findAtLine = (parent, line) => {
    for (const child of parent.children) {
        const rect = child.getBoundingClientRect();
        const style = getComputedStyle(child);

        if (rect.width === 0 && rect.height === 0) {
            // Not drawn: display:none, or display:contents, whose children are.
            if (style.display !== "contents") continue;
            const inner = findAtLine(child, line);
            if (inner) return inner;
            continue;
        }
        if (rect.bottom <= line || outOfFlow(style)) continue;
        if (rect.top >= line) return child;
        return findAtLine(child, line) ?? child;
    }
    return null;
};

/* An element that scrolls with the page, as opposed to one in the header or
   the menu sheet. */
const scrollsWithPage = (element) => {
    for (let node = element; node && node !== document.documentElement; node = node.parentElement) {
        if (["fixed", "sticky"].includes(getComputedStyle(node).position)) return false;
    }
    return true;
};

/* Where an element is in the tree, so that an equivalent can be found if React
   does replace it. Translations change text, never structure. */
const pathTo = (node) => {
    const path = [];
    for (let at = node; at && at !== document.body; at = at.parentElement) {
        path.unshift([...at.parentElement.children].indexOf(at));
    }
    return path;
};

const followPath = (path, tagName) => {
    let node = document.body;
    for (const index of path) node = node?.children[index];
    return node?.tagName === tagName ? node : null;
};

/** Lets go of the place, whatever it was waiting for. */
export const forgetPlace = () => {
    if (!place) return;
    window.clearTimeout(place.timer);
    place.observers?.forEach((observer) => observer.disconnect());
    TAKEOVER.forEach((type) => window.removeEventListener(type, forgetPlace, true));
    place = null;
};

const correct = () => {
    if (!place) return;
    const node = place.node.isConnected
        ? place.node
        : followPath(place.path, place.node.tagName);
    if (!node) return;

    const rect = node.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return; // not drawn: nothing to measure
    const moved = restingTop(node) - place.top;
    if (Math.abs(moved) >= 1) {
        // "instant": html has scroll-behavior:smooth, and an animated scroll
        // heads for a position that the next change makes wrong.
        window.scrollBy({ top: moved, left: 0, behavior: "instant" });
    }
};

/**
 * Notes where the reader is, for a switch to `link`'s language that has just
 * been asked for: the language link itself when it scrolls with the page (the
 * footer's, which has to stay under the reader's finger), otherwise the block
 * at the reading line (the header's picker and the menu sheet are fixed).
 */
export const markPlace = (link) => {
    forgetPlace();

    const node = scrollsWithPage(link) ? link : findAtLine(document.body, readingLine());
    if (!node) return;

    place = {
        node,
        path: pathTo(node),
        top: restingTop(node),
        language: link.getAttribute("hreflang"),
        timer: window.setTimeout(forgetPlace, WAIT_MS),
    };
    TAKEOVER.forEach((type) => window.addEventListener(type, forgetPlace, { capture: true, passive: true }));
};

/**
 * Called when the page has taken on `language`. From here, until the page has
 * settled, whatever moves the noted element is undone. Watches for every kind
 * of change: the observers fire after layout and before paint, so the reader
 * never sees the page at the wrong offset.
 */
export const keepPlace = (language) => {
    if (!place || place.observers || place.language !== language) return;

    window.clearTimeout(place.timer);
    place.timer = window.setTimeout(forgetPlace, WATCH_MS);
    place.observers = [new MutationObserver(correct), new ResizeObserver(correct)];
    place.observers[0].observe(document.body, { childList: true, characterData: true, subtree: true });
    place.observers[1].observe(document.body);
};
