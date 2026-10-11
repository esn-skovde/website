import { Bus, CreditCard, Instagram, Lightbulb, Smartphone, TrainFront, Users } from "lucide-react";

import GuideSection from "./GuideSection";
import useSection from "./useSection";
import Reveal from "../ui/Reveal";
import InfoCard from "../ui/InfoCard";
import Callout from "../ui/Callout";
import BulletList from "../ui/BulletList";

const FACEBOOK_GROUPS = [
    "Internationals in Skövde",
    "Studenter vid Högskolan i Skövde",
    "Köp och Sälj Skövde",
];

const INSTAGRAM = [
    {
        label: "studentUnionAccounts",
        handles: ["hifsskovde", "vitae.sis", "histek", "skovdesexmasteri"],
    },
    { label: "universityAccounts", handles: ["hogskolaniskovde", "uniofskovde"] },
];

/* The three apps you will actually install in your first week. */
const APPS = [
    { name: "Västtrafik", icon: Bus, key: "regionalPublicTransport" },
    { name: "SJ", icon: TrainFront, key: "nationalTrainTickets" },
    { name: "Swish", icon: CreditCard, key: "mobilePaymentSystem" },
];

const UsefulAppsSection = () => {
    const { at, list } = useSection("usefulApps");

    return (
        <GuideSection sectionKey="usefulApps" title={at("sectionTitle")} lead={at("description")}>
            <div className="grid gap-5 md:grid-cols-2">
                <Reveal>
                    <InfoCard icon={Users} title={at("facebookGroups")}>
                        <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                            {at("facebookGroupsDescription")}
                        </p>
                        <ul className="flex flex-col gap-2">
                            {FACEBOOK_GROUPS.map((group) => (
                                <li
                                    key={group}
                                    className="rounded-xl border border-hairline/[var(--hairline-opacity)] bg-surface-2 px-4 py-2.5 font-display text-[0.9375rem] font-bold text-ink"
                                >
                                    {group}
                                </li>
                            ))}
                        </ul>
                        <p className="text-[0.8125rem] text-ink-faint">{at("facebookGroupsTips")}</p>
                    </InfoCard>
                </Reveal>

                <Reveal delay={90}>
                    <InfoCard icon={Instagram} title={at("instagramAccounts")}>
                        {INSTAGRAM.map(({ label, handles }) => (
                            <div key={label} className="flex flex-col gap-2.5">
                                <h4 className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                                    {at(label)}
                                </h4>
                                <ul className="flex flex-wrap gap-2">
                                    {handles.map((handle) => (
                                        <li key={handle}>
                                            <a
                                                href={`https://www.instagram.com/${handle}/`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex rounded-full border border-signal/30 bg-signal/[0.08] px-3 py-1.5 font-display text-[0.8125rem] font-bold text-signal-ink transition-colors hover:bg-signal/[0.16]"
                                            >
                                                @{handle}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <p className="text-[0.8125rem] text-ink-faint">
                            {at("instagramAccountsTips")}
                        </p>
                    </InfoCard>
                </Reveal>
            </div>

            <Reveal delay={150} className="mt-8">
                <h3 className="flex items-center gap-2.5 text-display text-xl text-ink">
                    <Smartphone className="h-5 w-5 text-signal-ink" strokeWidth={2.4} aria-hidden="true" />
                    {at("essentialApps")}
                </h3>
            </Reveal>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {APPS.map(({ name, icon, key }, index) => (
                    <Reveal key={name} delay={index * 80}>
                        <InfoCard icon={icon} title={name}>
                            <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                                {at(key)}
                            </p>
                        </InfoCard>
                    </Reveal>
                ))}
            </div>

            <Reveal delay={220} className="mt-6">
                <Callout icon={Lightbulb} title={at("socialMediaTips")}>
                    <BulletList items={list("socialMediaTipsList")} columns={2} />
                </Callout>
            </Reveal>
        </GuideSection>
    );
};

export default UsefulAppsSection;
