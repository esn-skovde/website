import { useState } from "react";
import { getImage } from "../../lib/images";
import { cn } from "../../lib/cn";

/**
 * Responsive image.
 *
 * `name` looks up the WebP variants written by scripts/optimize-images.js and
 * emits a srcset; `src` is the escape hatch for remote URLs (Supabase
 * thumbnails). Every image is lazy and async by default and sits in a fixed
 * aspect box, so nothing shifts as the page loads.
 */
/* cn() is a plain join, not a tailwind-merge, so passing object-contain through
   imgClassName would leave both utilities on the element and let CSS source
   order decide. Fit is a prop for that reason. */
const FIT = { cover: "object-cover", contain: "object-contain" };

const Img = ({
    name,
    src,
    alt = "",
    ratio,
    fit = "cover",
    sizes = "100vw",
    credit,
    priority = false,
    fallbackName,
    className,
    imgClassName,
    objectPosition,
}) => {
    const [failed, setFailed] = useState(false);

    const resolved = name ? getImage(name) : null;
    const fallback = fallbackName ? getImage(fallbackName) : null;
    const active = failed ? fallback : (resolved ?? fallback);

    const source = active?.src ?? (failed ? undefined : src);
    const srcSet = active?.srcSet;

    return (
        <div
            className={cn("relative overflow-hidden bg-surface-2", className)}
            style={ratio ? { aspectRatio: ratio } : undefined}
        >
            {source ? (
                <img
                    src={source}
                    srcSet={srcSet}
                    sizes={srcSet ? sizes : undefined}
                    alt={alt}
                    loading={priority ? "eager" : "lazy"}
                    decoding={priority ? "sync" : "async"}
                    fetchPriority={priority ? "high" : undefined}
                    onError={() => setFailed(true)}
                    style={objectPosition ? { objectPosition } : undefined}
                    className={cn("h-full w-full", FIT[fit], imgClassName)}
                />
            ) : (
                <div className="h-full w-full bg-surface-2" aria-hidden="true" />
            )}

            {credit && (
                <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-[0.6875rem] font-medium text-white/90 backdrop-blur-sm">
                    📷 {credit}
                </span>
            )}
        </div>
    );
};

export default Img;
