import { Check } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * A list whose markers carry the page's signal colour. Most of the guide
 * content is translated arrays, so this is the workhorse for rendering them.
 *
 * Each marker is centred in a column --marker-col wide, followed by a
 * --marker-gap gap. A card with a heading icon sets both to its icon's width
 * and gap, so the check marks sit on the icon's centre line and the items'
 * text starts where the title's does.
 */
const BulletList = ({
    items,
    icon: Icon = Check,
    columns = 1,
    className,
    itemClassName,
    iconClassName,
}) => {
    if (!items?.length) return null;

    return (
        <ul
            className={cn(
                "flex flex-col gap-3",
                columns === 2 && "sm:grid sm:grid-cols-2 sm:gap-x-8",
                className
            )}
        >
            {items.map((item, index) => (
                <li
                    key={index}
                    className={cn(
                        "flex items-start gap-[var(--marker-gap,0.75rem)] text-[0.9375rem] leading-relaxed text-ink-muted",
                        itemClassName
                    )}
                >
                    <span className="flex w-[var(--marker-col,1rem)] shrink-0 justify-center">
                        <Icon
                            /* cn() joins, it does not merge, so the default colour has
                               to step aside rather than sit alongside an override. */
                            className={cn(
                                "lead-icon h-4 w-4 shrink-0",
                                iconClassName || "text-signal-ink"
                            )}
                            strokeWidth={2.5}
                            aria-hidden="true"
                        />
                    </span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
};

export default BulletList;
