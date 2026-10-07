import { Suspense, lazy, useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
    useLocation,
    useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Toaster } from "sonner";

import { ThemeProvider } from "./components/ThemeProvider";
import { useTheme } from "./hooks/ThemeContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import ScrollToTop from "./components/layout/ScrollToTop";
import Spinner from "./components/ui/Spinner";
import { isSupportedLanguage, normalizeLanguage } from "./lib/languages";
import { resolveLocalizedPath } from "./lib/routes";
import { boot } from "./lib/boot";

/* Every page, keyed the way pageKeyFor() in lib/routes.js names it. The
   import() calls stay literal so Vite still gives each page its own chunk. */
const loaders = {
    "": () => import("./pages/Home"),
    events: () => import("./pages/Events"),
    "esn-card": () => import("./pages/ESNCard"),
    board: () => import("./pages/Board"),
    contact: () => import("./pages/Contact"),
    "new-to-skovde": () => import("./pages/NewToSkovde"),
    "*": () => import("./pages/404"),
};

const loaded = {};

/** Fetches a page's chunk. main.jsx does this for the landing page before the first render. */
// eslint-disable-next-line react-refresh/only-export-components
export const preloadPage = (key) =>
    loaders[key]().then((module) =>
        /* No module means main.jsx is reloading the page to pick up a newer
           build. Waiting for that, rather than handing React.lazy nothing,
           keeps the error screen from flashing up while the reload is under
           way. */
        module ? (loaded[key] = module) : new Promise(() => {})
    );

/* A page that is already loaded is handed to React.lazy through a thenable that
   calls back synchronously: that is the only case in which lazy renders it
   without suspending. A resolved Promise still suspends, and the fallback
   replaced the prerendered page with a spinner for at least 300 ms. */
const lazyPage = (key) =>
    lazy(() => (loaded[key] ? { then: (resolve) => resolve(loaded[key]) } : preloadPage(key)));

const pages = Object.keys(loaders).map((key) => [key, lazyPage(key)]);

const PageLoader = () => {
    const { t } = useTranslation();

    return (
        // A full screen, so the footer does not ride up under the spinner.
        <div data-page-loader="" className="flex min-h-screen items-center justify-center bg-ground">
            <Spinner className="h-8 w-8" label={t("common.loading")} />
        </div>
    );
};

/**
 * Keeps i18n in step with the URL, and sends every other spelling of a page
 * to its one URL (see resolveLocalizedPath): /SV/ and /en-US/board to the
 * language's code, an old unprefixed /events to the page in the visitor's
 * language, and a typo to the 404 page in that language. main.jsx does the
 * same before the first render; this covers links followed in the app.
 */
const LanguageLayout = () => {
    const { i18n } = useTranslation();
    const { language } = useParams();
    const { pathname, search, hash } = useLocation();

    const target = resolveLocalizedPath(pathname, normalizeLanguage(i18n.language));
    // Only an exact code: changeLanguage("SV") found no translations, showed
    // English under lang="sv", and stored "SV" as the visitor's language.
    const exact = isSupportedLanguage(language);

    useEffect(() => {
        if (exact && i18n.language !== language) {
            i18n.changeLanguage(language);
        }
    }, [exact, language, i18n]);

    if (target) return <Navigate to={`${target}${search}${hash}`} replace />;

    return <Outlet />;
};

/** Sends "/" to the visitor's own language rather than always to English. */
const RootRedirect = () => {
    const { i18n } = useTranslation();
    return <Navigate to={`/${normalizeLanguage(i18n.language)}/`} replace />;
};

/* Clears a caught error when the route changes, so one failed page does not
   stay on screen for every page after it. Not key={pathname}: that remounts
   Suspense and Routes on every navigation, a language switch included, and
   defeats the router's transition that keeps the old page up while the next
   one loads. */
const RouteErrorBoundary = ({ children }) => {
    const { pathname } = useLocation();
    return <ErrorBoundary resetKey={pathname}>{children}</ErrorBoundary>;
};

const SkipLink = () => {
    const { t } = useTranslation();

    return (
        <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-signal-ink focus:px-5 focus:py-2.5 focus:font-display focus:font-bold focus:text-on-signal"
        >
            {t("common.skipToContent")}
        </a>
    );
};

const ThemedToaster = () => {
    const { resolved } = useTheme();
    const { t } = useTranslation();
    // Sonner was imported and used but never mounted, so no toast has ever
    // actually appeared on this site. Its region and close button are named
    // in English unless told otherwise.
    return (
        <Toaster
            position="bottom-center"
            theme={resolved}
            richColors
            closeButton
            containerAriaLabel={t("common.notifications")}
            toastOptions={{ closeButtonAriaLabel: t("common.closeToast") }}
        />
    );
};

const Shell = () => (
    /* BASE_URL is whatever vite.config.js resolved `base` to, so the router
       matches on the path the site is actually served from — "/" on
       esnskovde.org, "/<repo>/" on a GitHub project page. */
    <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <SkipLink />

        <div className="flex min-h-screen flex-col bg-ground">
            <Navbar />
            <main id="main" className="flex-grow">
                <RouteErrorBoundary>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/" element={<RootRedirect />} />
                            <Route path=":language" element={<LanguageLayout />}>
                                {pages.map(([key, Page]) =>
                                    key ? (
                                        <Route key={key} path={key} element={<Page />} />
                                    ) : (
                                        <Route key="home" index element={<Page />} />
                                    )
                                )}
                            </Route>
                        </Routes>
                    </Suspense>
                </RouteErrorBoundary>
            </main>
            <Footer />
        </div>

        <ThemedToaster />
    </BrowserRouter>
);

const App = () => {
    // Runs after the first commit: whatever mounts from here on is new to the
    // page, not a repaint of the prerendered HTML.
    useEffect(() => {
        boot.done = true;
    }, []);

    return (
        <ThemeProvider>
            <Shell />
        </ThemeProvider>
    );
};

export default App;
