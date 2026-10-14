import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";

import { googleMapsUrl, openInMaps } from "../../lib/maps";
import { cn } from "../../lib/cn";

/* Underlined with dots, so the link does not rest on its colour alone, and with
   the pin that the guide's tip tells the reader to look for. */
const LINK =
    "underline decoration-dotted decoration-1 decoration-signal-ink/60 underline-offset-[0.28em] " +
    "transition-colors hover:text-signal-ink hover:decoration-solid";

/* The last word goes in the same unbreakable run as the pin, so a name that
   wraps never leaves the pin alone at the start of a line. */
const splitLastWord = (text) => {
    const at = text.lastIndexOf(" ");
    return at > 0 ? [text.slice(0, at + 1), text.slice(at + 1)] : ["", text];
};

/**
 * A place as a link: the name opens it in the reader's maps app (see
 * lib/maps.js). `query` is what the map is asked to look up.
 *
 * `bare` drops the underline and the pin, for a link that is a whole card or a
 * block of address lines that already carries its own pin.
 */
const MapLink = ({ query, children, className, pinClassName, bare = false, ...rest }) => {
    const { t } = useTranslation();

    const pin = (
        <MapPin
            className={cn("ml-[0.3em] inline-block h-[0.85em] w-[0.85em] align-[-0.1em]", pinClassName || "text-signal-ink")}
            strokeWidth={2.4}
            aria-hidden="true"
        />
    );
    const [head, tail] = typeof children === "string" ? splitLastWord(children) : [null, null];

    return (
        <a
            href={googleMapsUrl(query)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => openInMaps(event, query)}
            className={cn(!bare && LINK, className)}
            {...rest}
        >
            {bare ? (
                children
            ) : tail === null ? (
                <>
                    {children}
                    {pin}
                </>
            ) : (
                <>
                    {head}
                    <span className="whitespace-nowrap">
                        {tail}
                        {pin}
                    </span>
                </>
            )}
            <span className="sr-only"> {t("common.mapsHint")}</span>
        </a>
    );
};

export default MapLink;
