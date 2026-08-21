import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";

/**
 * One-shot scroll reveal.
 *
 * Each instance observes only itself and disconnects on first intersection, so
 * there is no long-lived observer and no work once an element has appeared.
 */
const Reveal = ({ children, as: Tag = "div", delay = 0, className, ...rest }) => {
    const ref = useRef(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return undefined;

        // Anything already on screen at mount should not animate in late.
        if (typeof IntersectionObserver === "undefined") {
            setRevealed(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                // An element can cross the viewport entirely between two frames —
                // scroll restoration on reload, an #anchor jump, End, a scrollbar
                // drag. Both observations are then non-intersecting and the element
                // would stay at opacity 0 for good. If it is already above the
                // viewport the user has passed it, so show it without animating in.
                if (!entry.isIntersecting) {
                    if (entry.boundingClientRect.bottom > 0) return;
                }
                setRevealed(true);
                observer.disconnect();
            },
            // threshold 0, not a fraction: a card taller than the viewport can
            // show a wide band and still fall under a 5% area threshold, which
            // left it non-intersecting with its bottom still on screen — through
            // both branches above, and invisible. The -10% bottom margin is what
            // holds the reveal until the element is properly up into the view.
            { rootMargin: "0px 0px -10% 0px", threshold: 0 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            data-revealed={revealed}
            style={delay ? { "--reveal-delay": `${delay}ms` } : undefined}
            className={cn("reveal", className)}
            {...rest}
        >
            {children}
        </Tag>
    );
};

export default Reveal;
