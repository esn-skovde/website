import { useTranslation } from "react-i18next";
import { FlaskConical } from "lucide-react";

import PageShell from "../components/ui/PageShell";
import TripsCarousel from "../components/events/TripsCarousel";
import UpcomingEvents from "../components/events/UpcomingEvents";
import PastEvents from "../components/events/PastEvents";
import Container from "../components/ui/Container";
import { sampleDataEnabled } from "../lib/supabase";

/* Deliberately untranslated: this only ever renders in local development, and it
   has to be unmistakable that everything below it is invented, so nobody files a
   bug — or takes a screenshot — against events that do not exist. */
const SampleDataNotice = () => (
    <Container className="pt-8">
        <p className="flex items-center gap-2.5 rounded-2xl border border-signal/35 bg-signal/10 px-4 py-3 text-sm text-ink-2">
            <FlaskConical className="h-4 w-4 shrink-0 text-signal-ink" strokeWidth={2.5} />
            <span>
                <strong className="font-display font-bold text-ink">Sample data.</strong> Supabase is
                not configured, so these events and trips come from{" "}
                <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">
                    src/data/sampleEvents.js
                </code>
                . Set <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">VITE_SAMPLE_DATA=false</code>{" "}
                to turn them off.
            </span>
        </p>
    </Container>
);

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
            {sampleDataEnabled && <SampleDataNotice />}
            <TripsCarousel />
            <UpcomingEvents />
            <PastEvents />
        </PageShell>
    );
};

export default Events;
