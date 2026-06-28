import { useState, useEffect } from "react";
import { useGameStore } from "../stores/useGameStore";

import Menu from "../scenes/Menu";
import Game from "../scenes/Game";
import Stats from "../scenes/Stats";
import About from "../scenes/About";
import TooSmall from "../scenes/TooSmall";

export default function SceneManager() {
  const scene = useGameStore((state) => state.scene);
  const [gameKey, setGameKey] = useState(0);
  const [isTooSmall, setIsTooSmall] = useState(window.innerWidth < 576);

  useEffect(() => {
    const handleResize = () => setIsTooSmall(window.innerWidth < 576);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isTooSmall && <TooSmall />}
      {scene === "menu" && <Menu />}
      {scene === "game" && (
        <Game
          key={gameKey}
          onRestart={() => setGameKey((k) => k + 1)}
          isTooSmall={isTooSmall}
        />
      )}
      {scene === "stats" && <Stats />}
      {scene === "about" && <About />}
    </>
  );
}
