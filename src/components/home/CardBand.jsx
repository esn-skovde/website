import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles } from "lucide-react";

import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Button from "../ui/Button";
import Img from "../ui/Img";
import useLang from "../../hooks/useLang";

/** Closing call to action: the ESNcard, which most other pages depend on. */
const CardBand = () => {
    const { t } = useTranslation();
    const { path } = useLang();

    return (
        <div className="signal-orange py-16 sm:py-20">
            <Container>
                <Reveal className="panel relative isolate overflow-hidden">
                    <div className="starfield opacity-70" aria-hidden="true" />

                    <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr]">
                        <div>
                            <span className="eyebrow">
                                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
                                {t("esnCard.cardName")}
                            </span>
                            <h2 className="mt-5 text-display text-3xl text-ink sm:text-[2.5rem]">
                                {t("esnCard.tagline")}
                            </h2>
                            <ul className="mt-7 flex flex-col gap-3">
                                {["benefit1", "benefit2", "benefit3", "benefit4"].map((key) => (
                                    <li
                                        key={key}
                                        className="flex items-start gap-3 text-[0.9375rem] text-ink-muted"
                                    >
                                        <span
                                            className="lead-icon h-1.5 w-1.5 shrink-0 rounded-full bg-signal [--lead-icon-size:0.375rem]"
                                            aria-hidden="true"
                                        />
                                        {t(`esnCard.${key}`)}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-9">
                                <Button to={path("esn-card")} size="lg">
                                    {t("navBar.esnCard")}
                                    <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                                </Button>
                            </div>
                        </div>

                        <Img
                            name="esn-card"
                            alt={t("esnCard.cardName")}
                            ratio="1 / 1"
                            sizes="(min-width: 1024px) 34vw, 80vw"
                            className="mx-auto w-full max-w-sm rounded-2xl bg-transparent"
                            imgClassName="object-contain animate-float"
                        />
                    </div>
                </Reveal>
            </Container>
        </div>
    );
};

export default CardBand;
