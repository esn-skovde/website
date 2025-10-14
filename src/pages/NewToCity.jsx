import React from "react";
import { useTranslation } from "react-i18next";
import PageTitle from "../components/common/PageTitle";
import SEO from "../components/SEO";

// Import section components
import NewToCityHero from "../components/new-to-city/NewToCityHero";
import NewToCityNavigation from "../components/new-to-city/NewToCityNavigation";
import GettingStartedSection from "../components/new-to-city/GettingStartedSection";
import CityHighlightsSection from "../components/new-to-city/CityHighlightsSection";
import PlacesToExploreSection from "../components/new-to-city/PlacesToExploreSection";
import TransportSection from "../components/new-to-city/TransportSection";
import SettlingInSection from "../components/new-to-city/SettlingInSection";
import EmergencyContactsSection from "../components/new-to-city/EmergencyContactsSection";
import BuddyProgramSection from "../components/new-to-city/BuddyProgramSection";
import ShoppingSection from "../components/new-to-city/ShoppingSection";
import UsefulAppsSection from "../components/new-to-city/UsefulAppsSection";
import AccommodationSection from "../components/new-to-city/AccommodationSection";
import StudentLifeSection from "../components/new-to-city/StudentLifeSection";

const NewToCityPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <SEO
        title={t("navBar.newToCity")}
        description="Essential tips for students new to Skövde: housing, transport, shopping, emergency contacts, and more - curated by ESN Skövde."
        keywords="New to Skövde, student guide, housing Skövde, transport Skövde, ESN tips"
        url="/new-to-city"
      />
      <PageTitle title={t("navBar.newToCity")} />

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
