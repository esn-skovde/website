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
const Img = ({
    name,
    src,
    alt = "",
    ratio,
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
                    className={cn("h-full w-full object-cover", imgClassName)}
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
