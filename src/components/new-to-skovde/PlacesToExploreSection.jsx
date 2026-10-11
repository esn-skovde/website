import { Compass, ExternalLink, Mountain, Navigation, Trees, Trophy } from "lucide-react";

import GuideSection from "./GuideSection";
import useSection from "./useSection";
import Reveal from "../ui/Reveal";
import Button from "../ui/Button";
import InfoCard from "../ui/InfoCard";
import Callout from "../ui/Callout";
import BulletList from "../ui/BulletList";

/* One for each place, in the order the translations list them: Billingen,
   Arena Skövde, Silverfallet. By index, since the names change with the language. */
const PLACE_ICONS = [Mountain, Trophy, Trees];

/* What each place is looked up as in a maps app, by the same index. Fixed text,
   the same in every language, because the translated names are not what a map
   knows the place by. There are no coordinates on purpose: a search finds the
   place the map itself has, and a wrong coordinate would send a student to the
   wrong spot with nobody here able to check it. */
const DIRECTIONS_QUERY = [
    "Billingen, Skövde, Sweden",
    "Arena Skövde, Skövde, Sweden",
    "Silverfallet naturreservat, Skövde, Sweden",
];

/* Both are universal links: a phone opens its maps app, anything else a web
   map. No travel mode, so the app asks how the student is going. The order is
   fixed, not picked from the user agent, which the prerendered page cannot see. */
const MAP_APPS = [
    { app: "Google Maps", href: (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}` },
    { app: "Apple Maps", href: (q) => `https://maps.apple.com/?daddr=${encodeURIComponent(q)}` },
];

const PlacesToExploreSection = () => {
    const { at, list } = useSection("placesToExplore");
    const places = list("places");

    return (
        <GuideSection sectionKey="placesToExplore" title={at("title")} lead={at("description")}>
            <div className="grid gap-5 md:grid-cols-3">
                {places.map((place, index) => (
                    <Reveal key={place.name} delay={index * 90}>
                        <InfoCard icon={PLACE_ICONS[index]} title={place.name}>
                            <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                                {place.description}
                            </p>
                            {Array.isArray(place.activities) && (
                                <ul className="mt-1 flex flex-wrap gap-2">
                                    {place.activities.map((activity) => (
                                        <li
                                            key={activity}
                                            className="rounded-full border border-signal/30 bg-signal/[0.08] px-3 py-1 text-xs font-medium text-signal-ink"
                                        >
                                            {activity}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {DIRECTIONS_QUERY[index] && (
                                <div
                                    role="group"
                                    aria-label={at("directionsGroup", { place: place.name })}
                                    className="mt-auto flex flex-col gap-2.5 border-t border-hairline/[var(--hairline-opacity)] pt-4"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="font-display text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint"
                                    >
                                        {at("directions")}
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {MAP_APPS.map(({ app, href }) => (
                                            <Button
                                                key={app}
                                                href={href(DIRECTIONS_QUERY[index])}
                                                variant="outline"
                                                size="sm"
                                                aria-label={at("directionsLink", { place: place.name, app })}
                                            >
                                                <Navigation className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
                                                {app}
                                                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </InfoCard>
                    </Reveal>
                ))}
            </div>

            <Reveal delay={200} className="mt-6">
                <Callout icon={Compass} title={at("explorationTips")}>
                    <BulletList items={list("explorationTipsList")} columns={2} />
                </Callout>
            </Reveal>
        </GuideSection>
    );
};

export default PlacesToExploreSection;
