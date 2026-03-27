import { useContext, useEffect } from "react";
import GameContext from "./ContextApi/GameContext";

const ExportGamesToJson = () => {
    const { AllGames } = useContext(GameContext);

    useEffect(() => {
        const exportGames = async () => {
            const simplifiedGames = AllGames.map((game) => ({
                title_en: game.title?.en || "",
            }));

            const json = JSON.stringify(simplifiedGames, null, 2);

            if (import.meta.env.DEV) {
                // Download JSON only in dev mode
                const blob = new Blob([json], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "allGames.json";
                a.click();
                URL.revokeObjectURL(url);
            }
        };

        if (AllGames?.length) exportGames();
    }, [AllGames]);

    return null;
};

export default ExportGamesToJson;
