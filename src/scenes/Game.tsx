import { useState, useEffect, useCallback, useRef } from "react";
import { useGameStore } from "../stores/useGameStore";
import { useProgressStore } from "../stores/useProgressStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import {
  LINE_CLEAR_DELAY_CLASSIC,
  LINE_CLEAR_DELAY_FRENZY,
} from "../hooks/useLineClearAnimation";
import { UPGRADES_BY_ID, getUpgradeTierInfo } from "./Upgrades";
import { renderFrenzyModePrompt } from "./Menu";
import {
  DROP_INTERVAL_CLASSIC,
  DROP_INTERVAL_FRENZY,
  XP_TABLE,
  LINES_TIME_MULTIPLIER,
  LEVEL_UP_MODAL_POPUP_DELAY,
  calculateDropInterval,
  calculateXpFromLines,
  formatTimer,
  setDebugValue,
} from "../utils/game";
import {
  type BoardProps,
  type PieceProps,
  createEmptyBoard,
  resetPieceHistory,
  getRandomPiece,
  isValidMove,
  rotateWithKick,
  mergePiece,
  getFullRowIndices,
  countBits,
  removeRows,
} from "../utils/board";
import {
  pauseTrack,
  playSfx,
  playTrack,
  resumeTrack,
  stopTrack,
} from "../utils/audio";
import { SFX, TRACKS } from "../utils/assets";
import { cn } from "../utils/cn";

import Board from "../components/board/Board";
import BoardEffectsOverlay from "../components/board/BoardEffectsOverlay";
import BoardMenuOverlay from "../components/board/BoardMenuOverlay";
import Panel from "../components/ui/Panel";
import Button from "../components/ui/Button";
import NextPiece from "../components/NextPiece";

