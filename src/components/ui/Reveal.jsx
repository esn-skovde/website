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
                if (!entry.isIntersecting) return;
                setRevealed(true);
                observer.disconnect();
            },
            { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
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
