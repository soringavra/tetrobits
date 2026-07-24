import { Fragment } from "react";
import { useGameStore } from "../stores/useGameStore";
import { useProgressStore } from "../stores/useProgressStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import { XP_TABLE } from "../utils/game";
import { cn } from "../utils/cn";

import Panel from "../components/ui/Panel";
import Button from "../components/ui/Button";

export default function Stats() {
  const setScene = useGameStore((state) => state.setScene);
  const setModal = useGameStore((state) => state.setModal);
  const progress = useProgressStore();
  const resetProgress = useProgressStore((state) => state.reset);
  const resetSettings = useSettingsStore((state) => state.reset);

  const STATS: Record<string, unknown> = {
    "BEST SCORE CLASSIC": progress.highScoreClassic,
    "BEST SCORE FRENZY": progress.highScoreFrenzy,
    "XP": `${progress.xp}${progress.level < 25 ? `/${XP_TABLE[progress.level]}` : ""}`,
    "LEVEL": `${progress.level < 25 ? progress.level : `${progress.level} (MAX)`}`,
    "BITS": progress.bits,
    "GAMES PLAYED": progress.totalGames,
    "LINES CLEARED": progress.totalLines,
  };

  return (
    <div className="flex flex-col items-center">
      <p className="mb-16">STATS</p>
      <div className="mb-24 flex flex-col items-center gap-6">
        <Panel className="grid grid-cols-2 items-center p-0">
          {Object.entries(STATS).map(([key, value], i) => (
            <Fragment key={key}>
              <span className={cn("p-2", i % 2 && "bg-gold-dim")}>{key}:</span>
              <span className={cn("p-2", i % 2 && "bg-gold-dim")}>
                {String(value)}
              </span>
            </Fragment>
          ))}
        </Panel>
        <Button onClick={() => setScene("menu")}>BACK</Button>
      </div>
      <Button
        onClick={() =>
          setModal({
            title: "HOLD UP!",
            content:
              "ARE YOU SURE YOU WANT TO ERASE YOUR ENTIRE PROGRESS? THIS ACTION CANNOT BE UNDONE!",
            actions: (
              <>
                <Button
                  onClick={() => {
                    setModal(null);
                  }}
                >
                  CANCEL
                </Button>
                <Button
                  onClick={() => {
                    resetProgress();
                    resetSettings();
                    setModal(null);
                  }}
                  variant="danger"
                >
                  PROCEED
                </Button>
              </>
            ),
          })
        }
        variant="danger"
      >
        ERASE PROGRESS
      </Button>
    </div>
  );
}
