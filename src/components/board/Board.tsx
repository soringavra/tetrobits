import { useEffect, useRef } from "react";
import { useSettingsStore } from "../../stores/useSettingsStore";
import {
  type BoardProps,
  type PieceProps,
  BOARD_COLS,
  BOARD_ROWS,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  isValidMove,
} from "../../utils/board";
import { drawCell } from "../../utils/cell";
import { cn } from "../../utils/cn";

export default function Board({
  board,
  piece,
  isStarted,
  isClearingRows,
  onMoveCol,
  onClick,
  onRightClick,
  onWheel,
}: {
  board: BoardProps;
  piece: PieceProps;
  isStarted: boolean;
  isClearingRows: boolean;
  onMoveCol?: (col: number) => void;
  onClick?: () => void;
  onRightClick?: () => void;
  onWheel?: (deltaY: number) => void;
}) {
  const gameMode = useSettingsStore((state) => state.gameMode);
  const pixelScale = useSettingsStore((state) => state.pixelScale);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (!canvas || !onMoveCol) return;

    const rect = canvas.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;

    const rawCol = Math.floor((relativeX / rect.width) * BOARD_COLS);
    const col = Math.max(0, Math.min(BOARD_COLS - 1, rawCol));

    onMoveCol(col);
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    onRightClick?.();
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    onWheel?.(event.deltaY);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.fillRect(0, 0, BOARD_WIDTH * pixelScale, BOARD_HEIGHT * pixelScale);

    for (let i = 0; i < BOARD_ROWS; i++) {
      for (let j = 0; j < BOARD_COLS; j++) {
        drawCell(ctx, board[i][j].type, board[i][j].hasBit, j, i);
      }
    }

    if (isStarted && !isClearingRows) {
      let ghostY = piece.y;

      while (isValidMove(board, piece.shape, piece.x, ghostY + 1)) {
        ghostY++;
      }

      piece.shape.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
          if (cell !== 0) {
            drawCell(ctx, 7, false, piece.x + cIdx, ghostY + rIdx);
          }
        });
      });

      if (piece && piece.type !== null) {
        piece.shape.forEach((row, i) => {
          row.forEach((cell, j) => {
            if (cell) {
              drawCell(ctx, piece.type, cell === 2, piece.x + j, piece.y + i);
            }
          });
        });
      }
    }
  }, [board, piece, isStarted, isClearingRows]);

  return (
    <canvas
      ref={canvasRef}
      width={BOARD_WIDTH * pixelScale}
      height={BOARD_HEIGHT * pixelScale}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      onWheel={handleWheel}
      className={cn(
        "border-gold border-2 bg-black p-0.75 outline-3 outline-black",
        isClearingRows &&
          (gameMode === "frenzy"
            ? "animate-border-flash-fast"
            : "animate-border-flash-slow"),
      )}
    />
  );
}
