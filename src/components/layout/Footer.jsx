import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Instagram, Mail, MapPin, ExternalLink } from "lucide-react";

import Container from "../ui/Container";
import useLang from "../../hooks/useLang";
import footerData from "../../data/footer.json";
import { getImage } from "../../lib/images";

const logo = getImage("logo");

const WhatsAppIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const DiscordIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
);

const LinktreeIcon = (props) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
    >
        <path d="M4 10h16" />
        <path d="M6.5 4.5l11 11" />
        <path d="M6.5 15.5l11 -11" />
        <path d="M12 10v-8" />
        <path d="M12 15v7" />
    </svg>
);

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
