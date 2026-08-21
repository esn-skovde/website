import Section from "../ui/Section";
import { SECTIONS } from "./sections";
import { cn } from "../../lib/cn";

/**
 * One part of the guide. Takes its anchor id and its number from the shared
 * registry, so a section can never disagree with the nav about either.
 *
 * The number is real information here: this is a long page read in order, and
 * "04 of 11" tells you how far in you are in a way a bare heading does not.
 * Alternating grounds keep eleven consecutive sections from blurring together.
 */
const GuideSection = ({ sectionKey, title, lead, children, className }) => {
    const index = SECTIONS.findIndex((entry) => entry.key === sectionKey);
    const section = SECTIONS[index];

    return (
        <Section
            id={section?.id}
            eyebrow={String(index + 1).padStart(2, "0")}
            title={title}
            lead={lead}
            className={cn(index % 2 === 1 && "bg-surface-2", className)}
        >
            {children}
        </Section>
    );
};

export default GuideSection;
