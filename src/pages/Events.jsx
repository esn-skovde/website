import { useTranslation } from "react-i18next";

import PageShell from "../components/ui/PageShell";
import TripsCarousel from "../components/events/TripsCarousel";
import UpcomingEvents from "../components/events/UpcomingEvents";
import PastEvents from "../components/events/PastEvents";

const Events = () => {
    const { t } = useTranslation();

    return (
        <PageShell
            signal="magenta"
            eyebrow={t("navBar.events")}
            title={t("events.pageTitle", { defaultValue: "Events & trips" })}
            lead={t("events.pageLead", {
                defaultValue:
                    "Weeknight socials, weekend trips and everything in between. Bring a friend, or come alone and leave with a few.",
            })}
            seo={{
                title: t("navBar.events"),
                description: t("seo.pages.events.description"),
                keywords: t("seo.pages.events.keywords"),
            }}
        >
            <TripsCarousel />
            <UpcomingEvents />
            <PastEvents />
        </PageShell>
    );
};

export default Events;
