import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";

import Container from "../ui/Container";

/**
 * One line under the hero that says what the pin beside a place name means.
 * It sits outside the section tiles, which are hidden on a phone: a phone is
 * where a tap on a place is most likely to open a maps app.
 */
const MapsTip = () => {
    const { t } = useTranslation();

    return (
        <Container>
            {/* mb-8 only below md: from there the section tiles follow with
                their own padding, and on a phone they are hidden, so the guide
                bar would otherwise sit flush against the tip. */}
            <p className="mb-8 mt-8 flex md:mb-0 items-start gap-3 rounded-2xl border border-signal/30 bg-signal/[0.08] px-4 py-3.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                <MapPin
                    className="mt-[0.2rem] h-4 w-4 shrink-0 text-signal-ink"
                    strokeWidth={2.4}
                    aria-hidden="true"
                />
                <span>{t("newToCity.guide.mapsTip")}</span>
            </p>
        </Container>
    );
};

export default MapsTip;
