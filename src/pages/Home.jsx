import { useTranslation } from "react-i18next";
import Hero from "../components/home/Hero";
import SplitSection from "../components/home/SplitSection";
import Testimonials from "../components/home/Testimonials";
import SEO from "../components/SEO";

const Home = () => {
    const { t } = useTranslation();

    return (
        <>
            <SEO
                title={t("navBar.home")}
                description={t("seo.pages.home.description")}
                keywords={t("seo.pages.home.keywords")}
                url={`/${t.language}/`}
            />
                <Hero />
            <div className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
                <SplitSection />
                {/* <Testimonials /> */}
            </div>
        </>
    );
};

export default Home;
