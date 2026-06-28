import { useEffect, useRef } from "react";
import { SPRITE_SIZE, PIXEL_SCALE } from "../utils/game";
import { type PieceProps, trimShapeMatrix, drawCell } from "../utils/board";

const PREVIEW_SIZE = SPRITE_SIZE * 4 * PIXEL_SCALE;

export default function NextPiece({
  piece,
  started,
}: {
  piece: PieceProps;
  started: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

    if (!started) return;

    const shape = trimShapeMatrix(piece.shape);

    shape.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell) drawCell(ctx, piece.type, piece.bitsMap[y][x], x, y, 0);
      }),
    );
  }, [piece, started]);

  return (
    <canvas
      ref={canvasRef}
      width={PREVIEW_SIZE}
      height={PREVIEW_SIZE}
      style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
    />
  );
}
