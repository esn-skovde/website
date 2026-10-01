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

const landing = preloadPage(pageKeyFor(location.pathname, base));

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
