import { AlertTriangle, GraduationCap, HeartHandshake, Sparkles, Users } from "lucide-react";

import GuideSection from "./GuideSection";
import useSection from "./useSection";
import Reveal from "../ui/Reveal";
import InfoCard from "../ui/InfoCard";
import Callout from "../ui/Callout";
import BulletList from "../ui/BulletList";

const GROUPS = [
    { key: "esn", icon: HeartHandshake },
    { key: "internationalCommunity", icon: Users },
];

/* The three contacts, in the order you should try them. */
const CONTACTS = [
    { key: "emergency", icon: AlertTriangle, urgent: true },
    { key: "university", icon: GraduationCap },
    { key: "esn", icon: HeartHandshake },
];

const BuddyProgramSection = () => {
    const { at, list } = useSection("buddyProgram");

    return (
        <GuideSection sectionKey="buddyProgram" title={at("sectionTitle")} lead={at("description")}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {GROUPS.map(({ key, icon }, index) => (
                    <Reveal key={key} delay={index * 90}>
                        <InfoCard icon={icon} title={at(`${key}.title`)}>
                            <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                                {at(`${key}.description`)}
                            </p>
                            <h4 className="mt-1 font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                                {at(`${key}.infoTitle`)}
                            </h4>
                            <BulletList items={list(`${key}.infoList`)} />
                        </InfoCard>
                    </Reveal>
                ))}
            </div>

            <Reveal delay={180} className="mt-6">
                <Callout title={at("whenYouNeedHelp.title")} icon={Users}>
                    <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                        {at("whenYouNeedHelp.description")}
                    </p>
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {CONTACTS.map(({ key, icon: Icon, urgent }) => (
                            <div
                                key={key}
                                className="flex items-center gap-3 rounded-2xl border border-hairline/[var(--hairline-opacity)] bg-surface px-4 py-3.5"
                            >
                                <Icon
                                    className={
                                        urgent
                                            ? "h-5 w-5 shrink-0 text-emergency-ink"
                                            : "h-5 w-5 shrink-0 text-signal-ink"
                                    }
                                    strokeWidth={2.3}
                                    aria-hidden="true"
                                />
                                {/* min-w-0 and overflow-wrap:anywhere, so a single long word
                                    ("Studentenunterstützung") wraps inside the tile instead of
                                    running out of it, past the screen at 640px. */}
                                <div className="min-w-0">
                                    <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                                        {at(`whenYouNeedHelp.${key}.title`)}
                                    </p>
                                    <p className="font-display font-bold text-ink [overflow-wrap:anywhere]">
                                        {at(`whenYouNeedHelp.${key}.description`)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Callout>
            </Reveal>

            <Reveal delay={240} className="mt-5">
                {/* The translated `description` here repeats whenYouNeedHelp's word for
                    word, so only the list runs — the same sentence twice on one screen
                    reads as a bug rather than as emphasis. */}
                <InfoCard icon={Sparkles} title={at("makingTheMostOfSupport.title")}>
                    <BulletList items={list("makingTheMostOfSupport.list")} columns={2} />
                </InfoCard>
            </Reveal>
        </GuideSection>
    );
};

export default BuddyProgramSection;
