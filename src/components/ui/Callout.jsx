import { cn } from "../../lib/cn";

/* Tinted rather than filled, so a callout reads as emphasis without becoming a
   second competing surface next to .panel. */
const TONES = {
    signal: "border-signal/30 bg-signal/[0.07]",
    urgent: "border-esn-magenta/40 bg-esn-magenta/[0.07]",
    neutral: "border-hairline/[var(--hairline-opacity)] bg-surface-2",
};

const Callout = ({ icon: Icon, title, tone = "signal", children, className }) => (
    <div className={cn("rounded-panel border p-6 sm:p-7", TONES[tone], className)}>
        {title && (
            <h3 className="flex items-center gap-2.5 text-display text-base text-ink sm:text-lg">
                {Icon && (
                    <Icon
                        className={cn(
                            "h-[1.15rem] w-[1.15rem] shrink-0",
                            tone === "urgent" ? "text-esn-magenta" : "text-signal-ink"
                        )}
                        strokeWidth={2.4}
                        aria-hidden="true"
                    />
                )}
                {title}
            </h3>
        )}
        <div className={cn(title && "mt-4")}>{children}</div>
    </div>
);

export default Callout;
