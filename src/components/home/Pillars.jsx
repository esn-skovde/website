import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";

import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import Img from "../ui/Img";
import useLang from "../../hooks/useLang";
import { cn } from "../../lib/cn";

/**
 * The three things a new student needs from this site. Each one carries the
 * signal colour of the page it leads to, so the colour is already familiar by
 * the time you arrive there.
 */
const Pillars = () => {
    const { t } = useTranslation();
    const { path } = useLang();

    const pillars = [
        {
            id: "welcome",
            to: "board",
            image: "section1",
            signal: "signal-indigo",
            span: "lg:col-span-2",
            ratio: "16 / 10",
            sizes: "(min-width: 1024px) 62vw, 100vw",
        },
        {
            id: "events",
            to: "events",
            image: "section2",
            signal: "signal-magenta",
            span: "lg:col-span-1",
            ratio: "4 / 3",
            sizes: "(min-width: 1024px) 31vw, 100vw",
        },
        {
            id: "cityTour",
            to: "new-to-skovde",
            image: "skovde-city",
            credit: "Tobias Andersson",
            signal: "signal-green",
            span: "lg:col-span-3",
            ratio: "16 / 9",
            sizes: "(min-width: 1024px) 45vw, 100vw",
            wide: true,
        },
    ];

    return (
        <Section
            eyebrow={t("home.pillarsEyebrow", { defaultValue: "Start here" })}
            title={t("home.pillarsTitle", { defaultValue: "Three ways in" })}
            lead={t("home.pillarsLead", {
                defaultValue:
                    "Whether you landed yesterday or you have been here a semester, this is where to begin.",
            })}
        >
            <div className="grid gap-5 lg:grid-cols-3">
                {pillars.map((pillar, index) => (
                    <Reveal
                        key={pillar.id}
                        delay={index * 90}
                        className={cn(pillar.signal, pillar.span)}
                    >
                        <Link
                            to={path(pillar.to)}
                            className={cn(
                                "panel group flex h-full flex-col overflow-hidden transition-[transform,border-color,box-shadow] duration-300",
                                "hover:-translate-y-1 hover:border-signal/45",
                                pillar.wide && "md:flex-row"
                            )}
                        >
                            <Img
                                name={pillar.image}
                                alt=""
                                ratio={pillar.ratio}
                                sizes={pillar.sizes}
                                credit={pillar.credit}
                                className={cn(
                                    "shrink-0",
                                    pillar.wide ? "md:w-1/2 md:[aspect-ratio:auto]" : "w-full"
                                )}
                                imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                            />

                            <div
                                className={cn(
                                    "flex flex-1 flex-col p-7",
                                    pillar.wide && "md:justify-center md:p-10"
                                )}
                            >
                                <h3 className="text-display text-2xl text-ink sm:text-[1.75rem]">
                                    {t(`home.splitSection.${pillar.id}.title`)}
                                </h3>
                                <p className="measure mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                                    {t(`home.splitSection.${pillar.id}.description`)}
                                </p>
                                <span className="mt-6 inline-flex items-center gap-1.5 font-display text-[0.9375rem] font-bold text-signal-ink">
                                    {t(`home.splitSection.${pillar.id}.button`)}
                                    <ArrowUpRight
                                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        strokeWidth={2.5}
                                    />
                                </span>
                            </div>
                        </Link>
                    </Reveal>
                ))}
            </div>
        </Section>
    );
};

export default Pillars;
