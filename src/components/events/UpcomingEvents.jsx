import { useTranslation } from "react-i18next";
import { CalendarX2, AlertTriangle, DatabaseZap } from "lucide-react";

import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import EmptyState from "../ui/EmptyState";
import { CardSkeleton } from "../ui/Skeleton";
import EventCard from "./EventCard";
import useSupabaseQuery from "../../hooks/useSupabaseQuery";
import { fetchUpcomingEvents } from "../../lib/events";

const UpcomingEvents = ({ limit = 24 }) => {
    const { t } = useTranslation();
    const { data, loading, error, available } = useSupabaseQuery(
        (client) => fetchUpcomingEvents(client, limit),
        [limit]
    );

    const events = data ?? [];

    return (
        <Section
            id="upcoming"
            eyebrow={t("events.whatsOn", { defaultValue: "What's on" })}
            title={t("events.upcomingEvents")}
        >
            {loading && <CardSkeleton count={3} />}

            {!loading && !available && (
                <EmptyState
                    icon={DatabaseZap}
                    title={t("events.notConnected", { defaultValue: "Events aren't connected" })}
                    description={t("events.notConnectedHint", {
                        defaultValue:
                            "This build has no Supabase credentials, so there is nothing to list. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to see live events.",
                    })}
                />
            )}

            {!loading && available && error && (
                <EmptyState
                    icon={AlertTriangle}
                    title={t("common.error")}
                    description={t("events.carousel.errorMessage")}
                />
            )}

            {!loading && available && !error && events.length === 0 && (
                <EmptyState
                    icon={CalendarX2}
                    title={t("events.noUpcomingEvents")}
                    description={t("events.carousel.checkBackLater")}
                />
            )}

            {events.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event, index) => (
                        <Reveal key={event.id} delay={Math.min(index, 5) * 70}>
                            <EventCard event={event} />
                        </Reveal>
                    ))}
                </div>
            )}
        </Section>
    );
};

export default UpcomingEvents;
