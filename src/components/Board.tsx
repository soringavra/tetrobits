import { useEffect, useRef } from "react";
import { useGameStore } from "../stores/useGameStore";
import { type GameMode, ASSETS } from "../utils/game";
import {
  type PieceProps,
  type BoardProps,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BOARD_COLS,
  BOARD_ROWS,
  drawCell,
  renderGhostPiece,
} from "../utils/board";

import BoardOverlay from "./BoardOverlay";
import Button from "./Button";

export default function Board({
  board,
  piece,
  started,
  gameOver,
  isPaused,
  resumeCountdown,
  gameMode,
  xpGained,
}: {
  board: BoardProps;
  piece: PieceProps;
  gameMode: GameMode;
  started: boolean;
  gameOver: boolean;
  isPaused: boolean;
  resumeCountdown: number | null;
  xpGained: number;
}) {
  const { set } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const draw = () => {
      ctx.drawImage(ASSETS.board, 0, 0, BOARD_WIDTH, BOARD_HEIGHT);

      if (!started) return;

      if (!gameOver) renderGhostPiece(ctx, board, piece);

      for (let i = 0; i < BOARD_ROWS; i++)
        for (let j = 0; j < BOARD_COLS; j++)
          drawCell(ctx, board[i][j].type, board[i][j].bits, j, i);

      piece.shape.forEach((row, y) =>
        row.forEach((cell, x) => {
          if (cell)
            drawCell(
              ctx,
              piece.type,
              piece.bitsMap[y][x],
              piece.x + x,
              piece.y + y,
            );
        }),
      );
    };

    if (ASSETS.board.complete) {
      draw();
    } else {
      ASSETS.board.onload = draw;
    }
  }, [board, piece, started, gameOver]);

  return (
    <div className="relative">
      {!started && (
        <BoardOverlay>
          <p>PRESS [SPACE] TO START</p>
          <Button onClick={() => set({ scene: "menu" })} label="MENU" />
        </BoardOverlay>
      )}
      {gameOver && (
        <BoardOverlay className="flex flex-col gap-8">
          <p>GAME OVER!</p>
          <p>XP GAINED: {xpGained}</p>
          <p>PRESS [R] TO PLAY AGAIN {gameMode === "frenzy" && "(-10 BITS)"}</p>
          <Button onClick={() => set({ scene: "menu" })} label="MENU" />
        </BoardOverlay>
      )}
      {isPaused && !resumeCountdown && (
        <BoardOverlay>
          <p>PAUSED!</p>
          <p>PRESS [ESC] OR [P] TO RESUME</p>
          <Button onClick={() => set({ scene: "menu" })} label="MENU" />
        </BoardOverlay>
      )}
      {resumeCountdown && <BoardOverlay>{resumeCountdown}</BoardOverlay>}
      <canvas ref={canvasRef} width={BOARD_WIDTH} height={BOARD_HEIGHT} />
    </div>
  );
}
