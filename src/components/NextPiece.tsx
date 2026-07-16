import { useEffect, useRef } from "react";
import { useSettingsStore } from "../stores/useSettingsStore";
import { type PieceProps, trimShapeMatrix } from "../utils/board";
import { CELL_SIZE, drawCell } from "../utils/cell";

import Panel from "./ui/Panel";

function PiecePreviewCanvas({
  piece,
  isStarted,
}: {
  piece: PieceProps;
  isStarted: boolean;
}) {
  const pixelScale = useSettingsStore((state) => state.pixelScale);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const PREVIEW_SIZE = CELL_SIZE * 4 * pixelScale;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

    if (!isStarted) return;

    const shape = trimShapeMatrix(piece.shape);

    shape.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell) drawCell(ctx, piece.type, cell === 2, x, y);
      }),
    );
  }, [piece, isStarted, PREVIEW_SIZE]);

  return (
    <canvas
      ref={canvasRef}
      width={PREVIEW_SIZE}
      height={PREVIEW_SIZE}
      className="mb-2"
      style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
    />
  );
}

export default function NextPiece({
  pieces,
  isStarted,
}: {
  pieces: PieceProps[];
  isStarted: boolean;
}) {
  return (
    <Panel className="flex flex-col gap-2">
      <p>NEXT UP:</p>
      {pieces.map((piece, i) => (
        <PiecePreviewCanvas key={i} piece={piece} isStarted={isStarted} />
      ))}
    </Panel>
  );
}
