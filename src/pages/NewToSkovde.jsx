import { useTranslation } from "react-i18next";

import PageShell from "../components/ui/PageShell";
import GuideHero from "../components/new-to-skovde/GuideHero";
import GuideIndex from "../components/new-to-skovde/GuideIndex";
import GuideNav from "../components/new-to-skovde/GuideNav";
import GettingStartedSection from "../components/new-to-skovde/GettingStartedSection";
import CityHighlightsSection from "../components/new-to-skovde/CityHighlightsSection";
import PlacesToExploreSection from "../components/new-to-skovde/PlacesToExploreSection";
import TransportSection from "../components/new-to-skovde/TransportSection";
import SettlingInSection from "../components/new-to-skovde/SettlingInSection";
import EmergencyContactsSection from "../components/new-to-skovde/EmergencyContactsSection";
import BuddyProgramSection from "../components/new-to-skovde/BuddyProgramSection";
import ShoppingSection from "../components/new-to-skovde/ShoppingSection";
import UsefulAppsSection from "../components/new-to-skovde/UsefulAppsSection";
import AccommodationSection from "../components/new-to-skovde/AccommodationSection";
import StudentLifeSection from "../components/new-to-skovde/StudentLifeSection";

const NewToSkovde = () => {
    const { t } = useTranslation();

    return (
        <PageShell
            signal="green"
            header={false}
            seo={{
                title: t("navBar.newToCity"),
                description: t("seo.pages.newToCity.description"),
                keywords: t("seo.pages.newToCity.keywords"),
            }}
        >
            <GuideHero />
            <GuideIndex />
            <GuideNav />

            <GettingStartedSection />
            <CityHighlightsSection />
            <PlacesToExploreSection />
            <TransportSection />
            <SettlingInSection />
            <EmergencyContactsSection />
            <BuddyProgramSection />
            <ShoppingSection />
            <UsefulAppsSection />
            <AccommodationSection />
            <StudentLifeSection />
        </PageShell>
    );
};

export default NewToSkovde;
