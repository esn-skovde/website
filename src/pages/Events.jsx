import { useTranslation } from "react-i18next";

import PageShell from "../components/ui/PageShell";
import PageHeader from "../components/ui/PageHeader";
import TripsCarousel from "../components/events/TripsCarousel";
import UpcomingEvents from "../components/events/UpcomingEvents";
import PastEvents from "../components/events/PastEvents";
import SampleDataNotice from "../components/events/SampleDataNotice";
import Container from "../components/ui/Container";
import { sampleDataEnabled } from "../lib/supabase";

const Events = () => {
    const { t } = useTranslation();

    const pageTitle = t("events.pageTitle", { defaultValue: "Events & trips" });

    return (
        <PageShell
            signal="magenta"
            header={false}
            seo={{
                title: t("navBar.events"),
                description: t("seo.pages.events.description"),
                keywords: t("seo.pages.events.keywords"),
            }}
        >
            {/* The trips carousel is what the page opens with, as the guide opens with
                its photo, so the title is not drawn above it (it is still the page's
                heading for screen readers). With no trips the usual header takes over. */}
            <TripsCarousel
                title={pageTitle}
                fallback={
                    <PageHeader
                        eyebrow={t("navBar.events")}
                        title={pageTitle}
                        lead={t("events.pageLead", {
                            defaultValue:
                                "Weeknight socials, weekend trips and everything in between. Bring a friend, or come alone and leave with a few.",
                        })}
                    />
                }
            />
            {sampleDataEnabled && (
                <Container className="pt-8">
                    <SampleDataNotice />
                </Container>
            )}
            <UpcomingEvents />
            <PastEvents />
        </PageShell>
    );
};

export default Events;
