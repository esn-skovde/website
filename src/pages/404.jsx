import { useTranslation } from "react-i18next";
import NotFound from "../components/NotFound";
import PageTitle from "../components/common/PageTitle";
import SEO from "../components/SEO";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t("notFound.title")}
        description="The page you are looking for could not be found on ESN Skövde."
        keywords="404, page not found, ESN Skövde"
        url="/404"
        robots="noindex, nofollow"
      />
      <PageTitle title={t("notFound.title")} />
      <div className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <NotFound />
      </div>
    </>
  );
};

export default NotFoundPage;
