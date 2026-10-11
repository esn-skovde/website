import { useTranslation } from "react-i18next";

import Container from "../ui/Container";
import { SECTIONS } from "./sections";
import { cn } from "../../lib/cn";

const LABEL_ID = "guide-index-label";

/**
 * The guide at a glance: one tile for each of its sections, under the hero.
 *
 * It is for screens with room for it. On a phone the sticky bar below
 * (GuideNav) lists every section instead, so this is hidden under md rather
 * than squeezed into a column of eleven.
 *
 * The grid is four columns wide from md up, and the emergency tile takes two
 * of them. With the sections in their order that is 4 + (1 + 2 + 1) + 4
 * tiles: three full rows, no empty cell. A grid of three columns would leave
 * a hole beside the wide tile, and getting around it with grid-auto-flow
 * would draw the tiles in a different order from the one Tab walks. If a
 * section is added, moved or removed, redo this arithmetic.
 *
 * Each tile is a plain link to its section, named by its title alone: the
 * teaser is a description, so a screen reader hears the eleven titles first
 * and the sentences only if it wants them.
 */
const GuideIndex = () => {
    const { t } = useTranslation();

    return (
        <nav aria-labelledby={LABEL_ID} className="hidden md:block">
            <Container>
                <div className="py-12 lg:py-14">
                    <p id={LABEL_ID} className="eyebrow">
                        {t("newToCity.guide.eyebrow", { total: SECTIONS.length })}
                    </p>

                    <ul className="mt-6 grid grid-cols-4 gap-3 lg:gap-4">
                        {SECTIONS.map(({ id, key, icon: Icon, urgent }) => (
                            <li key={id} className={cn(urgent && "col-span-2")}>
                                <a
                                    href={`#${id}`}
                                    aria-labelledby={`guide-index-${id}-title`}
                                    aria-describedby={`guide-index-${id}-teaser`}
                                    className={cn(
                                        "flex h-full flex-col gap-3 rounded-2xl border p-4 lg:p-5",
                                        "transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out",
                                        "hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
                                        urgent
                                            ? "border-[#f87171]/70 bg-[#dc2626] text-white shadow-[0_8px_22px_-12px_rgb(220_38_38/0.85)] hover:bg-[#b91c1c]"
                                            : "border-hairline/[var(--hairline-opacity)] bg-surface hover:border-signal hover:shadow-[0_10px_26px_-14px_rgb(var(--shadow-color)/0.45)]"
                                    )}
                                >
                                    {/* Under lg a tile is only 170 to 230px wide: the icon
                                        sits above the title, which needs the full width
                                        for words like "Notfallkontakte". */}
                                    <span
                                        className={cn(
                                            "flex gap-3",
                                            urgent
                                                ? "items-center"
                                                : "flex-col items-start lg:flex-row lg:items-center"
                                        )}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                                                urgent ? "bg-white/[0.18] text-white" : "bg-signal/[0.12] text-signal-ink"
                                            )}
                                        >
                                            <Icon className="h-5 w-5" strokeWidth={2.2} />
                                        </span>
                                        <span
                                            id={`guide-index-${id}-title`}
                                            className={cn(
                                                "min-w-0 font-display text-[0.9375rem] font-bold leading-tight",
                                                urgent ? "text-white" : "text-ink"
                                            )}
                                        >
                                            {t(`newToCity.sections.${key}.title`)}
                                        </span>
                                    </span>
                                    {/* The section's own lead, cut at two lines. White
                                        stays white on the red: any tint of it drops under
                                        4.5:1 there. */}
                                    <span
                                        id={`guide-index-${id}-teaser`}
                                        className={cn(
                                            "line-clamp-2 text-[0.8125rem] leading-[1.45]",
                                            urgent ? "text-white" : "text-ink-muted"
                                        )}
                                    >
                                        {t(`newToCity.sections.${key}.description`)}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </nav>
    );
};

export default GuideIndex;
