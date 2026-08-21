import { useTranslation } from "react-i18next";

import PageShell from "../components/ui/PageShell";
import MascotCard from "../components/board/MascotCard";
import BoardGrid from "../components/board/BoardGrid";
import boardMembersData from "../data/boardMembers.json";

const { mascot, boardMembers } = boardMembersData;

const Board = () => {
    const { t } = useTranslation();

    return (
        <PageShell
            signal="indigo"
            eyebrow={t("navBar.meetBoard")}
            title={t("board.pageTitle", { defaultValue: "The people behind ESN Skövde" })}
            lead={t("board.pageLead", {
                defaultValue:
                    "Volunteers who study here too, and who run the events, the trips and the ESNcard desk. Say hello — we answer our own email.",
            })}
            seo={{
                title: t("navBar.meetBoard"),
                description: t("seo.pages.meetBoard.description"),
                keywords: t("seo.pages.meetBoard.keywords"),
            }}
        >
            <MascotCard mascot={mascot} />
            <BoardGrid members={boardMembers} />
        </PageShell>
    );
};

export default Board;
