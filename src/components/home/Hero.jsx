import { useTranslation } from "react-i18next";
import { ArrowRight, MapPin } from "lucide-react";

import Container from "../ui/Container";
import Button from "../ui/Button";
import useLang from "../../hooks/useLang";
import { getImage } from "../../lib/images";

const landscape = getImage("hero");
const portrait = getImage("hero-portrait");

const Hero = () => {
    const { t } = useTranslation();
    const { path } = useLang();

    return (
        <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden">
            <div className="absolute inset-0 -z-10">
                {/* One <picture>, so the browser fetches either the landscape or
                    the portrait crop — never both, as the old two-<img> version did. */}
                <picture>
                    <source
                        media="(max-width: 767px)"
                        srcSet={portrait?.srcSet}
                        sizes="100vw"
                        type="image/webp"
                    />
                    <img
                        src={landscape?.src}
                        srcSet={landscape?.srcSet}
                        sizes="100vw"
                        alt="ESN Skövde students gathered outside Skövde central station"
                        fetchPriority="high"
                        decoding="sync"
                        className="h-full w-full object-cover"
                    />
                </picture>

                {/* Scrim. Vertical on phones where the text sits low, angled on
                    wide screens so the group photo stays readable on the right. */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/75 to-[#05070f]/25 md:bg-gradient-to-tr md:from-[#05070f] md:via-[#05070f]/70 md:to-transparent" />
                <div className="starfield opacity-45 mix-blend-screen" aria-hidden="true" />
            </div>

            <Container width="wide" className="relative pb-16 pt-32 sm:pb-20 md:pb-24">
                <div className="max-w-3xl">
                    <span
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md animate-fade-in"
                        style={{ animationDelay: "80ms" }}
                    >
                        <MapPin className="h-3.5 w-3.5" strokeWidth={2.5} />
                        Skövde, {t("footer.country")}
                    </span>

                    <h1
                        className="mt-6 text-display text-display-md text-white animate-rise-in"
                        style={{ animationDelay: "160ms" }}
                    >
                        {t("home.hero.title")}
                    </h1>

                    <p
                        className="mt-3 text-display text-display-sm animate-rise-in"
                        style={{ animationDelay: "280ms" }}
                    >
                        {/* The city name carries the ESN star rather than a flat white. */}
                        <span className="bg-gradient-to-r from-esn-cyan via-esn-magenta to-esn-orange bg-clip-text text-transparent">
                            {t("home.hero.subtitle")}
                        </span>
                    </p>

                    <p
                        className="measure mt-7 text-lg leading-relaxed text-white/80 animate-rise-in"
                        style={{ animationDelay: "380ms" }}
                    >
                        {t("home.heroLead", {
                            defaultValue:
                                "Events, trips and a ready-made community of international students — from your first week here to your last.",
                        })}
                    </p>

                    <div
                        className="mt-9 flex flex-wrap gap-3 animate-rise-in"
                        style={{ animationDelay: "480ms" }}
                    >
                        <Button to={path("events")} size="lg">
                            {t("home.splitSection.events.button")}
                            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                        </Button>
                        <Button to={path("new-to-skovde")} variant="onImage" size="lg">
                            {t("navBar.newToCity")}
                        </Button>
                    </div>
                </div>
            </Container>

            {/* The ESN star as a five-segment rule closing the hero. */}
            <div className="absolute inset-x-0 bottom-0 flex h-1.5" aria-hidden="true">
                <span className="flex-1 bg-esn-cyan" />
                <span className="flex-1 bg-esn-magenta" />
                <span className="flex-1 bg-esn-green" />
                <span className="flex-1 bg-esn-orange" />
                <span className="flex-1 bg-esn-indigo" />
            </div>
        </section>
    );
};

export default Hero;
