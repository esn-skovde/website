import BoardMembers from "../components/board/BoardMembers";
import SEO from "../components/SEO";
import { useTranslation } from "react-i18next";

const BoardPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t("navBar.board")}
        description="Meet the ESN Skövde Board and coordinators who organize events, support international students, and keep our section running."
        keywords="ESN Skövde Board, coordinators, student organization, volunteers, Erasmus"
        url="/board"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <BoardMembers />
      </div>
    </>
  );
};

export default BoardPage;
