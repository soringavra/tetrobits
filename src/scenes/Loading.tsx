import { useState, useEffect } from "react";
import {
  ASSETS,
  preloadAudio,
  preloadFont,
  preloadSprite,
} from "../utils/assets";
import { useGameStore } from "../stores/useGameStore";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Loading() {
  const [ready, setReady] = useState(false);
  const setScene = useGameStore((state) => state.setScene);

  useEffect(() => {
    Promise.all([
      ...ASSETS.audio.map(preloadAudio),
      ...ASSETS.fonts.map((f) => preloadFont(f.family, f.url)),
      ...ASSETS.sprites.map(preloadSprite),

      wait(200),
    ]).then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) setScene("menu");
  }, [ready, setScene]);

  if (!ready) return <p>LOADING ASSETS...</p>;

  return null;
}
