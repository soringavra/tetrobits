import { useGameStore } from "../../stores/useGameStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { formatBitLabel } from "../../utils/game";

import Button from "../ui/Button";

export default function BoardUIOverlay({
  isStarted,
  isPaused,
  gameOver,
  xpEarned,
  bitsEarned,
  timer,
}: {
  isStarted: boolean;
  isPaused: boolean;
  gameOver: boolean;
  xpEarned: number;
  bitsEarned: number;
  timer: number;
}) {
  const setScene = useGameStore((state) => state.setScene);
  const setGameMode = useSettingsStore((state) => state.setGameMode);

  const startOverlay = (
    <>
      <p>PRESS [SPACE] TO START THE GAME</p>
      <Button onClick={() => setScene("menu")}>MENU</Button>
    </>
  );

  const pausedOverlay = (
    <>
      <p>PAUSED!</p>
      <p>PRESS [ESC] OR [P] TO RESUME GAME</p>
      <Button
        onClick={() => {
          setGameMode("classic");
          setScene("menu");
        }}
      >
        MENU
      </Button>
    </>
  );

  const gameOverOverlay = (
    <>
      {timer === 0 ? <p>TIME'S UP!</p> : <p>GAME OVER!</p>}
      <div>
        <p>YOU GOT:</p>
        <p>{xpEarned} XP</p>
        <p>{formatBitLabel(bitsEarned)}</p>
      </div>
      <p>PRESS [R] TO PLAY AGAIN</p>
      <Button
        onClick={() => {
          setGameMode("classic");
          setScene("menu");
        }}
      >
        MENU
      </Button>
    </>
  );

  return (
    <div className="absolute inset-1 grid place-items-center bg-black/80 p-4 leading-7">
      <div className="flex flex-col items-center gap-[1lh] text-center">
        {!isStarted && startOverlay}
        {isPaused && pausedOverlay}
        {gameOver && gameOverOverlay}
      </div>
    </div>
  );
}
