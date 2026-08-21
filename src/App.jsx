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

const Home = lazy(() => import("./pages/Home"));
const Events = lazy(() => import("./pages/Events"));
const BoardPage = lazy(() => import("./pages/Board"));
const ESNCard = lazy(() => import("./pages/ESNCard"));
const Contact = lazy(() => import("./pages/Contact"));
const NewToSkovde = lazy(() => import("./pages/NewToSkovde"));
const NotFoundPage = lazy(() => import("./pages/404"));

const PageLoader = () => (
    <div className="flex min-h-[60vh] items-center justify-center bg-ground">
        <Spinner className="h-8 w-8" />
    </div>
);

/**
 * Keeps i18n in step with the URL, and rescues unsupported language segments
 * (an old /en-US/ link, a typo) by redirecting to the closest real language
 * rather than rendering a 404.
 */
const LanguageLayout = () => {
    const { i18n } = useTranslation();
    const { language } = useParams();
    const { pathname, search, hash } = useLocation();

    const supported = isSupportedLanguage(language);

    useEffect(() => {
        if (supported && i18n.language !== language) {
            i18n.changeLanguage(language);
        }
    }, [supported, language, i18n]);

    if (!supported) {
        const rest = pathname.split("/").filter(Boolean).slice(1).join("/");
        const target = `/${normalizeLanguage(language)}/${rest}`;
        return <Navigate to={`${target}${search}${hash}`} replace />;
    }

    return <Outlet />;
};

/** Sends "/" to the visitor's own language rather than always to English. */
const RootRedirect = () => {
    const { i18n } = useTranslation();
    return <Navigate to={`/${normalizeLanguage(i18n.language)}/`} replace />;
};

const ThemedToaster = () => {
    const { resolved } = useTheme();
    // Sonner was imported and used but never mounted, so no toast has ever
    // actually appeared on this site.
    return <Toaster position="bottom-center" theme={resolved} richColors closeButton />;
};

const Shell = () => (
    /* BASE_URL is whatever vite.config.js resolved `base` to, so the router
       matches on the path the site is actually served from — "/" on
       esnskovde.org, "/<repo>/" on a GitHub project page. */
    <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-signal-ink focus:px-5 focus:py-2.5 focus:font-display focus:font-bold focus:text-on-signal"
        >
            Skip to content
        </a>

        <div className="flex min-h-screen flex-col bg-ground">
            <Navbar />
            <main id="main" className="flex-grow">
                <ErrorBoundary>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/" element={<RootRedirect />} />
                            <Route path=":language" element={<LanguageLayout />}>
                                <Route index element={<Home />} />
                                <Route path="events" element={<Events />} />
                                <Route path="esn-card" element={<ESNCard />} />
                                <Route path="board" element={<BoardPage />} />
                                <Route path="contact" element={<Contact />} />
                                <Route path="new-to-skovde" element={<NewToSkovde />} />
                                <Route path="*" element={<NotFoundPage />} />
                            </Route>
                        </Routes>
                    </Suspense>
                </ErrorBoundary>
            </main>
            <Footer />
        </div>

        <ThemedToaster />
    </BrowserRouter>
);

const App = () => (
    <ThemeProvider>
        <Shell />
    </ThemeProvider>
);

export default App;
