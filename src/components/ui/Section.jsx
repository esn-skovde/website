import Container from "./Container";
import Reveal from "./Reveal";
import { cn } from "../../lib/cn";

/**
 * A titled content block: eyebrow, heading, optional lead paragraph.
 * Sections carry the page's signal colour through the eyebrow rule.
 */
const Section = ({
    id,
    eyebrow,
    title,
    lead,
    children,
    align = "left",
    width = "default",
    className,
    headerClassName,
}) => (
    <section id={id} className={cn("scroll-mt-nav py-16 sm:py-20", className)}>
        <Container width={width}>
            {(eyebrow || title || lead) && (
                <Reveal
                    className={cn(
                        "flex flex-col gap-4",
                        align === "center" && "items-center text-center",
                        headerClassName
                    )}
                >
                    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
                    {title && (
                        <h2 className="text-display text-3xl sm:text-4xl lg:text-[2.75rem] text-ink">
                            {title}
                        </h2>
                    )}
                    {lead && (
                        <p
                            className={cn(
                                "measure text-lg leading-relaxed text-ink-muted",
                                align === "center" && "mx-auto"
                            )}
                        >
                            {lead}
                        </p>
                    )}
                </Reveal>
            )}

            {children && <div className={cn(eyebrow || title || lead ? "mt-12" : "")}>{children}</div>}
        </Container>
    </section>
);

export default Section;
