import { useTranslation } from "react-i18next";
import { CalendarCheck, Sparkles, TicketPercent, Users } from "lucide-react";

import Section from "../ui/Section";
import Reveal from "../ui/Reveal";

/* The four benefit strings are flat keys in the translations. They are full
   sentences, so they stay body copy — the icon carries the scanning weight
   instead of forcing them into display type. */
const BENEFITS = [
    { key: "benefit1", icon: TicketPercent },
    { key: "benefit2", icon: Sparkles },
    { key: "benefit3", icon: CalendarCheck },
    { key: "benefit4", icon: Users },
];

const CardBenefits = () => {
    const { t } = useTranslation();

    return (
        <Section
            eyebrow={t("esnCard.whatYouGet", { defaultValue: "What you get" })}
            title={t("esnCard.benefits")}
        >
            <div className="grid gap-5 sm:grid-cols-2">
                {BENEFITS.map(({ key, icon: Icon }, index) => (
                    <Reveal key={key} delay={index * 80}>
                        <div className="panel flex h-full items-start gap-4 p-6 sm:p-7">
                            <span
                                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-signal/[0.12] text-signal-ink"
                                aria-hidden="true"
                            >
                                <Icon className="h-5 w-5" strokeWidth={2.2} />
                            </span>
                            <p className="text-[0.9375rem] leading-relaxed text-ink">
                                {t(`esnCard.${key}`)}
                            </p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </Section>
    );
};

export default CardBenefits;
