import { cn } from "../../lib/cn";

/** Honest placeholder for a section with nothing to show, or nothing to show yet. */
const EmptyState = ({ icon: Icon, title, description, action, className }) => (
    <div
        className={cn(
            "panel flex flex-col items-center gap-3 px-6 py-14 text-center",
            className
        )}
    >
        {Icon && (
            <span className="mb-1 inline-flex h-12 w-12 items-center justify-center rounded-full bg-signal/10 text-signal-ink">
                <Icon className="h-5 w-5" strokeWidth={2} />
            </span>
        )}
        <h3 className="text-display text-xl text-ink">{title}</h3>
        {description && <p className="measure text-[0.9375rem] text-ink-muted">{description}</p>}
        {action}
    </div>
);

export default EmptyState;
