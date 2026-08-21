import { useState } from "react";
import { useTranslation } from "react-i18next";
import { History, ChevronDown } from "lucide-react";

import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";
import { CardSkeleton } from "../ui/Skeleton";
import EventCard from "./EventCard";
import useSupabaseQuery from "../../hooks/useSupabaseQuery";
import { fetchPastEvents } from "../../lib/events";

const PAGE = 6;

const PastEvents = () => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(PAGE);

    const { data, loading, error, available } = useSupabaseQuery(
        (client) => fetchPastEvents(client, 24),
        []
    );

    const events = data ?? [];

    // Nothing to say about past events when the section can't load at all —
    // the upcoming section above already explains why.
    if (!loading && (!available || error)) return null;

    return (
        <Section
            id="past"
            eyebrow={t("events.archive", { defaultValue: "Archive" })}
            title={t("events.pastEvents")}
        >
            {loading && <CardSkeleton count={3} />}

            {!loading && events.length === 0 && (
                <EmptyState icon={History} title={t("events.noPastEvents")} />
            )}

            {events.length > 0 && (
                <>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {events.slice(0, visible).map((event, index) => (
                            <Reveal key={event.id} delay={Math.min(index, 5) * 70}>
                                <EventCard event={event} past />
                            </Reveal>
                        ))}
                    </div>

                    {visible < events.length && (
                        <div className="mt-10 flex justify-center">
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={() => setVisible((count) => count + PAGE)}
                            >
                                {t("events.showMore", { defaultValue: "Show more" })}
                                <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </Section>
    );
};

export default PastEvents;
