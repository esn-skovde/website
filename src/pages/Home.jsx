import { useTranslation } from "react-i18next";
import Hero from "../components/home/Hero";
import SplitSection from "../components/home/SplitSection";
import Testimonials from "../components/home/Testimonials";
import PageTitle from "../components/common/PageTitle";
import SEO from "../components/SEO";

const Home = () => {
    const { t } = useTranslation();

    return (
        <>
            <SEO
                title={t("home.hero.title")}
                description="ESN Skövde supports international students in Skövde, Sweden. Join our community for events, trips, and unforgettable experiences during your international studies."
                keywords="ESN Skövde, Erasmus Student Network, International Students, Sweden, Exchange, University Life, Student Events, Cultural Activities"
                url="/"
            />
            <PageTitle title={t("navBar.home")} />
                <Hero />
            <div className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
                <SplitSection />
                {/* <Testimonials /> */}
            </div>
        </>
    );
};

export default Home;
