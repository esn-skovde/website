import { useState } from "react";
import { Camera } from "lucide-react";
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

    const local = name ? getImage(name) : null;
    const fallback = fallbackName ? getImage(fallbackName) : null;

    /* Precedence: the local variant set, then the remote URL, then the fallback —
       and the fallback again once a remote URL has failed to load.

       The fallback used to be picked ahead of `src`, so any component passing
       both — EventCard and TripsCarousel, which is every event and trip on the
       site — discarded the Supabase thumbnail and rendered the placeholder
       instead. Nothing caught it because the placeholder is a real photograph. */
    let picked = null; // has a srcset
    let remote = null; // a bare URL

    if (local) picked = local;
    else if (src && !failed) remote = src;
    else picked = fallback;

    const source = picked?.src ?? remote;
    const srcSet = picked?.srcSet;

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
                <span className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[0.6875rem] font-medium text-white/90 backdrop-blur-sm">
                    <Camera className="h-3 w-3 shrink-0" strokeWidth={2.2} aria-hidden="true" />
                    {credit}
                </span>
            )}
        </div>
    );
};

export default Img;
