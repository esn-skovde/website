import { BookOpen, Building, Scale, Sparkles, Users } from "lucide-react";

import GuideSection from "./GuideSection";
import useSection from "./useSection";
import Reveal from "../ui/Reveal";
import InfoCard from "../ui/InfoCard";
import Callout from "../ui/Callout";
import BulletList from "../ui/BulletList";

const COLUMNS = [
    { key: "academicSuccess", icon: BookOpen },
    { key: "campusResources", icon: Building },
];

const ORG_LISTS = ["benefitsOfJoining", "typesAvailable"];
const BALANCE_LISTS = ["academicBalance", "personalWellbeing"];

const StudentLifeSection = () => {
    const { at, list } = useSection("studentLife");

    return (
        <GuideSection sectionKey="studentLife" title={at("sectionTitle")} lead={at("description")}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {COLUMNS.map(({ key, icon }, index) => (
                    <Reveal key={key} delay={index * 90}>
                        <InfoCard icon={icon} title={at(`${key}.title`)}>
                            <BulletList items={list(`${key}.tipsList`)} />
                        </InfoCard>
                    </Reveal>
                ))}
            </div>

            <Reveal delay={150} className="mt-5">
                <InfoCard icon={Users} title={at("studentOrganizations.title")}>
                    <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                        {at("studentOrganizations.description")}
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                        {ORG_LISTS.map((key) => (
                            <div key={key}>
                                <h4 className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                                    {at(`studentOrganizations.${key}`)}
                                </h4>
                                <BulletList
                                    className="mt-3"
                                    items={list(`studentOrganizations.${key}List`)}
                                />
                            </div>
                        ))}
                    </div>
                </InfoCard>
            </Reveal>

            <Reveal delay={210} className="mt-5">
                <InfoCard
                    icon={Scale}
                    title={at("studentOrganizations.workLifeBalance.title")}
                >
                    <div className="grid gap-5 sm:grid-cols-2">
                        {BALANCE_LISTS.map((key) => (
                            <div key={key}>
                                <h4 className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                                    {at(`studentOrganizations.workLifeBalance.${key}`)}
                                </h4>
                                <BulletList
                                    className="mt-3"
                                    items={list(`studentOrganizations.workLifeBalance.${key}List`)}
                                />
                            </div>
                        ))}
                    </div>
                </InfoCard>
            </Reveal>

            {/* Last block on the page, so it closes the guide rather than opening
                another topic — the send-off, not another reference table. */}
            <Reveal delay={260} className="mt-6">
                <Callout icon={Sparkles} title={at("successTips.title")}>
                    <BulletList items={list("successTips.tipsList")} columns={2} />
                </Callout>
            </Reveal>
        </GuideSection>
    );
};

export default StudentLifeSection;
