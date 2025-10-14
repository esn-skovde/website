import { useTranslation } from "react-i18next";
import heroImageDesktop from "../../assets/images/hero.png";
import heroImageMobile from "../../assets/images/hero-portrait.jpeg";

const Hero = () => {
    const { t } = useTranslation();

    return (
        <section className="relative h-screen w-full flex items-center md:items-center">
            {/* Background images - responsive */}
            <div className="absolute inset-0 z-0">
                {/* Desktop/Landscape image - hidden on mobile */}
                <img
                    src={heroImageDesktop}
                    alt="Hero Background Desktop"
                    className="hidden md:block w-full h-full object-cover"
                />
                {/* Mobile/Portrait image - shown only on mobile */}
                <img
                    src={heroImageMobile}
                    alt="Hero Background Mobile"
                    className="block md:hidden w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 md:bg-gradient-to-r md:from-black/75 md:via-black/40 md:to-transparent"></div>
            </div>

            {/* Text content - positioned at top on mobile, bottom-left on desktop */}
            <div className="absolute top-6 md:top-auto md:bottom-20 lg:bottom-24 left-6 md:left-12 lg:left-16 right-6 md:right-auto z-10 max-w-xs sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-4xl">
                <div className="space-y-3 md:space-y-4 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-bold leading-none tracking-tight drop-shadow-2xl [text-shadow:_2px_4px_8px_rgba(0,0,0,0.8)] font-kelson">
                        {t("home.hero.title")}
                    </h1>
                    <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-none tracking-wide drop-shadow-xl animate-slide-in-left animate-glow-pulse font-kelson">
                        {t("home.hero.subtitle")}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Hero;
