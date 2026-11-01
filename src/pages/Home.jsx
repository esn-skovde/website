import { useTranslation } from "react-i18next";

import PageShell from "../components/ui/PageShell";
import Hero from "../components/home/Hero";
import Pillars from "../components/home/Pillars";
import NextUp from "../components/home/NextUp";
import CardBand from "../components/home/CardBand";

const Home = () => {
    const { t } = useTranslation();

    return (
        <PageShell
            signal="cyan"
            header={false}
            seo={{
                title: t("navBar.home"),
                description: t("seo.pages.home.description"),
                keywords: t("seo.pages.home.keywords"),
            }}
        >
            <Hero />
            <Pillars />
            <NextUp />
            <CardBand />
        </PageShell>
    );
};

export default Home;
