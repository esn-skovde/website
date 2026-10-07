/* The pages every language serves, and which one a URL lands on.

   Plain JS, with no JSX and no browser globals, so Node can import it as well
   as the app: main.jsx uses it to fetch the landing page's chunk before the
   first render, and the build scripts can list the same pages from it. */
import { DEFAULT_LANGUAGE, canonicalLanguage, isSupportedLanguage } from "./languages.js";

/** Every page besides the home page, as it appears in the URL: /<lang>/<slug>/. */
export const PAGE_SLUGS = ["events", "esn-card", "board", "contact", "new-to-skovde"];

// What a language tag looks like (en, SV, sv-SE, nb_NO, es-419), as opposed
// to a page. Page slugs are checked first: esn-card has the same shape.
const LANGUAGE_TAG = /^[a-z]{2,3}([-_][a-z0-9]{2,8})*$/i;

/**
 * The one URL a path under the base belongs at, or null when it is already
 * there. A page lives at /<lang>/<slug>/: a code from LANGUAGE_CODES, the slug
 * as PAGE_SLUGS spells it, and a trailing slash, the only form GitHub Pages
 * serves (it matches case exactly). `visitorLang` fills in a language the path
 * does not name.
 *
 *   /en/events/                    -> null
 *   /en/events, /EN/Events/        -> /en/events/
 *   /, /index.html                 -> /<visitorLang>/
 *   /nb/, /SV/                     -> /no/, /sv/
 *   /en-US/board, /pt-BR/board     -> /en/board/, /<visitorLang>/board/
 *   /events (old unprefixed URL)   -> /<visitorLang>/events/
 *   /evnts, /en/evnts              -> /<visitorLang>/evnts/, /en/evnts/ (the 404 page)
 */
export const resolveLocalizedPath = (pathname, visitorLang) => {
    const segments = pathname.split("/").filter(Boolean);
    // The file a directory URL serves, so /index.html is the home page.
    if (segments[segments.length - 1]?.toLowerCase() === "index.html") segments.pop();

    let [lang, ...rest] = segments;
    if (!isSupportedLanguage(lang)) {
        const first = lang ?? "";
        const isPage = PAGE_SLUGS.includes(first.toLowerCase());
        if (!isPage && LANGUAGE_TAG.test(first)) {
            // A language in another case or region, or one the site lacks.
            lang = canonicalLanguage(first) ?? visitorLang;
        } else {
            // An old link from before the language prefix, or a typo: kept
            // whole under the visitor's language, which serves the page or its 404.
            [lang, rest] = [visitorLang, segments];
        }
    }

    const [slug, ...tail] = rest;
    const page = PAGE_SLUGS.find((s) => s === slug?.toLowerCase()) ?? slug;
    const target = `/${[lang, page, ...tail].filter(Boolean).join("/")}/`;
    return target === pathname ? null : target;
};

/**
 * The page a pathname renders: "" for the home page, a slug from PAGE_SLUGS,
 * or "*" for the 404 page. That is the page at the URL resolveLocalizedPath
 * sends it to, so it matches what LanguageLayout ends up rendering.
 *
 * `base` is the path the site is served from — "/" on esnskovde.org,
 * "/<repo>/" on a GitHub project page — with or without its trailing slash.
 *
 *   /, /en, /en/                -> ""
 *   /en/board, /en/board/       -> "board"
 *   /events (old unprefixed URL) -> "events"
 *   /en/nope, /en/board/nope    -> "*"
 */
export const pageKeyFor = (pathname, base = "/") => {
    const prefix = base.replace(/\/+$/, "");
    const path =
        prefix && (pathname === prefix || pathname.startsWith(`${prefix}/`))
            ? pathname.slice(prefix.length)
            : pathname;
    // The visitor's language moves the page to another language, never to another page.
    const resolved = resolveLocalizedPath(path, DEFAULT_LANGUAGE) ?? path;
    const [, slug, ...tail] = resolved.split("/").filter(Boolean);

    if (!slug) return "";
    if (!tail.length && PAGE_SLUGS.includes(slug)) return slug;
    return "*";
};

/**
 * The same page in another language: /en/events/ is /sv/events/ in Swedish.
 * Anything that is not one of the pages, such as the 404 a typo lands on, goes
 * to the language's home page instead, so that no language link leads to a
 * /xx/404/ or a /xx/<typo>/.
 *
 * `pathname` is the router's, with the base path already stripped. Like
 * every internal URL, the result ends in a slash.
 *
 *   languageHref("sv", "/en/events/")  -> /sv/events/
 *   languageHref("sv", "/en/")         -> /sv/
 *   languageHref("sv", "/en/nope/")    -> /sv/
 */
export const languageHref = (code, pathname) => {
    const page = pageKeyFor(pathname);
    return page && page !== "*" ? `/${code}/${page}/` : `/${code}/`;
};
