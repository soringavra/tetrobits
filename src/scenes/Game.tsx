import { useState, useEffect, useRef, useCallback } from "react";
import { useGameStore } from "../stores/useGameStore";
import {
  SCORE_TABLE,
  XP_TABLE,
  DROP_INTERVAL_CLASSIC,
  DROP_INTERVAL_FRENZY,
  calculateXp,
  formatTime,
} from "../utils/game";
import {
  type PieceProps,
  type BoardProps,
  createEmptyBoard,
  getRandomPiece,
  rotateWithKick,
  isValidMove,
  mergePiece,
  clearLines,
  getDropInterval,
} from "../utils/board";
import {
  playTrack,
  switchTrack,
  playSound,
  pauseAllTracks,
  resumeAllTracks,
  stopAllTracks,
} from "../utils/audio";
import { cn } from "../utils/cn";

import Board from "../components/Board";
import Panel from "../components/Panel";
import NextPiece from "../components/NextPiece";
import Button from "../components/Button";

export default function Game({
  onRestart,
  isTooSmall,
}: {
  onRestart: () => void;
  isTooSmall: boolean;
}) {
  const { gameMode, level, bits, score, highScore, set, reset } =
    useGameStore();

  const [board, setBoard] = useState<BoardProps>(createEmptyBoard);
  const [piece, setPiece] = useState<PieceProps>(getRandomPiece);
  const [nextPiece, setNextPiece] = useState<PieceProps>(getRandomPiece);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [resumeCountdown, setResumeCountdown] = useState<number | null>(null);
  const [xpGained, setXpGained] = useState(0);

  const pieceRef = useRef(piece);
  pieceRef.current = piece;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const timeLeftClass = cn(
    !gameOver && timeLeft <= 15 && timeLeft > 5 && "animate-blink",
    !gameOver && timeLeft <= 5 && "animate-blink-fast",
  );

  const pauseButtonClass = cn(
    (!started || gameOver) && "pointer-events-none invisible",
  );

  const getXp = () => {
    const gained = calculateXp(score, level, gameMode);

    set((state) => {
      let newXp = state.xp + gained;
      let newLevel = state.level;

      while (newXp >= XP_TABLE[newLevel - 1] && newLevel <= XP_TABLE.length) {
        newXp -= XP_TABLE[newLevel - 1];
        newLevel++;

        set({
          modal: {
            title: "LEVEL UP!",
            content: (
              <>
                <p>YOU ARE NOW LEVEL {newLevel}!</p>
                {newLevel === 5 && <p>UNLOCKED: FRENZY MODE</p>}
              </>
            ),
            actions: <Button label="OK" onClick={() => set({ modal: null })} />,
          },
        });
      }

      return { xp: newXp, level: newLevel };
    });
  };

  const gameOverHandler = () => {
    setGameOver(true);

    const gained = calculateXp(score, level, gameMode);

    setXpGained(gained);
    getXp();

    set((state) => ({
      highScore: state.score > state.highScore ? state.score : state.highScore,
    }));

    playSound("lose");
    stopAllTracks();
  };

  const lock = useCallback(
    (currentPiece: PieceProps, currentBoard: BoardProps) => {
      const merged = mergePiece(currentPiece, currentBoard);
      const {
        board: cleared,
        cleared: lines,
        bitsCollected,
      } = clearLines(merged);

      setBoard(cleared);

      if (!isValidMove(cleared, nextPiece.shape, nextPiece.x, nextPiece.y)) {
        gameOverHandler();

        return;
      }

      setPiece(nextPiece);
      setNextPiece(getRandomPiece());

      if (lines > 0) {
        set((state) => ({
          lines: state.lines + lines,
          score: state.score + SCORE_TABLE[lines],
          bits: state.bits + bitsCollected,
        }));

        if (gameMode === "frenzy") setTimeLeft((t) => t + lines * 5);

        playSound("line");
      }
    },
    [set, nextPiece],
  );

  const moveDown = useCallback(() => {
    const p = pieceRef.current;

    if (isValidMove(board, p.shape, p.x, p.y + 1)) {
      setPiece({ ...p, y: p.y + 1 });
    } else {
      lock(p, board);
    }
  }, [board, lock]);

  useEffect(() => {
    if (!started || gameOver || isPaused || resumeCountdown || isTooSmall)
      return;

    const baseDropInterval =
      gameMode === "frenzy" ? DROP_INTERVAL_FRENZY : DROP_INTERVAL_CLASSIC;

    intervalRef.current = setInterval(
      moveDown,
      getDropInterval(score, baseDropInterval),
    );

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    moveDown,
    started,
    gameOver,
    isPaused,
    resumeCountdown,
    isTooSmall,
    score,
    gameMode,
  ]);

  const togglePauseState = useCallback(() => {
    if (!started || gameOver || isTooSmall) return;

    if (resumeCountdown !== null) {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

      pauseAllTracks();
      setResumeCountdown(null);
      setIsPaused(true);

      return;
    }

    if (isPaused) {
      setResumeCountdown(3);

      return;
    }

    pauseAllTracks();
    setIsPaused(true);
  }, [started, gameOver, isPaused, resumeCountdown, isTooSmall]);

  const togglePause = useCallback(
    (e: KeyboardEvent) => {
      if (!started || gameOver) return;

      if (e.key === "Escape" || e.key === "p" || e.key === "P") {
        e.preventDefault();
        togglePauseState();
      }
    },
    [started, gameOver, togglePauseState],
  );

  useEffect(() => {
    window.addEventListener("keydown", togglePause);

    return () => window.removeEventListener("keydown", togglePause);
  }, [togglePause]);

  useEffect(() => {
    if (!started || gameOver) return;

    if (isTooSmall && !isPaused) {
      setIsPaused(true);
    }
  }, [isTooSmall, started, gameOver, isPaused]);

  useEffect(() => {
    if (resumeCountdown === null) return;

    countdownTimerRef.current = setInterval(() => {
      setResumeCountdown((prev) => {
        if (prev && prev > 1) {
          return prev - 1;
        }

        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

        setIsPaused(false);

        return null;
      });
    }, 1000);

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [resumeCountdown]);

  useEffect(() => {
    if (!started || gameOver) return;

    if (isPaused || resumeCountdown !== null) {
      pauseAllTracks();

      return;
    }

    resumeAllTracks();
  }, [isPaused, resumeCountdown, started, gameOver]);

  useEffect(() => {
    if (!started || gameOver || isPaused || isTooSmall) return;

    const handleKey = (e: KeyboardEvent) => {
      const letterKey = e.key.toLowerCase();
      const piece = pieceRef.current;

      if (e.key === " ") e.preventDefault();

      if (letterKey === "a" || e.key === "ArrowLeft") {
        if (isValidMove(board, piece.shape, piece.x - 1, piece.y))
          setPiece({ ...piece, x: piece.x - 1 });
      } else if (letterKey === "d" || e.key === "ArrowRight") {
        if (isValidMove(board, piece.shape, piece.x + 1, piece.y))
          setPiece({ ...piece, x: piece.x + 1 });
      } else if (letterKey === "s" || e.key === "ArrowDown") {
        moveDown();
      } else if (letterKey === "w" || e.key === "ArrowUp") {
        const kicked = rotateWithKick(board, piece);

        if (kicked) setPiece(kicked);
      } else if (e.key === " ") {
        let y = piece.y;

        while (isValidMove(board, piece.shape, piece.x, y + 1)) y++;

        set((state) => ({ score: state.score + y - piece.y }));

        lock({ ...piece, y }, board);

        playSound("hit");
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [board, moveDown, lock, started, gameOver, isPaused]);

  useEffect(() => {
    if (
      gameMode !== "frenzy" ||
      !started ||
      gameOver ||
      isPaused ||
      resumeCountdown !== null ||
      isTooSmall
    )
      return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t < 1) {
          gameOverHandler();

          return 0;
        }

        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameMode, started, gameOver, isPaused, resumeCountdown, isTooSmall]);

  useEffect(() => {
    if (useGameStore.getState().score >= 5000) {
      switchTrack("fast");
    }
  }, [score]);

  useEffect(() => {
    if (!gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r") {
        if (gameMode === "frenzy") {
          if (bits - 10 < 0) {
            set({
              modal: {
                title: "NOT ENOUGH BITS!",
                content: "YOU NEED AT LEAST 10 BITS TO PLAY FRENZY MODE.",
                actions: (
                  <Button
                    label="OK"
                    onClick={() => {
                      set({ modal: null });
                    }}
                  />
                ),
              },
            });

            return;
          }

          set((state) => ({ bits: state.bits - 10 }));
        }

        onRestart();
        window.removeEventListener("keydown", handleKeyDown);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    stopAllTracks();
    reset();

    if (isTooSmall) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== " ") return;

      setStarted(true);

      if (gameMode === "classic") playTrack("slow");
      else playTrack("fast");

      window.removeEventListener("keydown", handleKeyDown);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      stopAllTracks();
    };
  }, []);

  return (
    <div className="flex gap-4 md:gap-8">
      <div className="hidden md:block">
        <Button
          onClick={togglePauseState}
          icon="pause"
          className={pauseButtonClass}
        />
      </div>
      <Board
        board={board}
        piece={piece}
        started={started}
        gameOver={gameOver}
        isPaused={isPaused}
        resumeCountdown={resumeCountdown}
        gameMode={gameMode}
        xpGained={xpGained}
      />
      <div className="flex flex-col gap-4">
        <div className="block md:hidden">
          <Button
            onClick={togglePauseState}
            icon="pause"
            className={pauseButtonClass}
          />
        </div>
        <Panel variant="medium">
          <p className="mb-2">NEXT UP:</p>
          <NextPiece piece={nextPiece} started={started} />
        </Panel>
        {gameMode === "frenzy" && (
          <Panel>
            <p className={timeLeftClass}>TIME:</p>
            <p className={timeLeftClass}>{formatTime(timeLeft)}</p>
          </Panel>
        )}
        <Panel>
          <p>SCORE:</p>
          <p>{score}</p>
        </Panel>
        <Panel>
          <p>BEST:</p>
          <p>{highScore}</p>
        </Panel>
        <Panel>
          <p>BITS:</p>
          <p>{bits}</p>
        </Panel>
      </div>
    </div>
  );
}
