import { useContext, useEffect } from "react";
import GameContext from "../ContextApi/GameContext";

export default function PrefetchGames() {
  const { AllGames } = useContext(GameContext);

  useEffect(() => {
    if (!AllGames) return;

    AllGames.forEach((gameData) => {
      const baseUrl = gameData.gameUrl.replace(/\/$/, ""); // remove trailing slash

      // Create prefetch links dynamically
      const urls = [
        `${baseUrl}/Build/game.data.br`,
        `${baseUrl}/Build/game.wasm.br`,
        `${baseUrl}/Build/game.framework.js.br`,
        `${baseUrl}/Build/game.loader`,
      ];

      urls.forEach((u) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = u;
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      });
    });
  }, [AllGames]);

  return null; // nothing to render
}