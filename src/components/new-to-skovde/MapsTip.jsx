import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";

import Container from "../ui/Container";

/**
 * One line at the head of the guide's sections, under the guide bar, that says
 * what the pin beside a place name means. The sections are where the place
 * names are, so the tip is read just before the first of them.
 */
const MapsTip = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <p className="mt-8 flex items-start gap-3 rounded-2xl border border-signal/30 bg-signal/[0.08] px-4 py-3.5 text-[0.9375rem] leading-relaxed text-ink-muted">
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
