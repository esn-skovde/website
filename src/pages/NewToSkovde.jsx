import React from "react";
import { useTranslation } from "react-i18next";
import SEO from "../components/SEO";

// Import section components
import NewToCityHero from "../components/new-to-skovde/NewToSkovdeHero";
import NewToCityNavigation from "../components/new-to-skovde/NewToSkovdeNavigation";
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

const NewToCityPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <SEO
        title={t("navBar.newToCity")}
        description={t("seo.pages.newToCity.description")}
        keywords={t("seo.pages.newToCity.keywords")}
        url={`/${t.language}/new-to-skovde`}
      />

      {/* Hero Banner */}
      <NewToCityHero />

      {/* Quick Navigation */}
      <NewToCityNavigation />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-20">
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
        </div>
      </div>
    </div>
  );
};

export default NewToCityPage;
