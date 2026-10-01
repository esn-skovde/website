import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { normalizeLanguage } from "../lib/languages";

/**
 * The current language plus a helper for building language-prefixed paths.
 *
 * i18n.language can be a regional tag ("en-US") when it comes from the browser
 * detector, which is not a valid route segment — everything goes through
 * normalizeLanguage so links can never point at /en-US/events.
 *
 * Paths end in a slash, /en/events/: GitHub Pages serves a page only there and
 * redirects /en/events to it, so a slashless link sent crawlers, new tabs and
 * no-JS visitors through a 301.
 */
const useLang = () => {
    const { i18n } = useTranslation();
    const lang = normalizeLanguage(i18n.language);

    const path = useCallback(
        (to = "") => {
            const clean = String(to).replace(/^\/+|\/+$/g, "");
            return clean ? `/${lang}/${clean}/` : `/${lang}/`;
        },
        [lang]
    );

    return { lang, path };
};

export default useLang;
