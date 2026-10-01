/* Every route is prerendered, so the first render usually lands on a page the
   visitor is already looking at. main.jsx records whether it does before it
   renders; App marks the first commit done in an effect. hooks/useBootMount
   reads both. */
export const boot = { overPrerender: false, done: false, hidden: [] };

const pagePosition = (element) => {
    const { top, left } = element.getBoundingClientRect();
    return [top + window.scrollY, left + window.scrollX];
};

/* The prerendered page was captured at one window size, so on a taller or
   wider screen it can still be hiding reveals that are in view. main.jsx notes
   where, just before the first render, and a reveal that comes up in one of
   those places fades in as it would on any page instead of popping in. */
export const noteHiddenReveals = (root) => {
    boot.hidden = [...root.querySelectorAll('.reveal[data-revealed="false"]')].map(pagePosition);
};

export const hiddenBeforeBoot = (element) => {
    const [top, left] = pagePosition(element);
    return boot.hidden.some(([t, l]) => Math.abs(t - top) < 2 && Math.abs(l - left) < 2);
};
