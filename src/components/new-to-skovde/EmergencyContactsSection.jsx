import { AlertTriangle, ExternalLink, GraduationCap, Info, Phone } from "lucide-react";

import GuideSection from "./GuideSection";
import useSection from "./useSection";
import Reveal from "../ui/Reveal";
import InfoCard from "../ui/InfoCard";
import Callout from "../ui/Callout";
import BulletList from "../ui/BulletList";

const UNIVERSITY_CONTACT = "https://www.his.se/en/contact/";

/* The digits are the same in every language, so they live here rather than in
   the translations. The short numbers only work from a Swedish SIM, which most
   readers do not have yet: `abroad` is what a foreign mobile has to dial
   instead (the numbers krisinformation.se, 1177.se and polisen.se give). */
const OTHER_NUMBERS = [
    { key: "healthcareInfo", number: "1177", abroad: "+46 771 11 77 00" },
    { key: "nonEmergencyPolice", number: "114 14", abroad: "+46 77 114 14 00" },
    { key: "housingIssues" },
];

const telHref = (number) => `tel:${number.replace(/\s/g, "")}`;

const EmergencyContactsSection = () => {
    const { at, list } = useSection("emergencyContacts");

    return (
        <GuideSection sectionKey="emergencyContacts" title={at("title")} lead={at("description")}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Reveal>
                    <Callout icon={AlertTriangle} tone="urgent" title={at("emergencyServices")}>
                        {/* The number is the point of this card, so it is the largest
                            thing in it and is dialable on a phone. */}
                        <a
                            href="tel:112"
                            className="flex items-baseline gap-3 text-display text-6xl text-esn-magenta transition-opacity hover:opacity-80"
                        >
                            112
                            <Phone className="h-6 w-6 self-center" strokeWidth={2.4} />
                        </a>
                        <p className="mt-2 font-display font-bold text-ink">
                            {at("emergencyServicesNumber")}
                        </p>
                        <p className="mt-1 text-[0.9375rem] text-ink-muted">
                            {at("emergencyServicesDescription")}
                        </p>

                        <h4 className="mt-6 font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                            {at("emergencyServicesWhenToCall")}
                        </h4>
                        <BulletList
                            className="mt-3"
                            items={list("emergencyServicesWhenToCallList")}
                            icon={AlertTriangle}
                            iconClassName="text-esn-magenta"
                        />
                    </Callout>
                </Reveal>

                <Reveal delay={90} className="flex flex-col gap-5">
                    <InfoCard icon={GraduationCap} title={at("universitySupport")}>
                        <p className="font-display font-bold text-ink">{at("universityName")}</p>
                        <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                            {at("universitySupportDescription")}
                        </p>
                        <a
                            href={UNIVERSITY_CONTACT}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-display text-[0.9375rem] font-bold text-signal-ink hover:underline"
                        >
                            his.se/en/contact
                            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.4} />
                        </a>
                    </InfoCard>

                    <InfoCard icon={Phone} title={at("otherImportantNumbers")}>
                        <dl className="flex flex-col gap-3">
                            {OTHER_NUMBERS.map(({ key, number, abroad }) => (
                                <div key={key}>
                                    <dt className="font-display text-[0.9375rem] font-bold text-ink">
                                        {at(key)}
                                    </dt>
                                    <dd className="text-[0.9375rem] text-ink-muted">
                                        {number && (
                                            <>
                                                <a
                                                    href={telHref(number)}
                                                    className="whitespace-nowrap font-display font-bold text-signal-ink hover:underline"
                                                >
                                                    {number}
                                                </a>{" "}
                                            </>
                                        )}
                                        {at(`${key}Description`)}
                                        {abroad && (
                                            <span className="mt-1 block text-[0.875rem]">
                                                {at("foreignMobile")}{" "}
                                                <a
                                                    href={telHref(abroad)}
                                                    className="whitespace-nowrap font-display font-bold text-signal-ink hover:underline"
                                                >
                                                    {abroad}
                                                </a>
                                            </span>
                                        )}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </InfoCard>
                </Reveal>
            </div>

            <Reveal delay={180} className="mt-6">
                <Callout icon={Info} title={at("importantNotes")}>
                    <BulletList items={list("importantNotesList")} columns={2} />
                </Callout>
            </Reveal>
        </GuideSection>
    );
};

export default EmergencyContactsSection;
