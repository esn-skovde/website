import { Check } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * A list whose markers carry the page's signal colour. Most of the guide
 * content is translated arrays, so this is the workhorse for rendering them.
 */
const BulletList = ({ items, icon: Icon = Check, columns = 1, className, itemClassName }) => {
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
                        "flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink-muted",
                        itemClassName
                    )}
                >
                    <Icon
                        className="mt-[0.2rem] h-4 w-4 shrink-0 text-signal-ink"
                        strokeWidth={2.5}
                        aria-hidden="true"
                    />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
};

export default BulletList;
