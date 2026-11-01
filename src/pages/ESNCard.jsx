import { useTranslation } from "react-i18next";

import PageShell from "../components/ui/PageShell";
import CardShowcase from "../components/esn-card/CardShowcase";
import CardBenefits from "../components/esn-card/CardBenefits";
import Partners from "../components/esn-card/Partners";

const ESNCard = () => {
    const { t } = useTranslation();

    return (
        <PageShell
            signal="orange"
            header={false}
            seo={{
                title: t("navBar.esnCard"),
                description: t("seo.pages.esnCard.description"),
                keywords: t("seo.pages.esnCard.keywords"),
            }}
        >
            <CardShowcase />
            <CardBenefits />
            <Partners />
        </PageShell>
    );
};

export default ESNCard;
