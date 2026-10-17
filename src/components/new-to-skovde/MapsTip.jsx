import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";

import Container from "../ui/Container";

/**
 * One line under the guide's tiles (GuideIndex) that says what the pin beside
 * a place name means, so it is read before any of the sections.
 *
 * From md up it sits one grid gap under the last row of tiles, as a full-width
 * row of the same grid, and keeps the index's space above the guide bar. On a
 * phone, where the tiles are hidden, it follows the hero.
 */
const MapsTip = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <p className="my-8 flex items-start gap-3 rounded-2xl border border-signal/30 bg-signal/[0.08] px-4 py-3.5 text-[0.9375rem] leading-relaxed text-ink-muted md:mb-12 md:mt-3 lg:mb-14 lg:mt-4">
                <MapPin
                    className="lead-icon h-4 w-4 shrink-0 text-signal-ink"
                    strokeWidth={2.4}
                    aria-hidden="true"
                />
                <span>{t("newToCity.guide.mapsTip")}</span>
            </p>
        </Container>
    );
};

export default MapsTip;
