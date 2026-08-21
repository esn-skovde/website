import { useTranslation } from "react-i18next";
import { CalendarHeart } from "lucide-react";

import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Img from "../ui/Img";
import { imageKey } from "../../lib/images";

/**
 * Hampus. Not a board member and not a person, so he gets his own block rather
 * than a slot in the grid — the old page gave him a full-width row of the same
 * grid, which meant the layout had to be told to skip four columns.
 */
const MascotCard = ({ mascot }) => {
    const { t } = useTranslation();

    return (
        <section className="pt-14 sm:pt-16">
            <Container>
                <Reveal className="relative isolate overflow-hidden rounded-panel border border-hairline/[var(--hairline-opacity)] bg-surface p-7 sm:p-10">
                    <div className="starfield opacity-70" aria-hidden="true" />

                    <div className="relative flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:gap-10 md:text-left">
                        {/* The five points of the ESN star as a ring, which is the
                            one place on the site where all five belong at once. */}
                        <div className="shrink-0 rounded-full bg-[conic-gradient(from_210deg,rgb(var(--esn-cyan)),rgb(var(--esn-magenta)),rgb(var(--esn-green)),rgb(var(--esn-orange)),rgb(var(--esn-indigo)),rgb(var(--esn-cyan)))] p-1.5">
                            <Img
                                name={imageKey(mascot.image, "board")}
                                alt={mascot.name}
                                ratio="1 / 1"
                                sizes="(min-width: 768px) 224px, 176px"
                                className="h-44 w-44 rounded-full border-4 border-surface md:h-56 md:w-56"
                            />
                        </div>

                        <div className="flex flex-col items-center gap-3 md:items-start">
                            <span className="eyebrow">{t("boardMembers.mascot")}</span>
                            <h2 className="text-display text-3xl text-ink sm:text-4xl">
                                {mascot.name}
                            </h2>
                            <p className="inline-flex items-center gap-2 rounded-full border border-hairline/[var(--hairline-opacity)] bg-surface-2 px-3.5 py-1.5 font-display text-[0.8125rem] font-bold text-ink-muted">
                                <CalendarHeart
                                    className="h-4 w-4 text-signal-ink"
                                    strokeWidth={2.3}
                                    aria-hidden="true"
                                />
                                {t("boardMembers.mascotDay")}: {mascot.mascotDay}
                            </p>
                            <p className="measure text-lg leading-relaxed text-ink-muted">
                                {t("boardMembers.mascotDescription")}
                            </p>
                        </div>
                    </div>
                </Reveal>
            </Container>
        </section>
    );
};

export default MascotCard;
