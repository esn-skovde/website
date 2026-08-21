import { cn } from "../../lib/cn";

/**
 * Panel with an optional icon badge and heading. `emoji` is for the guide's
 * place cards, which are labelled with a pictogram rather than a lucide icon.
 */
const InfoCard = ({ icon: Icon, emoji, title, eyebrow, children, className, headingLevel: H = "h3" }) => (
    <div className={cn("panel flex h-full flex-col p-6 sm:p-7", className)}>
        {(Icon || emoji || title) && (
            <div className="flex items-start gap-3.5">
                {Icon && (
                    <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-signal/[0.12] text-signal-ink"
                        aria-hidden="true"
                    >
                        <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </span>
                )}
                {emoji && (
                    <span className="text-[1.75rem] leading-none" aria-hidden="true">
                        {emoji}
                    </span>
                )}
                <div className="flex flex-col gap-1">
                    {eyebrow && (
                        <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                            {eyebrow}
                        </span>
                    )}
                    {title && <H className="text-display text-lg text-ink sm:text-xl">{title}</H>}
                </div>
            </div>
        )}

        {children && (
            <div className={cn("flex flex-col gap-3", (Icon || emoji || title) && "mt-4")}>
                {children}
            </div>
        )}
    </div>
);

export default InfoCard;
