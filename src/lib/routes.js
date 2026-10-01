/* The pages every language serves, and which one a URL lands on.

   Plain JS, with no JSX and no browser globals, so Node can import it as well
   as the app: main.jsx uses it to fetch the landing page's chunk before the
   first render, and the build scripts can list the same pages from it. */

/** Every page besides the home page, as it appears in the URL: /<lang>/<slug>. */
export const PAGE_SLUGS = ["events", "esn-card", "board", "contact", "new-to-skovde"];

/**
 * The page a pathname renders: "" for the home page, a slug from PAGE_SLUGS,
 * or "*" for the 404 page.
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
    // Lower-cased because the router matches without regard to case.
    const segments = path.toLowerCase().split("/").filter(Boolean);

    // A lone segment sits where the language goes, and LanguageLayout sends an
    // unsupported one to the closest real language: it is a home page.
    if (segments.length === 0) return "";
    if (segments.length === 1) return PAGE_SLUGS.includes(segments[0]) ? segments[0] : "";
    if (segments.length === 2 && PAGE_SLUGS.includes(segments[1])) return segments[1];
    return "*";
};
