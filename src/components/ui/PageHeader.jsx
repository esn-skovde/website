import Container from "./Container";
import StarRule from "./StarRule";
import { cn } from "../../lib/cn";
import useBootMount from "../../hooks/useBootMount";

/**
 * The standard page header: eyebrow, title and lead on the starfield. PageShell
 * renders it for most pages; the Events page uses it only when it has no trips
 * to open with.
 */
const PageHeader = ({ eyebrow, title, lead }) => {
    // The prerendered page already played the entrance; the boot render only repaints it.
    const bootMount = useBootMount();

    return (
        <header className="relative overflow-hidden pb-14 pt-14 sm:pb-16 sm:pt-20">
            <div className="starfield opacity-60" aria-hidden="true" />
            <Container className="relative">
                <div className={cn("flex flex-col gap-5", !bootMount && "animate-rise-in")}>
                    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
                    {title && <h1 className="text-display text-display-sm text-ink">{title}</h1>}
                    {lead && (
                        <p className="measure text-lg leading-relaxed text-ink-muted sm:text-xl">
                            {lead}
                        </p>
                    )}
                </div>
            </Container>

            <StarRule />
        </header>
    );
};

export default PageHeader;
