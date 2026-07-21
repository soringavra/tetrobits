import {
  type Scene,
  type ModalProps,
  useGameStore,
} from "../stores/useGameStore";
import { useProgressStore } from "../stores/useProgressStore";
import { type GameMode, useSettingsStore } from "../stores/useSettingsStore";
import { formatBitLabel } from "../utils/game";
import { SPRITES } from "../utils/assets";

import Button from "../components/ui/Button";

export const renderFrenzyModePrompt = ({
  inGame,
  level,
  bits,
  showFrenzyModeDialog,
  gameMode,
  setScene,
  setModal,
  setBits,
  setShowFrenzyModeDialog,
  setGameMode,
  onConfirm,
}: {
  inGame: boolean;
  level: number;
  bits: number;
  showFrenzyModeDialog: boolean;
  gameMode: GameMode;
  setScene: (scene: Scene) => void;
  setModal: (modal: ModalProps) => void;
  setBits: (bits: number) => void;
  setShowFrenzyModeDialog: (showFrenzyModeDialog: boolean) => void;
  setGameMode: (gameMode: GameMode) => void;
  onConfirm: () => void;
}) => {
  if (level < 5) {
    setModal({
      title: "LOCKED!",
      content: "YOU MUST REACH LEVEL 5 TO UNLOCK FRENZY MODE.",
      actions: <Button onClick={() => setModal(null)}>OK</Button>,
    });
  } else if (!inGame && gameMode === "frenzy") {
    setGameMode("frenzy");
    setScene("game");
  } else if (bits < 10) {
    setModal({
      title: "NOT ENOUGH BITS!",
      content: "YOU NEED AT LEAST 10 BITS TO PLAY FRENZY MODE.",
      actions: <Button onClick={() => setModal(null)}>OK</Button>,
    });
  } else {
    if (showFrenzyModeDialog)
      setModal({
        title: "PLAY FRENZY MODE?",
        content: (
          <>
            <p className="mb-[1lh]">SPEND 10 BITS TO ACCESS FRENZY MODE?</p>
            <p>YOU HAVE: {formatBitLabel(bits)}</p>
          </>
        ),
        actions: (
          <>
            <Button
              onClick={() => {
                setModal(null);
                setBits(bits - 10);
                setGameMode("frenzy");
                setScene("game");
                onConfirm();
              }}
            >
              YES
            </Button>
            <Button
              onClick={() => {
                setShowFrenzyModeDialog(false);
                setModal(null);
                setBits(bits - 10);
                setGameMode("frenzy");
                setScene("game");
                onConfirm();
              }}
            >
              YES, DON'T ASK AGAIN THIS SESSION
            </Button>
            <Button
              onClick={() => {
                setModal(null);
              }}
            >
              NO
            </Button>
          </>
        ),
        actionButtonDirection: "vertical",
      });
    else {
      setModal(null);
      setBits(bits - 10);
      setGameMode("frenzy");
      setScene("game");
      onConfirm();
    }
  }
};

export default function Menu() {
  const level = useProgressStore((state) => state.level);
  const bits = useProgressStore((state) => state.bits);
  const showFrenzyModeDialog = useSettingsStore(
    (state) => state.showFrenzyModeDialog,
  );
  const gameMode = useSettingsStore((state) => state.gameMode);
  const pixelScale = useSettingsStore((state) => state.pixelScale);
  const setScene = useGameStore((state) => state.setScene);
  const setModal = useGameStore((state) => state.setModal);
  const setBits = useProgressStore((state) => state.setBits);
  const setShowFrenzyModeDialog = useSettingsStore(
    (state) => state.setShowFrenzyModeDialog,
  );
  const setGameMode = useSettingsStore((state) => state.setGameMode);

  return (
    <div className="flex flex-col items-center gap-16">
      <img
        src={SPRITES.tetrobits}
        className="outline-3 outline-black"
        style={{ width: 132 * 2 * pixelScale }}
      />
      <div className="flex w-fit flex-col gap-4 *:w-full">
        <Button
          onClick={() => {
            setGameMode("classic");
            setScene("game");
          }}
        >
          CLASSIC
        </Button>
        <Button
          onClick={() =>
            renderFrenzyModePrompt({
              inGame: false,
              level,
              bits,
              showFrenzyModeDialog,
              gameMode,
              setScene,
              setModal,
              setBits,
              setShowFrenzyModeDialog,
              setGameMode,
              onConfirm: () => {},
            })
          }
          variant={level < 5 ? "disabled" : "normal"}
        >
          FRENZY
        </Button>
        <Button onClick={() => setScene("upgrades")}>UPGRADES</Button>
        <div className="flex gap-4">
          <Button onClick={() => setScene("stats")}>STATS</Button>
          <Button onClick={() => setScene("about")}>ABOUT</Button>
        </div>
        <Button onClick={() => setScene("settings")}>SETTINGS</Button>
      </div>
    </div>
  );
}
