import { useTranslation } from "react-i18next";
import NotFound from "../components/NotFound";
import SEO from "../components/SEO";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t("seo.pages.notFound.title")}
        description={t("seo.pages.notFound.description")}
        keywords={t("seo.pages.notFound.keywords")}
        url={`/${t.language}/404`}
        robots="noindex, nofollow"
      />
      <div className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <NotFound />
      </div>
    </>
  );
};

export default NotFoundPage;
