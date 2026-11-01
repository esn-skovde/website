import { cn } from "../../lib/cn";

/** Panel with an optional icon badge and heading. */
const InfoCard = ({ icon: Icon, title, eyebrow, children, className, headingLevel: H = "h3" }) => (
    <div className={cn("panel flex h-full flex-col p-6 sm:p-7", className)}>
        {(Icon || title) && (
            <div className="flex items-center gap-3.5">
                {Icon && (
                    <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-signal/[0.12] text-signal-ink"
                        aria-hidden="true"
                    >
                        <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </span>
                )}
                {/* min-w-0: a flex item will not shrink below its longest word, so a
                    long German title pushed the card past the screen instead of wrapping. */}
                <div className="flex min-w-0 flex-col gap-1">
                    {eyebrow && (
                        <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                            {eyebrow}
                        </span>
                    )}
                    {title && <H className="text-display text-lg text-ink sm:text-xl">{title}</H>}
                </div>
            </div>
        )}

        {/* flex-1: the card is as tall as its row, and a child with mt-auto sits at its foot.
            The marker variables line a BulletList's check marks up under the badge
            (w-10, gap-3.5) and its text up with the title. */}
        {children && (
            <div
                className={cn(
                    "flex flex-1 flex-col gap-3",
                    (Icon || title) && "mt-4",
                    Icon && "[--marker-col:2.5rem] [--marker-gap:0.875rem]"
                )}
            >
                {children}
            </div>
        )}
    </div>
);

export default InfoCard;
