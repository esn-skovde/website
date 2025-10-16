import { useTranslation } from "react-i18next";
import ESNCardHero from "../components/esn-card/ESNCardHero";
import PartnerLogos from "../components/esn-card/PartnerLogos";
import SEO from "../components/SEO";

function ESNCard() {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t("navBar.esnCard")}
        description={t("seo.pages.esnCard.description")}
        keywords={t("seo.pages.esnCard.keywords")}
        url={`/${t.language}/esn-card`}
      />
      <div className="py-12 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto px-4">
          {/* Hero section with card display */}
          <ESNCardHero />

          {/* Partner Logos Section */}
          <PartnerLogos />
        </div>
      </div>
    </>
  );
}

export default ESNCard;
