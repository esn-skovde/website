import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";

import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import Button from "../ui/Button";
import Img from "../ui/Img";

const PARTNERS = [
    { name: "Ryanair", image: "partners/ryanair" },
    { name: "Timetravels", image: "partners/timetravels" },
    { name: "Flixbus", image: "partners/flixbus" },
    { name: "Samsung", image: "partners/samsung" },
];

const Partners = () => {
    const { t } = useTranslation();

    return (
        <Section
            eyebrow={t("esnCard.perks", { defaultValue: "Where it works" })}
            title={t("esnCard.discountPartners")}
            lead={t("esnCard.partnersDescription")}
        >
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                {PARTNERS.map((partner, index) => (
                    <Reveal key={partner.name} delay={index * 70}>
                        {/* These are brand marks printed for light backgrounds, so the
                            tile stays white in both themes rather than inverting them. */}
                        <div className="panel flex h-28 items-center justify-center bg-white p-6 transition-transform duration-300 hover:-translate-y-1">
                            <Img
                                name={partner.image}
                                alt={partner.name}
                                sizes="(min-width: 1024px) 15vw, 40vw"
                                fit="contain"
                                className="h-full w-full bg-transparent"
                            />
                        </div>
                    </Reveal>
                ))}
            </div>

            <Reveal delay={280} className="mt-10 flex flex-col items-center gap-4 text-center">
                <p className="text-display text-lg text-ink">{t("esnCard.manyMore")}</p>
                <Button href="https://esncard.org/" variant="secondary" size="lg">
                    {t("esnCard.viewAllDiscounts")}
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                </Button>
            </Reveal>
        </Section>
    );
};

export default Partners;
