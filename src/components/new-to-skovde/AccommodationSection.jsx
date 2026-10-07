import {
    Building2,
    ExternalLink,
    GraduationCap,
    Globe,
    LifeBuoy,
    Lightbulb,
    Users,
} from "lucide-react";

import GuideSection from "./GuideSection";
import useSection from "./useSection";
import Reveal from "../ui/Reveal";
import InfoCard from "../ui/InfoCard";
import Callout from "../ui/Callout";
import BulletList from "../ui/BulletList";

const HOUSING_EMAIL = "studenthousing@his.se";

/* Where the guide sends readers, as the sites' own English pages (like the
   his.se contact link in the emergency contacts). */
const SKOVDEBOSTADER_URL = "https://www.skovdebostader.se/en/student/";
const UNIVERSITY_HOUSING_URL =
    "https://www.his.se/en/education/practical-information/accommodation/";
const BOSTADSZONEN_URL = "https://bostadszonen.se/";

/* The domain is the link text, as on the guide's other outside links. */
const SiteLink = ({ href, children }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 self-start font-display text-[0.9375rem] font-bold text-signal-ink hover:underline"
    >
        {children}
        <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.4} />
    </a>
);

const FACEBOOK_GROUPS = ["Internationals in Skövde", "Studenter vid Högskolan i Skövde"];

const AccommodationSection = () => {
    const { at, list } = useSection("accommodation");

    return (
        <GuideSection sectionKey="accommodation" title={at("sectionTitle")} lead={at("description")}>
            {/* Skövdebostäder is where nearly everyone ends up, so it gets the full
                width and the numbered steps rather than sitting in a grid of equals. */}
            <Reveal>
                <InfoCard icon={Building2} title={at("skovdebostader.title")}>
                    <h4 className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                        {at("skovdebostader.howItWorks")}
                    </h4>
                    <ol className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-x-8">
                        {list("skovdebostader.howItWorksList").map((step, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink-muted"
                            >
                                <span
                                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-signal/[0.14] font-display text-[0.75rem] font-bold text-signal-ink"
                                    aria-hidden="true"
                                >
                                    {index + 1}
                                </span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-3 grid gap-5 border-t border-hairline/[var(--hairline-opacity)] pt-5 sm:grid-cols-2">
                        {["pointSystem", "newListings"].map((key) => (
                            <div key={key}>
                                <h4 className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                                    {at(`skovdebostader.${key}`)}
                                </h4>
                                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                                    {at(`skovdebostader.${key}Description`)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <SiteLink href={SKOVDEBOSTADER_URL}>skovdebostader.se</SiteLink>
                </InfoCard>
            </Reveal>

            <h3 className="mt-8 text-display text-xl text-ink">
                {at("alternativeOptions.title")}
            </h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
                <Reveal>
                    <InfoCard
                        icon={GraduationCap}
                        title={at("alternativeOptions.universityAccommodation")}
                    >
                        <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                            {at("alternativeOptions.universityAccommodationDescription")}
                        </p>
                        <p className="text-[0.8125rem] text-ink-faint">
                            {at("alternativeOptions.universityAccommodationContact")}
                        </p>
                        <SiteLink href={UNIVERSITY_HOUSING_URL}>his.se</SiteLink>
                    </InfoCard>
                </Reveal>
                <Reveal delay={90}>
                    {/* BostadsZonen has no translated title — it is a brand name. */}
                    <InfoCard icon={Globe} title="BostadsZonen">
                        <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                            {at("alternativeOptions.bostadsZonenDescription")}
                        </p>
                        <p className="text-[0.8125rem] text-ink-faint">
                            {at("alternativeOptions.bostadsZonenContact")}
                        </p>
                        <SiteLink href={BOSTADSZONEN_URL}>bostadszonen.se</SiteLink>
                    </InfoCard>
                </Reveal>
            </div>

            <Reveal delay={150} className="mt-5">
                <InfoCard icon={Users} title={at("socialOptions.title")}>
                    <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                        {at("socialOptions.description")}
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <h4 className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                                {at("socialOptions.bestFacebookGroups")}
                            </h4>
                            <BulletList className="mt-3" items={FACEBOOK_GROUPS} />
                        </div>
                        <div>
                            <h4 className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                                {at("socialOptions.tipsForFacebook")}
                            </h4>
                            <BulletList className="mt-3" items={list("socialOptions.tipsForFacebookList")} />
                        </div>
                    </div>
                </InfoCard>
            </Reveal>

            <Reveal delay={210} className="mt-5">
                <Callout icon={LifeBuoy} tone="urgent" title={at("emergencyContact.title")}>
                    <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                        {at("emergencyContact.description")}
                    </p>
                    {/* The urgent callout is magenta on every page, so the address
                        takes magenta's themed ink: the raw brand hue is 3.4:1 on the
                        callout's tint, and never lifts for the dark theme. */}
                    <a
                        href={`mailto:${HOUSING_EMAIL}`}
                        className="signal-magenta mt-3 inline-block font-display text-lg font-bold text-signal-ink hover:underline"
                    >
                        {HOUSING_EMAIL}
                    </a>
                    <p className="mt-1 text-[0.8125rem] text-ink-faint">
                        {at("emergencyContact.contactDescription")}
                    </p>
                </Callout>
            </Reveal>

            <Reveal delay={260} className="mt-5">
                <InfoCard icon={Lightbulb} title={at("housingSearchTips.title")}>
                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-x-8">
                        <BulletList items={list("housingSearchTips.tipsListOne")} />
                        <BulletList items={list("housingSearchTips.tipsListTwo")} />
                    </div>
                </InfoCard>
            </Reveal>
        </GuideSection>
    );
};

export default AccommodationSection;
