import { useTranslation } from "react-i18next";
import { Instagram, Linkedin, Mail } from "lucide-react";

import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import Img from "../ui/Img";
import useLang from "../../hooks/useLang";
import { imageKey } from "../../lib/images";
import { countryName, languageList, monthYear } from "../../lib/boardFacts";

const CARD_SIZES =
    "(min-width: 1280px) 288px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw";

/** Only the three we actually store, in a fixed order so cards line up. */
const links = (member, t) =>
    [
        member.email && {
            key: "email",
            href: `mailto:${member.email}`,
            icon: Mail,
            label: t("boardMembers.emailLabel", { name: member.name }),
        },
        member.social?.instagram && {
            key: "instagram",
            href: `https://instagram.com/${member.social.instagram}`,
            icon: Instagram,
            label: t("boardMembers.instagramLabel", { name: member.name }),
            external: true,
        },
        member.social?.linkedin && {
            key: "linkedin",
            href: `https://www.linkedin.com/in/${member.social.linkedin}`,
            icon: Linkedin,
            label: t("boardMembers.linkedinLabel", { name: member.name }),
            external: true,
        },
    ].filter(Boolean);

const BoardGrid = ({ members }) => {
    const { t } = useTranslation();
    const { lang } = useLang();

    const facts = (member) =>
        [
            {
                label: t("boardMembers.languages", { defaultValue: "Languages" }),
                value: languageList(member.languages, lang),
            },
            {
                label: t("boardMembers.studies", { defaultValue: "Studies" }),
                value: member.studies,
            },
            {
                label: t("boardMembers.joined", { defaultValue: "Joined ESN" }),
                value: monthYear(member.esn_join_date, lang),
            },
        ].filter((fact) => fact.value);

    return (
        <Section title={t("boardMembers.title")}>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {members.map((member, index) => (
                    <Reveal
                        as="li"
                        key={member.id}
                        /* Staggered by column, not by index: a 12-card stagger would
                           leave the last card waiting most of a second. */
                        delay={(index % 4) * 70}
                        className="group panel flex flex-col overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1"
                    >
                        <div className="relative">
                            <Img
                                name={imageKey(member.image, "board")}
                                fallbackName="board/profile_fallback"
                                alt={member.name}
                                ratio="3 / 4"
                                sizes={CARD_SIZES}
                                /* Portraits vary from 3:4 to 9:16 to one very tall
                                   frame; biasing the crop above centre keeps every
                                   face in the box without cutting foreheads. */
                                objectPosition="center 30%"
                                imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                            {member.flag && (
                                <span
                                    className="absolute right-3 top-3 grid h-9 min-w-9 place-items-center rounded-full bg-black/45 px-2 text-lg backdrop-blur-sm"
                                    title={countryName(member.country, lang)}
                                >
                                    <span aria-hidden="true">{member.flag}</span>
                                    <span className="sr-only">{countryName(member.country, lang)}</span>
                                </span>
                            )}
                        </div>

                        <div className="flex flex-1 flex-col gap-4 p-5">
                            <div>
                                <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.14em] text-signal-ink">
                                    {member.role}
                                </p>
                                <h3 className="mt-1.5 text-display text-lg leading-tight text-ink">
                                    {member.name}
                                </h3>
                            </div>

                            <dl className="flex flex-1 flex-col gap-2 text-[0.8125rem] leading-snug">
                                {facts(member).map(({ label, value }) => (
                                    <div key={label} className="flex gap-2">
                                        <dt className="shrink-0 font-display font-bold text-ink-faint">
                                            {label}
                                        </dt>
                                        <dd className="text-ink-muted">{value}</dd>
                                    </div>
                                ))}
                            </dl>

                            <div className="flex gap-1.5 border-t border-hairline/[var(--hairline-opacity)] pt-4">
                                {links(member, t).map(({ key, href, icon: Icon, label, external }) => (
                                    <a
                                        key={key}
                                        href={href}
                                        aria-label={label}
                                        target={external ? "_blank" : undefined}
                                        rel={external ? "noopener noreferrer" : undefined}
                                        className="grid h-9 w-9 place-items-center rounded-full text-ink-faint transition-colors hover:bg-signal/10 hover:text-signal-ink"
                                    >
                                        <Icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                ))}
            </ul>
        </Section>
    );
};

export default BoardGrid;
