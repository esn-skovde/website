import { Landmark, Trees, Users, Sparkles } from "lucide-react";

import GuideSection from "./GuideSection";
import useSection from "./useSection";
import Reveal from "../ui/Reveal";
import InfoCard from "../ui/InfoCard";
import Callout from "../ui/Callout";
import BulletList from "../ui/BulletList";

const HIGHLIGHTS = [
    { key: "richHeritage", icon: Landmark },
    { key: "naturalBeauty", icon: Trees },
    { key: "studentLife", icon: Users },
];

const CityHighlightsSection = () => {
    const { at, list } = useSection("cityHighlights");

    return (
        <GuideSection sectionKey="cityHighlights" title={at("title")} lead={at("description")}>
            <div className="grid gap-5 md:grid-cols-3">
                {HIGHLIGHTS.map(({ key, icon }, index) => (
                    <Reveal key={key} delay={index * 90}>
                        <InfoCard icon={icon} title={at(key)}>
                            <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                                {at(`${key}Description`)}
                            </p>
                        </InfoCard>
                    </Reveal>
                ))}
            </div>

            <Reveal delay={200} className="mt-6">
                <Callout icon={Sparkles} title={at("whatMakesSkovdeSpecial")}>
                    <BulletList items={list("whatMakesSkovdeSpecialList")} columns={2} />
                </Callout>
            </Reveal>
        </GuideSection>
    );
};

export default CityHighlightsSection;
