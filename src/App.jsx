import { Suspense, lazy, useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
    useParams,
} from "react-router-dom";
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { ThemeProvider } from "./components/ThemeProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import useImageCredits from "./hooks/useImageCredits";
import { useTranslation } from "react-i18next";

// Lazy load page components for code splitting
const Home = lazy(() => import("./pages/Home"));
const Events = lazy(() => import("./pages/Events"));
const BoardPage = lazy(() => import("./pages/Board"));
const ESNCard = lazy(() => import("./pages/ESNCard"));
const NotFoundPage = lazy(() => import("./pages/404"));
const Contact = lazy(() => import("./pages/Contact"));
const NewToCityPage = lazy(() => import("./pages/NewToCity"));

// Loading component
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[50vh]">
        <Helmet>
            <title>Loading… - ESN Skövde</title>
        </Helmet>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
);

// Layout that syncs i18n language from URL and renders nested routes
const LanguageLayout = () => {
    const { i18n } = useTranslation();
    const params = useParams();
    const urlLanguage = params.language;

    useEffect(() => {
        if (urlLanguage && i18n.language !== urlLanguage) {
            i18n.changeLanguage(urlLanguage);
        }
    }, [urlLanguage, i18n]);

    return <Outlet />;
};

function App() {
    // Initialize automatic image credits
    useImageCredits();

    return (
        <HelmetProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <main className="flex-grow">
                            <Suspense fallback={<PageLoader />}>
                                <Routes>
                                    {/* Default redirect to English */}
                                    <Route path="/" element={<Navigate to="/en/" replace />} />

                                    {/* Language-prefixed routes */}
                                    <Route path=":language" element={<LanguageLayout />}>
                                        <Route index element={<Home />} />
                                        <Route path="events" element={<Events />} />
                                        <Route path="esn-card" element={<ESNCard />} />
                                        <Route path="board" element={<BoardPage />} />
                                        <Route path="contact" element={<Contact />} />
                                        <Route path="new-to-city" element={<NewToCityPage />} />
                                        <Route path="*" element={<NotFoundPage />} />
                                    </Route>
                                </Routes>
                            </Suspense>
                        </main>
                        <Footer />
                    </div>
                </BrowserRouter>
            </ThemeProvider>
        </HelmetProvider>
    );
}

export default App;
