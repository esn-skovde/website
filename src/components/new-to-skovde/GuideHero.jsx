import { useTranslation } from "react-i18next";
import { ArrowDown, Siren } from "lucide-react";

import Container from "../ui/Container";
import Button from "../ui/Button";
import { getImage } from "../../lib/images";

const city = getImage("skovde-city");

const GuideHero = () => {
    const { t } = useTranslation();

    return (
        <section className="relative isolate flex min-h-[62svh] items-end overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <img
                    src={city?.src}
                    srcSet={city?.srcSet}
                    sizes="100vw"
                    alt="Skövde city centre"
                    fetchPriority="high"
                    decoding="sync"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/78 to-[#05070f]/35" />
                <div className="starfield opacity-40 mix-blend-screen" aria-hidden="true" />
                <span className="absolute bottom-2 right-3 text-[0.65rem] text-white/55">
                    Photo: Tobias Andersson
                </span>
            </div>

            <Container className="relative pb-14 pt-28 sm:pb-16">
                <div className="max-w-3xl">
                    <h1 className="text-display text-display-md text-white animate-rise-in">
                        {t("newToCity.title")}
                    </h1>
                    <p
                        className="measure mt-6 text-lg leading-relaxed text-white/80 animate-rise-in"
                        style={{ animationDelay: "140ms" }}
                    >
                        {t("newToCity.subtitle")}
                    </p>
                    <div
                        className="mt-8 flex flex-wrap gap-3 animate-rise-in"
                        style={{ animationDelay: "260ms" }}
                    >
                        <Button href="#getting-started" size="lg">
                            {t("newToCity.getStartedBtn")}
                            <ArrowDown className="h-4 w-4" strokeWidth={2.5} />
                        </Button>
                        <Button href="#emergency-contacts" variant="onImage" size="lg">
                            <Siren className="h-4 w-4" strokeWidth={2.5} />
                            {t("newToCity.emergencyInfoBtn")}
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default GuideHero;
