import SEO from "../SEO";
import Container from "./Container";
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
}) => (
    <div className={cn(SIGNAL_CLASS[signal] ?? "signal-default", "bg-ground", className)}>
        {seo && <SEO {...seo} />}

        {header && (title || eyebrow) && (
            <header className="relative overflow-hidden border-b border-hairline/[var(--hairline-opacity)] pb-14 pt-14 sm:pb-16 sm:pt-20">
                <div className="starfield opacity-60" aria-hidden="true" />
                <Container className="relative">
                    <div className="flex flex-col gap-5 animate-rise-in">
                        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
                        {title && (
                            <h1 className="text-display text-display-sm text-ink">{title}</h1>
                        )}
                        {lead && (
                            <p className="measure text-lg leading-relaxed text-ink-muted sm:text-xl">
                                {lead}
                            </p>
                        )}
                    </div>
                </Container>
            </header>
        )}

        {children}
    </div>
);

export default PageShell;
