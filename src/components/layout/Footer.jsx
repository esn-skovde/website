import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Instagram, Mail, MapPin, ExternalLink } from "lucide-react";

import Container from "../ui/Container";
import useLang from "../../hooks/useLang";
import footerData from "../../data/footer.json";
import { getImage } from "../../lib/images";
import { WhatsAppIcon, DiscordIcon, LinktreeIcon } from "../ui/BrandIcons";

const logo = getImage("logo");

const SOCIALS = [
    { key: "instagramLink", label: "Instagram", Icon: Instagram, hover: "hover:text-esn-magenta" },
    { key: "whatsappLink", label: "WhatsApp", Icon: WhatsAppIcon, hover: "hover:text-esn-green" },
    { key: "discordLink", label: "Discord", Icon: DiscordIcon, hover: "hover:text-esn-indigo" },
    { key: "linktreeLink", label: "Linktree", Icon: LinktreeIcon, hover: "hover:text-esn-green" },
];

const Footer = () => {
    const { t } = useTranslation();
    const { path } = useLang();

    const links = [
        { to: "", key: "navBar.home" },
        { to: "events", key: "navBar.events" },
        { to: "new-to-skovde", key: "navBar.newToCity" },
        { to: "esn-card", key: "navBar.esnCard" },
        { to: "board", key: "navBar.meetBoard" },
        { to: "contact", key: "navBar.contactUs" },
    ];

    return (
        <footer className="signal-default relative mt-auto border-t border-hairline/[var(--hairline-opacity)] bg-surface">
            {/* The ESN star as a five-segment rule. */}
            <div className="flex h-1 w-full" aria-hidden="true">
                <span className="flex-1 bg-esn-cyan" />
                <span className="flex-1 bg-esn-magenta" />
                <span className="flex-1 bg-esn-green" />
                <span className="flex-1 bg-esn-orange" />
                <span className="flex-1 bg-esn-indigo" />
            </div>

            <Container width="wide" className="py-14">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
                    {/* Identity */}
                    <div>
                        <div className="flex items-center gap-3">
                            <img
                                src={logo?.src}
                                alt=""
                                width="40"
                                height="40"
                                className="h-10 w-10"
                                loading="lazy"
                                decoding="async"
                            />
                            <span className="flex flex-col leading-none">
                                <span className="font-display text-xl font-bold tracking-tight text-ink">
                                    ESN Skövde
                                </span>
                                <span className="font-display text-[0.7rem] uppercase tracking-[0.18em] text-ink-faint">
                                    Erasmus Student Network
                                </span>
                            </span>
                        </div>

                        <p className="measure mt-5 text-sm leading-relaxed text-ink-muted">
                            {t("footer.blurb", {
                                defaultValue:
                                    "A volunteer-run student organisation making Skövde feel like home for international students — events, trips, and a community from day one.",
                            })}
                        </p>

                        <div className="mt-6 flex gap-3">
                            {SOCIALS.map(({ key, label, Icon, hover }) => (
                                <a
                                    key={key}
                                    href={footerData[key]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline/[var(--hairline-opacity)] text-ink-muted transition-colors duration-200 ${hover}`}
                                >
                                    <Icon className="h-[1.15rem] w-[1.15rem]" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Site links */}
                    <nav aria-label={t("footer.explore", { defaultValue: "Explore" })}>
                        <h2 className="eyebrow">{t("footer.explore", { defaultValue: "Explore" })}</h2>
                        <ul className="mt-5 flex flex-col gap-2.5">
                            {links.map((link) => (
                                <li key={link.key}>
                                    <Link
                                        to={path(link.to)}
                                        className="text-sm text-ink-muted transition-colors hover:text-signal-ink"
                                    >
                                        {t(link.key)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Contact */}
                    <div>
                        <h2 className="eyebrow">{t("footer.contactUs")}</h2>
                        <ul className="mt-5 flex flex-col gap-4 text-sm text-ink-muted">
                            <li className="flex gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-signal-ink" />
                                <span>
                                    {footerData.street}
                                    <br />
                                    {footerData.city}
                                    <br />
                                    {t("footer.country")}
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-signal-ink" />
                                <a
                                    href={`mailto:${footerData.email}`}
                                    className="transition-colors hover:text-signal-ink"
                                >
                                    {footerData.email}
                                </a>
                            </li>
                            <li className="flex gap-3">
                                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-signal-ink" />
                                <span>
                                    {t("footer.universityText")}:{" "}
                                    <a
                                        href={footerData.universityWebsite}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-ink transition-colors hover:text-signal-ink"
                                    >
                                        {t("footer.university")}
                                    </a>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-hairline/[var(--hairline-opacity)] pt-7 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} ESN Skövde. {t("footer.rights", { defaultValue: "Made by volunteers." })}</p>
                    <div className="flex gap-5">
                        <a
                            href="https://esnsweden.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-signal-ink"
                        >
                            ESN Sweden
                        </a>
                        <a
                            href="https://esn.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-signal-ink"
                        >
                            ESN International
                        </a>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
