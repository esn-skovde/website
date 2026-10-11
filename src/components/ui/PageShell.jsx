import SEO from "../SEO";
import PageHeader from "./PageHeader";
import { cn } from "../../lib/cn";

const SIGNAL_CLASS = {
    cyan: "signal-cyan",
    magenta: "signal-magenta",
    green: "signal-green",
    orange: "signal-orange",
    indigo: "signal-indigo",
};

/**
 * Page wrapper. Binds the page's point of the ESN star to --signal for the
 * whole subtree, and renders the standard page header when one is given.
 */
const PageShell = ({
    signal = "cyan",
    seo,
    eyebrow,
    title,
    lead,
    header = true,
    children,
    className,
}) => {
    return (
        <div className={cn(SIGNAL_CLASS[signal] ?? "signal-default", "bg-ground", className)}>
            {seo && <SEO {...seo} />}

            {header && (title || eyebrow) && (
                <PageHeader eyebrow={eyebrow} title={title} lead={lead} />
            )}

            {children}
        </div>
    );
};

export default PageShell;
