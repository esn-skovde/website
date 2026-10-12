import { useTranslation } from "react-i18next";
import { ExternalLink, Instagram, Mail, MapPin } from "lucide-react";

import { WhatsAppIcon, DiscordIcon } from "../ui/BrandIcons";
import footerData from "../../data/footer.json";

/* Ordered by how fast you get an answer, not alphabetically.

   Each icon takes its brand colour through a signal scope rather than the raw
   brand hue, which is never themed: ESN indigo is 1.7:1 on a dark card. The
   scope goes on the icon itself, so the card's focus ring and hover colour
   keep the page's own signal. */
const CHANNELS = [
    {
        key: "instagramLink",
        label: "Instagram",
        handle: "@esnskovde",
        Icon: Instagram,
        accent: "signal-magenta text-signal-ink",
    },
    {
        key: "whatsappLink",
        label: "WhatsApp",
        handleKey: "contact.whatsappHandle",
        Icon: WhatsAppIcon,
        accent: "signal-green text-signal-ink",
    },
    {
        key: "discordLink",
        label: "Discord",
        handleKey: "contact.discordHandle",
        Icon: DiscordIcon,
        accent: "signal-indigo text-signal-ink",
    },
];

const ContactChannels = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-5">
            {/* Email first and largest: it is the address a board member reads. */}
            <a
                href={`mailto:${footerData.email}`}
                className="panel group flex items-center gap-4 p-6 transition-transform duration-200 hover:-translate-y-0.5"
            >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-signal/[0.12] text-signal-ink">
                    <Mail className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                    <span className="block font-display text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                        {t("contact.emailUs")}
                    </span>
                    {/* anywhere, not break-words: break-word leaves the whole address as
                        the card's minimum width, and at 320px that pushed the cards
                        into the right-hand gutter. */}
                    <span className="mt-1 block font-display text-lg font-bold text-ink [overflow-wrap:anywhere] group-hover:text-signal-ink">
                        {footerData.email}
                    </span>
                </span>
            </a>

            <div>
                <h2 className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                    {t("contact.socialMedia")}
                </h2>
                <ul className="mt-3 flex flex-col gap-3">
                    {CHANNELS.map(({ key, label, handle, handleKey, Icon, accent }) => (
                        <li key={key}>
                            <a
                                href={footerData[key]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="panel group flex items-center gap-4 p-4 transition-transform duration-200 hover:-translate-y-0.5"
                            >
                                <Icon
                                    className={`h-6 w-6 shrink-0 ${accent}`}
                                    aria-hidden="true"
                                />
                                <span className="min-w-0">
                                    <span className="block font-display font-bold text-ink">
                                        {label}
                                    </span>
                                    <span className="block truncate text-[0.875rem] text-ink-muted">
                                        {handle ?? t(handleKey)}
                                    </span>
                                </span>
                                <ExternalLink
                                    className="ml-auto h-4 w-4 shrink-0 text-ink-faint transition-colors group-hover:text-signal-ink"
                                    strokeWidth={2.2}
                                    aria-hidden="true"
                                />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <address className="panel flex items-center gap-4 p-6 not-italic">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-signal/[0.12] text-signal-ink">
                    <MapPin className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                </span>
                <span>
                    <span className="block font-display text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                        {t("contact.findUs")}
                    </span>
                    <span className="mt-1 block leading-relaxed text-ink-muted">
                        {footerData.street}
                        <br />
                        {footerData.city}
                        <br />
                        {t("footer.country")}
                    </span>
                </span>
            </address>
        </div>
    );
};

export default ContactChannels;
