import { useState, useEffect, Fragment } from "react";
import { useGameStore } from "../stores/useGameStore";
import { useProgressStore } from "../stores/useProgressStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { debugArray, setDebugValue } from "../utils/game";
import { audioCache, spriteCache } from "../utils/assets";

export default function DebugPanel() {
  const game = useGameStore();
  const progress = useProgressStore();
  const settings = useSettingsStore();
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!settings.debugMode) return;

    const interval = setInterval(() => forceTick((t) => t + 1), 100);

    return () => clearInterval(interval);
  }, [settings.debugMode]);

  if (!settings.debugMode) return null;

  const pushStore = (prefix: string, state: Record<string, unknown>) => {
    Object.entries(state).forEach(([key, value]) => {
      if (typeof value !== "function") {
        setDebugValue(`${prefix}.${key}`, value);
      }
    });
  };

  pushStore("store.game", game);
  pushStore("store.progress", progress);
  pushStore("store.settings", settings);
  setDebugValue("cache.audio.size", audioCache.size);
  setDebugValue("cache.sprite.size", spriteCache.size);

  return (
    <div className="pointer-events-none fixed top-4 left-4 z-50 max-w-md font-mono text-sm leading-none">
      <p className="mb-[1lh]">DEBUG</p>
      <div className="grid grid-cols-[max-content_1fr] gap-x-4 break-all">
        {Object.entries(debugArray).map(([key, value]) => (
          <Fragment key={key}>
            <span>{key}</span>
            <span>{String(value)}</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
