import { useTranslation } from "react-i18next";
import { ArrowUpRight, BadgeCheck } from "lucide-react";

import Container from "../ui/Container";
import Button from "../ui/Button";
import Img from "../ui/Img";
import useBootMount from "../../hooks/useBootMount";
import { cn } from "../../lib/cn";

const PURCHASE_URL = "https://sales.esnskovde.org/esncard-2627/";

/**
 * The card itself is the argument for the page, so it leads: tilted, lit from
 * behind by the signal colour, and the only thing above the fold besides the
 * headline and the one action that matters.
 */
const CardShowcase = () => {
    const { t } = useTranslation();
    // The prerendered page already played the entrance; the boot render only repaints it.
    const bootMount = useBootMount();

    return (
        <section className="relative isolate overflow-hidden border-b border-hairline/[var(--hairline-opacity)]">
            <div className="starfield opacity-70" aria-hidden="true" />

            <Container className="relative py-16 sm:py-20 lg:py-24">
                <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
                    <div className={cn("flex flex-col items-start", !bootMount && "animate-rise-in")}>
                        <span className="eyebrow">{t("navBar.esnCard")}</span>

                        <h1 className="mt-5 text-display text-display-md text-ink">
                            {t("esnCard.cardName")}
                        </h1>

                        <p className="measure mt-5 text-lg leading-relaxed text-ink-muted sm:text-xl">
                            {t("esnCard.tagline")}
                        </p>

                        <div className="mt-9 flex flex-wrap items-center gap-3">
                            <Button href={PURCHASE_URL} size="lg">
                                {t("esnCard.purchaseText")}
                                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                            </Button>
                            <span className="inline-flex items-center gap-2 text-sm text-ink-faint">
                                <BadgeCheck className="h-4 w-4 text-signal-ink" strokeWidth={2.4} />
                                esncard.org
                            </span>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                        {/* Light source behind the card, in the page's signal colour. */}
                        <div
                            className="absolute -inset-8 -z-10 rounded-[3rem] bg-signal/25 blur-3xl"
                            aria-hidden="true"
                        />
                        {/* Transparent box and a drop-shadow filter rather than a
                            box-shadow, so the shadow follows the card's own edges
                            instead of drawing a panel behind it. */}
                        <Img
                            name="esn-card"
                            alt={t("esnCard.cardName")}
                            sizes="(min-width: 1024px) 40vw, 90vw"
                            priority
                            fit="contain"
                            ratio="4 / 3"
                            className="bg-transparent animate-float [transform:perspective(1200px)_rotateY(-10deg)_rotateX(4deg)]"
                            imgClassName="[filter:drop-shadow(0_26px_40px_rgb(var(--shadow-color)/0.45))]"
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default CardShowcase;
