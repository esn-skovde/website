import { Bus, Train, Ticket, CalendarRange, Clock, Lightbulb } from "lucide-react";

import GuideSection from "./GuideSection";
import useSection from "./useSection";
import Reveal from "../ui/Reveal";
import InfoCard from "../ui/InfoCard";
import Callout from "../ui/Callout";
import BulletList from "../ui/BulletList";

/* Västtrafik and SJ have the same shape but different key names for their
   student perk, so the differing key is part of the descriptor. */
const OPERATORS = [
    { key: "regional", icon: Bus, perkLabel: "studentBenefits", perkBody: "studentDiscount" },
    { key: "national", icon: Train, perkLabel: "studentDeal", perkBody: "studentDealDescription" },
];

const TICKETS = [
    { key: "singleTickets", icon: Ticket },
    { key: "dayPasses", icon: Clock },
    { key: "periodTickets", icon: CalendarRange },
];

const Detail = ({ label, children }) => (
    <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
        <span className="font-display font-bold text-ink">{label}: </span>
        {children}
    </p>
);

const TransportSection = () => {
    const { at, list } = useSection("transport");

    return (
        <GuideSection sectionKey="transport" title={at("title")} lead={at("description")}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {OPERATORS.map(({ key, icon, perkLabel, perkBody }, index) => (
                    <Reveal key={key} delay={index * 90}>
                        <InfoCard icon={icon} title={at(`${key}.title`)}>
                            <Detail label={at(`${key}.coverage`)}>
                                {at(`${key}.coverageDescription`)}
                            </Detail>
                            <Detail label={at(`${key}.app`)}>{at(`${key}.appDescription`)}</Detail>
                            <Detail label={at(`${key}.${perkLabel}`)}>
                                {at(`${key}.${perkBody}`)}
                            </Detail>
                        </InfoCard>
                    </Reveal>
                ))}
            </div>

            <Reveal delay={180} className="mt-10">
                <h3 className="text-display text-xl text-ink">{at("ticketOptions")}</h3>
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {TICKETS.map(({ key, icon }) => (
                        <InfoCard key={key} icon={icon} title={at(key)}>
                            <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                                {at(`${key}Description`)}
                            </p>
                        </InfoCard>
                    ))}
                </div>
            </Reveal>

            <Reveal delay={240} className="mt-6">
                <Callout icon={Lightbulb} title={at("tips")}>
                    <BulletList items={list("tipsList")} columns={2} />
                </Callout>
            </Reveal>
        </GuideSection>
    );
};

export default TransportSection;
