import BoardMembers from "../components/board/BoardMembers";
import SEO from "../components/SEO";
import { useTranslation } from "react-i18next";

const BoardPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t("navBar.meetBoard")}
        description={t("seo.pages.meetBoard.description")}
        keywords={t("seo.pages.meetBoard.keywords")}
        url={`/${t.language}/board`}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <BoardMembers />
      </div>
    </>
  );
};

export default BoardPage;
