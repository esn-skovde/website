import { ClipboardCheck, Home, Snowflake, Wallet } from "lucide-react";

import GuideSection from "./GuideSection";
import useSection from "./useSection";
import Reveal from "../ui/Reveal";
import InfoCard from "../ui/InfoCard";
import BulletList from "../ui/BulletList";

const SettlingInSection = () => {
    const { at, list } = useSection("settlingIn");

    /* Weather and budget each hold two sub-lists under one heading. */
    const pairs = [
        {
            key: "dealingWithSwedishWeather",
            icon: Snowflake,
            groups: [
                { label: "winterPreparation", items: "winterPreparationList" },
                { label: "yearRoundTips", items: "yearRoundTipsList" },
            ],
        },
        {
            key: "managingYourBudget",
            icon: Wallet,
            groups: [
                { label: "moneySavingTips", items: "moneySavingTipsList" },
                { label: "paymentMethods", items: "paymentMethodsList" },
            ],
        },
    ];

    return (
        <GuideSection sectionKey="settlingIn" title={at("title")} lead={at("description")}>
            <div className="grid gap-5 md:grid-cols-2">
                <Reveal>
                    <InfoCard icon={ClipboardCheck} title={at("firstWeekChecklist")}>
                        <BulletList items={list("firstWeekChecklistList")} />
                    </InfoCard>
                </Reveal>
                <Reveal delay={90}>
                    <InfoCard icon={Home} title={at("makingYourPlaceHome")}>
                        <BulletList items={list("makingYourPlaceHomeList")} />
                    </InfoCard>
                </Reveal>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
                {pairs.map(({ key, icon, groups }, index) => (
                    <Reveal key={key} delay={index * 90}>
                        <InfoCard icon={icon} title={at(`${key}.title`)}>
                            {groups.map(({ label, items }) => (
                                <div key={label} className="flex flex-col gap-3">
                                    <h4 className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                                        {at(`${key}.${label}`)}
                                    </h4>
                                    <BulletList items={list(`${key}.${items}`)} />
                                </div>
                            ))}
                        </InfoCard>
                    </Reveal>
                ))}
            </div>
        </GuideSection>
    );
};

export default SettlingInSection;
