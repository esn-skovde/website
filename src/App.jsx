import { Suspense, lazy } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "./components/ThemeProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import useImageCredits from "./hooks/useImageCredits";

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
);

function App() {
    // Initialize automatic image credits
    useImageCredits();

    return (
        <HelmetProvider>
            <ThemeProvider>
                <BrowserRouter basename="/">
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <main className="flex-grow">
                            <Suspense fallback={<PageLoader />}>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/events" element={<Events />} />
                                    <Route path="/esn-card" element={<ESNCard />} />
                                    <Route path="/board" element={<BoardPage />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/new-to-city" element={<NewToCityPage />} />
                                    <Route
                                        path="/esn-skovde"
                                        element={<Navigate to="/esn-skovde/" replace />}
                                    />
                                    <Route path="*" element={<NotFoundPage />} />
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
