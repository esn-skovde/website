import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import Button from "../ui/Button";
import { CardSkeleton } from "../ui/Skeleton";
import EventCard from "../events/EventCard";
import SampleDataNotice from "../events/SampleDataNotice";
import useSupabaseQuery from "../../hooks/useSupabaseQuery";
import { fetchUpcomingEvents } from "../../lib/events";
import { sampleDataEnabled } from "../../lib/supabase";
import useLang from "../../hooks/useLang";

/**
 * The next few events, on the homepage.
 *
 * Renders nothing at all when there is nothing to show — the homepage should
 * never carry an empty "no events" box as its main content. While the events
 * load it holds their place with skeletons: rendering nothing then collapsed
 * the prerendered section on every cold load, and pulled everything below it
 * up the page.
 */
const NextUp = () => {
    const { t } = useTranslation();
    const { path } = useLang();
    const { data, loading, available } = useSupabaseQuery((client) => fetchUpcomingEvents(client, 3), []);

    const events = data ?? [];
    if (!available || (!loading && events.length === 0)) return null;

    return (
        <div className="signal-magenta border-y border-hairline/[var(--hairline-opacity)] bg-surface-2/60">
            <Section
                eyebrow={t("events.whatsOn", { defaultValue: "What's on" })}
                title={t("events.upcomingEvents")}
            >
                {/* These cards are the homepage's main content, so the notice
                    belongs here too — not only on the Events page. */}
                {sampleDataEnabled && <SampleDataNotice className="mb-7" />}

                {loading ? (
                    <CardSkeleton count={3} />
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event, index) => (
                            <Reveal key={event.id} delay={index * 80}>
                                <EventCard event={event} />
                            </Reveal>
                        ))}
                    </div>
                )}

                <div className="mt-10 flex justify-center">
                    <Button to={path("events")} variant="secondary" size="lg">
                        {t("home.splitSection.events.button")}
                        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                    </Button>
                </div>
            </Section>
        </div>
    );
};

export default NextUp;
