import { useTranslation } from "react-i18next";
import TripsCarousel from "../components/events/TripsCarousel";
import UpcomingEvents from "../components/events/UpcomingEvents";
import PastEvents from "../components/events/PastEvents";
import SEO from "../components/SEO";

const Events = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t("navBar.events")}
        description={t("seo.pages.events.description")}
        keywords={t("seo.pages.events.keywords")}
        url={`/${t.language}/events`}
      />

      <div className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <TripsCarousel />
        <UpcomingEvents />
        <PastEvents />
      </div>
    </>
  );
};

export default Events;