export default function Game() {
  const bitLuckLevel = useProgressStore(
    (state) => state.upgradeLevels["bitLuck"] ?? 0,
  );
  const { currentValue: bitChance } = getUpgradeTierInfo(
    UPGRADES_BY_ID["bitLuck"],
    bitLuckLevel as number,
  );

  const [board, setBoard] = useState<BoardProps>(createEmptyBoard);
  const [{ initialPiece, initialQueue }] = useState(() => {
    resetPieceHistory();

    return {
      initialPiece: getRandomPiece(bitChance as number),
      initialQueue: [
        getRandomPiece(bitChance as number),
        getRandomPiece(bitChance as number),
      ],
    };
  });
  const [piece, setPiece] = useState<PieceProps>(initialPiece);
  const [pieceQueue, setPieceQueue] = useState<PieceProps[]>(initialQueue);
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [bitsEarned, setBitsEarned] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [clearedRows, setClearedRows] = useState<number[]>([]);

  const xp = useProgressStore((state) => state.xp);
  const level = useProgressStore((state) => state.level);
  const highScoreClassic = useProgressStore((state) => state.highScoreClassic);
  const highScoreFrenzy = useProgressStore((state) => state.highScoreFrenzy);
  const bits = useProgressStore((state) => state.bits);
  const totalLines = useProgressStore((state) => state.totalLines);
  const totalGames = useProgressStore((state) => state.totalGames);
  const showFrenzyModeDialog = useSettingsStore(
    (state) => state.showFrenzyModeDialog,
  );
  const gameMode = useSettingsStore((state) => state.gameMode);
  const setScene = useGameStore((state) => state.setScene);
  const setModal = useGameStore((state) => state.setModal);
  const setXp = useProgressStore((state) => state.setXp);
  const setLevel = useProgressStore((state) => state.setLevel);
  const setHighScoreClassic = useProgressStore(
    (state) => state.setHighScoreClassic,
  );
  const setHighScoreFrenzy = useProgressStore(
    (state) => state.setHighScoreFrenzy,
  );
  const setBits = useProgressStore((state) => state.setBits);
  const setTotalLines = useProgressStore((state) => state.setTotalLines);
  const setTotalGames = useProgressStore((state) => state.setTotalGames);
  const setShowFrenzyModeDialog = useSettingsStore(
    (state) => state.setShowFrenzyModeDialog,
  );
  const setGameMode = useSettingsStore((state) => state.setGameMode);

  const isClearingRows = clearedRows.length > 0;

  const hasNextTwoPreviewUpgrade = useProgressStore(
    (state) => state.upgradeLevels["nextTwoPreview"] ?? 0,
  );
  const previewCount = hasNextTwoPreviewUpgrade ? 2 : 1;

  const consumeNextPiece = () => {
    const [consumed, ...rest] = pieceQueue;

    setPieceQueue([...rest, getRandomPiece(bitChance as number)]);

    return consumed;
  };

  const resolveLock = useCallback(
    (lockedPiece: PieceProps) => {
      const merged = mergePiece(board, lockedPiece);
      const fullRows = getFullRowIndices(merged);
      const bitsFromLines = countBits(merged, fullRows);
      const newBoard =
        fullRows.length > 0 ? removeRows(merged, fullRows) : merged;
      const linesCleared = fullRows.length;

      if (linesCleared > 0) {
        setScore((prev) => prev + linesCleared * 10 + bitsFromLines * 5);
        setXpEarned((prev) => prev + calculateXpFromLines(linesCleared, level));
        setBitsEarned((prev) => prev + bitsFromLines);
        setTimer(
          (prev) => prev + LINES_TIME_MULTIPLIER[Math.min(linesCleared, 4) - 1],
        );
        setTotalLines(totalLines + linesCleared);
      }

      const spawned = pieceQueue[0];

      if (!isValidMove(newBoard, spawned.shape, spawned.x, spawned.y)) {
        setGameOver(true);
      } else {
        setPiece(consumeNextPiece());
      }

      setBoard(newBoard);
      setClearedRows([]);
    },
    [board, pieceQueue, level, setTotalLines],
  );

  const lockPiece = useCallback(
    (lockedPiece: PieceProps) => {
      const merged = mergePiece(board, lockedPiece);
      const fullRows = getFullRowIndices(merged);

      if (fullRows.length === 0) {
        resolveLock(lockedPiece);

        return;
      }

      setBoard(merged);
      setClearedRows(fullRows);
      playSfx(gameMode === "frenzy" ? SFX.lineFast : SFX.lineSlow);

      setTimeout(
        () => resolveLock(lockedPiece),
        gameMode === "frenzy"
          ? LINE_CLEAR_DELAY_FRENZY
          : LINE_CLEAR_DELAY_CLASSIC,
      );
    },
    [board, resolveLock],
  );

  const moveDown = useCallback(() => {
    if (isValidMove(board, piece.shape, piece.x, piece.y + 1)) {
      setPiece((prev) => ({ ...prev, y: prev.y + 1 }));
    } else {
      lockPiece(piece);
    }
  }, [board, piece, lockPiece]);

  const resetGame = useCallback(() => {
    resetPieceHistory();
    setBoard(createEmptyBoard);
    setPiece(getRandomPiece(bitChance as number));
    setPieceQueue([
      getRandomPiece(bitChance as number),
      getRandomPiece(bitChance as number),
    ]);
    setGameOver(false);
    setTimer(60);
    setScore(0);
    setXpEarned(0);
    setBitsEarned(0);
  }, []);

  const moveDownRef = useRef(moveDown);

  useEffect(() => {
    moveDownRef.current = moveDown;
  }, [moveDown]);

  useEffect(() => {
    if (!isStarted || isPaused || gameOver || isClearingRows) return;

    const interval = setInterval(
      () => moveDownRef.current(),
      calculateDropInterval(
        score,
        gameMode === "frenzy" ? DROP_INTERVAL_FRENZY : DROP_INTERVAL_CLASSIC,
      ),
    );

    return () => clearInterval(interval);
  }, [isStarted, isPaused, gameOver, board, isClearingRows, score, gameMode]);

  useEffect(() => {
    if (
      !isStarted ||
      isPaused ||
      gameOver ||
      isClearingRows ||
      gameMode !== "frenzy"
    )
      return;

    const interval = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted, isPaused, gameOver, isClearingRows, gameMode]);

  useEffect(() => {
    if (!gameOver) return;

    const prevLevel = level;
    let totalXp = xp + xpEarned;
    let newLevel = prevLevel;

    while (totalXp >= XP_TABLE[newLevel]) {
      totalXp -= XP_TABLE[newLevel];
      newLevel += 1;
    }

    setXp(totalXp);
    setLevel(newLevel);
    setBits(bits + bitsEarned);

    if (gameMode === "classic")
      setHighScoreClassic(Math.max(score, highScoreClassic));
    else setHighScoreFrenzy(Math.max(score, highScoreFrenzy));

    setTotalGames(totalGames + 1);

    playSfx(SFX.lose);
    stopTrack();

    let modalTimer = 0;

    if (newLevel > prevLevel) {
      modalTimer = setTimeout(() => {
        setModal({
          title: "LEVEL UP!",
          content: (
            <>
              <p>YOU ARE NOW LEVEL {newLevel}.</p>
              {newLevel === 5 && (
                <p className="mt-[1lh]">UNLOCKED: FRENZY MODE</p>
              )}
            </>
          ),
          actions: <Button onClick={() => setModal(null)}>OK</Button>,
        });

        playSfx(SFX.notification);
      }, LEVEL_UP_MODAL_POPUP_DELAY);
    }

    return () => {
      if (modalTimer) clearTimeout(modalTimer);
    };
  }, [gameOver]);

  useEffect(() => {
    if (timer === 0 && isStarted && !gameOver) setGameOver(true);
  }, [timer, isStarted, gameOver]);

  useEffect(() => {
    return () => stopTrack();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const letterKey = e.key.toLowerCase();

      if (e.key === "r" && gameOver) {
        if (gameMode === "frenzy") {
          renderFrenzyModePrompt({
            inGame: true,
            level,
            bits,
            showFrenzyModeDialog,
            gameMode,
            setScene,
            setModal,
            setBits,
            setShowFrenzyModeDialog,
            setGameMode,
            onConfirm: () => {
              resetGame();
              setIsStarted(false);
            },
          });
        } else {
          resetGame();
          setIsStarted(false);
        }
      } else if (e.key === " " && !isStarted) {
        setIsStarted(true);
        playTrack(gameMode === "frenzy" ? TRACKS.frenzy : TRACKS.classic);
      } else if (
        (letterKey === "p" || e.key === "Escape") &&
        isStarted &&
        !gameOver
      ) {
        const nextPaused = !isPaused;

        setIsPaused(nextPaused);

        if (nextPaused) {
          pauseTrack();
          playSfx(SFX.pause);
        } else {
          resumeTrack();
          playSfx(SFX.resume);
        }
      } else if (isStarted && !isPaused && !gameOver && !isClearingRows) {
        if (letterKey === "a" || e.key === "ArrowLeft") {
          if (isValidMove(board, piece.shape, piece.x - 1, piece.y)) {
            setPiece((prev) => ({ ...prev, x: prev.x - 1 }));
          }
        } else if (letterKey === "d" || e.key === "ArrowRight") {
          if (isValidMove(board, piece.shape, piece.x + 1, piece.y)) {
            setPiece((prev) => ({ ...prev, x: prev.x + 1 }));
          }
        } else if (letterKey === "s" || e.key === "ArrowDown") {
          moveDown();
        } else if (letterKey === "w" || e.key === "ArrowUp") {
          const rotated = rotateWithKick(board, piece);

          if (rotated) setPiece(rotated);
        } else if (e.key === " ") {
          let dropY = piece.y;

          while (isValidMove(board, piece.shape, piece.x, dropY + 1)) dropY++;

          setScore((prev) => prev + dropY - piece.y);
          lockPiece({ ...piece, y: dropY });
          playSfx(SFX.drop);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isStarted,
    isPaused,
    gameOver,
    isClearingRows,
    board,
    piece,
    bits,
    moveDown,
    lockPiece,
    resetGame,
  ]);

  setDebugValue("game.score", score);
  setDebugValue("game.xpEarned", xpEarned);
  setDebugValue("game.bitsEarned", bitsEarned);
  setDebugValue("game.isStarted", isStarted);
  setDebugValue("game.isPaused", isPaused);
  setDebugValue("game.gameOver", gameOver);
  setDebugValue("game.piece.x", piece.x);
  setDebugValue("game.piece.y", piece.y);
  setDebugValue("game.piece.type", piece.type);
  setDebugValue("game.nextPiece.type", pieceQueue[0].type);
  setDebugValue("game.clearedRows", JSON.stringify(clearedRows));
  setDebugValue("game.isClearingRows", String(isClearingRows));

  return (
    <div className="flex gap-6">
      <div className="relative">
        <Board
          board={board}
          piece={piece}
          isStarted={isStarted}
          isClearingRows={isClearingRows}
        />
        <BoardEffectsOverlay
          rows={clearedRows}
          isClearingRows={isClearingRows}
        />
        {(!isStarted || isPaused || gameOver) && (
          <BoardMenuOverlay
            isStarted={isStarted}
            isPaused={isPaused}
            gameOver={gameOver}
            xpEarned={xpEarned}
            bitsEarned={bitsEarned}
            timer={timer}
          />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <NextPiece
          pieces={pieceQueue.slice(0, previewCount)}
          isStarted={isStarted}
        />
        {gameMode === "frenzy" && (
          <Panel>
            <p>TIME:</p>
            <p
              className={cn(
                !gameOver &&
                  (timer <= 5
                    ? "animate-blink-fast"
                    : timer <= 15
                      ? "animate-blink-slow"
                      : ""),
              )}
            >
              {formatTimer(timer)}
            </p>
          </Panel>
        )}
        <Panel>
          <p>SCORE:</p>
          <p>{score}</p>
        </Panel>
        <Panel>
          <p>BEST:</p>
          <p>
            {Math.max(
              score,
              gameMode === "classic" ? highScoreClassic : highScoreFrenzy,
            )}
          </p>
        </Panel>
      </div>
    </div>
  );
}
