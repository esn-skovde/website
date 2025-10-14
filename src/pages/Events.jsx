import { useTranslation } from "react-i18next";
import TripsCarousel from "../components/events/TripsCarousel";
import UpcomingEvents from "../components/events/UpcomingEvents";
import PastEvents from "../components/events/PastEvents";
import PageTitle from "../components/common/PageTitle";
import SEO from "../components/SEO";

const Events = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t("navBar.events")}
        description="Discover exciting events, trips, and activities organized by ESN Skövde. Join cultural excursions, social gatherings, and unforgettable experiences with international students."
        keywords="ESN Skövde Events, Student Activities, International Trips, Cultural Events, Social Gatherings, Student Life Sweden, Exchange Events"
        url="/events"
      />
      <PageTitle title={t("navBar.events")} />

      <div className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <TripsCarousel />
        <UpcomingEvents />
        <PastEvents />
      </div>
    </>
  );
};

export default Events;
