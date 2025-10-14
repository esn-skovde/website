import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import welcomeImage from "../../assets/images/section1.jpeg";
import eventsImage from "../../assets/images/section2.jpeg";
import cityTourImage from "../../assets/images/skovde-city.jpg";

const FeatureSection = () => {
    const { t } = useTranslation();

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {/* Welcome to ESN Section */}
                <div className="flex flex-col md:flex-row items-start gap-8 mb-24">
                    {/* Left: Image */}
                    <div className="w-full md:w-1/2">
                        <div className="rounded-lg overflow-hidden shadow-xl h-80 md:h-96 relative">
                            <img
                                src={welcomeImage}
                                alt="Welcome to ESN"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    {/* Right: Content */}
                    <div className="w-full md:w-1/2 space-y-4 md:pt-0">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {t("home.splitSection.welcome.title")}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            {t("home.splitSection.welcome.description")}
                        </p>
                        <div className="pt-4">
                            <Link
                                to="/board"
                                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                {t("home.splitSection.welcome.button")}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Upcoming Events Section */}
                <div className="flex flex-col md:flex-row-reverse items-start gap-8 mb-24">
                    {/* Right: Image */}
                    <div className="w-full md:w-1/2">
                        <div className="rounded-lg overflow-hidden shadow-xl h-80 md:h-96">
                            <img
                                src={eventsImage}
                                alt="Upcoming Events"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Left: Content */}
                    <div className="w-full md:w-1/2 space-y-4 md:pt-0">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {t("home.splitSection.events.title")}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            {t("home.splitSection.events.description")}
                        </p>
                        <div className="pt-4">
                            <Link
                                to="/events"
                                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                {t("home.splitSection.events.button")}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* New to Skövde Section */}
                <div className="flex flex-col md:flex-row items-start gap-8">
                    {/* Left: Image */}
                    <div className="w-full md:w-1/2">
                        <div className="rounded-lg overflow-hidden shadow-xl h-80 md:h-96">
                            <img
                                src={cityTourImage}
                                alt="City Welcome Tour"
                                image-credit="Tobias Andersson"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="w-full md:w-1/2 space-y-4 md:pt-0">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {t("home.splitSection.cityTour.title")}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            {t("home.splitSection.cityTour.description")}
                        </p>
                        <div className="pt-4">
                            <Link
                                to="/new-to-city"
                                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                {t("home.splitSection.cityTour.button")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
