import { ListChecks, Lightbulb } from "lucide-react";

import GuideSection from "./GuideSection";
import useSection from "./useSection";
import Reveal from "../ui/Reveal";
import InfoCard from "../ui/InfoCard";
import BulletList from "../ui/BulletList";

const GettingStartedSection = () => {
    const { at, list } = useSection("gettingStarted");

    return (
        <GuideSection sectionKey="gettingStarted" title={at("title")} lead={at("description")}>
            <div className="grid gap-5 md:grid-cols-2">
                <Reveal>
                    <InfoCard icon={ListChecks} title={at("essentialFirstSteps")}>
                        <BulletList items={list("essentialFirstStepsList")} />
                    </InfoCard>
                </Reveal>
                <Reveal delay={90}>
                    <InfoCard icon={Lightbulb} title={at("proTips")}>
                        <BulletList items={list("proTipsList")} />
                    </InfoCard>
                </Reveal>
            </div>
        </GuideSection>
    );
};

export default GettingStartedSection;
