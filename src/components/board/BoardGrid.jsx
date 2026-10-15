import { useTranslation } from "react-i18next";
import { CalendarDays, GraduationCap, Instagram, Languages, Linkedin, Mail } from "lucide-react";

import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import Img from "../ui/Img";
import useLang from "../../hooks/useLang";
import { imageKey } from "../../lib/images";
import { countryName, languageNames, monthYear } from "../../lib/boardFacts";

/* On a phone the photo is the left 36% of a one-column card, so it is small:
   the srcset should not fetch a full-width image for it. */
const CARD_SIZES =
    "(min-width: 1280px) 288px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 40vw";

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

/* A fact is its icon and its value on one line. The icon says what the line is,
   so there is no visible label to spend a row on; the label stays for screen
   readers, which have no icon. A fact whose words are part of the line (the
   date someone joined) shows them as `lead`, hidden from screen readers
   because the label already says it. */
const Fact = ({ icon: Icon, label, lead, children }) => (
    <div>
        <dt className="sr-only">{label}</dt>
        <dd className="flex items-start gap-2.5 text-[0.875rem] leading-snug text-ink-muted">
            <Icon className="mt-[0.1875rem] h-4 w-4 shrink-0 text-signal-ink" strokeWidth={2.2} aria-hidden="true" />
            <span className="min-w-0">
                {lead && <span aria-hidden="true">{lead} · </span>}
                {children}
            </span>
        </dd>
    </div>
);

/* One card, two shapes. On a phone it is a profile row, the portrait beside the
   name, so eleven cards are a few screens and not a dozen. From `sm` up the
   portrait goes on top and the card is a column, as the grid wants. The same
   elements serve both; only the direction and the widths change. */
const MemberCard = ({ member, index, lang }) => {
    const { t } = useTranslation();

    const languages = languageNames(member.languages, lang);
    const joined = monthYear(member.esn_join_date, lang);
    const contacts = links(member, t);
    // The label is a phrase in every language ("Joined ESN", "Bei ESN seit").
    const joinedLabel = t("boardMembers.joined", { defaultValue: "Joined ESN" });

    return (
        <Reveal
            as="li"
            /* Staggered by column, not by index: a 12-card stagger would
               leave the last card waiting most of a second. */
            delay={(index % 4) * 70}
            className="group panel flex flex-col overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1"
        >
            <div className="flex sm:flex-col">
                <div className="relative w-[36%] shrink-0 sm:w-full">
                    <Img
                        name={imageKey(member.image, "board")}
                        fallbackName="board/profile_fallback"
                        alt={member.name}
                        ratio="3 / 4"
                        sizes={CARD_SIZES}
                        /* h-full: beside the text the photo is as tall as the row,
                           and when the text is taller than a 3:4 portrait the photo
                           fills the extra height rather than leaving a gap. w-full
                           is what stops that height from deciding the width too:
                           an aspect ratio with a definite height and an auto width
                           widens the box, over the text beside it. */
                        className="h-full w-full"
                        /* Portraits vary from 3:4 to 9:16 to one very tall
                           frame; biasing the crop above centre keeps every
                           face in the box without cutting foreheads. */
                        objectPosition="center 30%"
                        imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    {member.flag && (
                        <span
                            className="absolute right-2 top-2 grid h-7 min-w-7 place-items-center rounded-full bg-black/45 px-1.5 text-sm backdrop-blur-sm sm:right-3 sm:top-3 sm:h-9 sm:min-w-9 sm:px-2 sm:text-lg"
                            title={countryName(member.country, lang)}
                        >
                            <span aria-hidden="true">{member.flag}</span>
                            <span className="sr-only">{countryName(member.country, lang)}</span>
                        </span>
                    )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-3.5 min-[400px]:p-4 sm:justify-start sm:p-5 sm:pb-0">
                    <div>
                        <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.14em] text-signal-ink">
                            {member.role}
                        </p>
                        <h3 className="mt-1 text-display text-lg leading-tight text-ink text-balance">
                            {member.name}
                        </h3>
                    </div>

                    {(member.studies || joined) && (
                        <dl className="flex flex-col gap-2">
                            {member.studies && (
                                <Fact
                                    icon={GraduationCap}
                                    label={t("boardMembers.studies", { defaultValue: "Studies" })}
                                >
                                    {member.studies.trim()}
                                </Fact>
                            )}
                            {joined && (
                                <Fact icon={CalendarDays} label={joinedLabel} lead={joinedLabel}>
                                    {joined}
                                </Fact>
                            )}
                        </dl>
                    )}
                </div>
            </div>

            {/* flex-1 takes the card's spare height, so in a row of cards of
                different heights every contact bar ends on the same line. */}
            <div className="flex-1 px-4 pb-4 pt-3 sm:px-5">
                {languages.length > 0 && (
                    <dl>
                        <Fact
                            icon={Languages}
                            label={t("boardMembers.languages", { defaultValue: "Languages" })}
                        >
                            <ul className="flex flex-wrap gap-1.5">
                                {languages.map((language) => (
                                    <li
                                        key={language}
                                        className="rounded-full border border-hairline/[var(--hairline-opacity)] bg-surface-2 px-2.5 py-0.5 text-[0.8125rem] leading-snug text-ink"
                                    >
                                        {language}
                                    </li>
                                ))}
                            </ul>
                        </Fact>
                    </dl>
                )}
            </div>

            {/* The ways to reach them are one bar across the foot of the card, each
                a full-height tap target: three small circles in a row were easy to
                miss and easy to mistap. The ring is drawn inside the cell because
                the card clips what overflows it. */}
            {contacts.length > 0 && (
                <div className="flex divide-x divide-hairline/[var(--hairline-opacity)] border-t border-hairline/[var(--hairline-opacity)]">
                    {contacts.map(({ key, href, icon: Icon, label, external }) => (
                        <a
                            key={key}
                            href={href}
                            aria-label={label}
                            title={label}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            className="grid h-11 flex-1 place-items-center text-ink-muted transition-colors hover:bg-signal/10 hover:text-signal-ink focus-visible:-outline-offset-2"
                        >
                            <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
                        </a>
                    ))}
                </div>
            )}
        </Reveal>
    );
};

const BoardGrid = ({ members }) => {
    const { t } = useTranslation();
    const { lang } = useLang();

    return (
        <Section title={t("boardMembers.title")}>
            <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {members.map((member, index) => (
                    <MemberCard key={member.id} member={member} index={index} lang={lang} />
                ))}
            </ul>
        </Section>
    );
};

export default BoardGrid;
