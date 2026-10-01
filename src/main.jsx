import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { preloadPage } from './App.jsx';
import i18n from "./i18n.js";
import { boot, noteHiddenReveals } from "./lib/boot.js";
import { isSupportedLanguage, normalizeLanguage } from "./lib/languages.js";
import { pageKeyFor } from "./lib/routes.js";

const base = import.meta.env.BASE_URL;
const root = document.getElementById("root");
// Without the trailing slash, which GitHub Pages adds with a redirect.
const reloadFlag = () => `chunk-reload:${location.pathname.replace(/\/+$/, "")}`;

/* Every deploy renames the hashed chunks and GitHub Pages drops the old ones,
   so a tab opened before a deploy fails on the first page it has not loaded
   yet. Reload once to pick up the new build. The flag keeps a chunk that is
   broken for good from reloading forever: that failure is left to reach the
   error boundary, and preventDefault() is only called when reloading, since
   it would turn the import's real error into an undefined module. */
window.addEventListener("vite:preloadError", (event) => {
    const flag = reloadFlag();
    try {
        if (sessionStorage.getItem(flag)) return;
        sessionStorage.setItem(flag, "1");
    } catch {
        return; // Without storage there is no telling a first failure from a loop.
    }
    event.preventDefault();
    location.reload();
});

/* "/" only redirects to the visitor's language, so its first commit was an
   empty frame before the home page. Rewriting the URL first makes the first
   commit the home page itself; RootRedirect still covers in-app links to "/". */
if (location.pathname === base || `${location.pathname}/` === base) {
    history.replaceState(
        history.state,
        "",
        `${base}${normalizeLanguage(i18n.language)}/${location.search}${location.hash}`
    );
}

/* i18next reads the language from the first path segment, which under a
   project page's base path is the repo name, and falls back to the stored or
   browser language. LanguageLayout only corrects that in an effect, after the
   first commit has put that language's text over the prerendered page. */
const [urlLanguage] = location.pathname.slice(base.length).split("/");
if (isSupportedLanguage(urlLanguage) && i18n.language !== normalizeLanguage(urlLanguage)) {
    i18n.changeLanguage(normalizeLanguage(urlLanguage));
}

/* The prerendered page is already on screen, and createRoot replaces it with
   whatever the first commit renders. Rendering before the page's chunk had
   arrived made that a Suspense spinner, for at least 300 ms, on every cold
   load; fetching the chunk first makes it the same page. The wait is capped:
   after five seconds the app starts anyway, with the spinner in <main>, so
   the header and its menus work even while a chunk is stalled. */
boot.overPrerender = root.firstElementChild !== null;

const bootFlag = reloadFlag();
const landing = preloadPage(pageKeyFor(location.pathname, base));

// A clean boot means a later chunk failure on this URL may reload again.
landing.then(
    () =>
        setTimeout(() => {
            try {
                sessionStorage.removeItem(bootFlag);
            } catch {
                /* private mode — nothing was stored */
            }
        }, 10000),
    () => {}
);

Promise.race([landing, new Promise((resolve) => setTimeout(resolve, 5000))])
    .catch(() => {})
    .finally(() => {
        if (boot.overPrerender) noteHiddenReveals(root);
        createRoot(root).render(
            <StrictMode>
                <App />
            </StrictMode>
        );
    });
