import React from "react";
import { useTranslation } from "react-i18next";
import skovdeCityImage from "../../assets/images/skovde-city.jpg";

const NewToCityHero = () => {
    const { t } = useTranslation();

    return (
        <div className="relative py-16 md:py-24">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${skovdeCityImage})` }}
            >
                <div className="absolute inset-0 bg-blue-900/40 dark:bg-blue-900/50"></div>
            </div>

            {/* Photo credit, shown rather than hidden in an off-screen <img>. */}
            <span className="absolute bottom-2 right-3 z-10 text-[0.65rem] text-white/60">
                Photo: Tobias Andersson
            </span>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {t("newToCity.title")}
                    </h1>
                    <p className="text-xl text-blue-100 mb-8">
                        {t("newToCity.subtitle")}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="#getting-started"
                            className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                        >
                            {t("newToCity.getStartedBtn")}
                        </a>
                        <a
                            href="#emergency-contacts"
                            className="inline-block bg-red-600 text-white hover:bg-red-700 font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                        >
                            {t("newToCity.emergencyInfoBtn")}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewToCityHero;
