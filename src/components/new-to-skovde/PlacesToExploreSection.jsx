import { Compass, Mountain, Trees, Trophy } from "lucide-react";

import GuideSection from "./GuideSection";
import useSection from "./useSection";
import Reveal from "../ui/Reveal";
import InfoCard from "../ui/InfoCard";
import Callout from "../ui/Callout";
import BulletList from "../ui/BulletList";

/* One for each place, in the order the translations list them: Billingen,
   Arena Skövde, Silverfallet. By index, since the names change with the language. */
const PLACE_ICONS = [Mountain, Trophy, Trees];

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
