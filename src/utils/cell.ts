import { useSettingsStore } from "../stores/useSettingsStore";
import { SPRITES, getSprite } from "./assets";

export const CELL_SIZE = 16;

export type CellProps = {
  type: number | null;
  hasBit: boolean;
  x: number;
  y: number;
};

export const drawCell = (
  ctx: CanvasRenderingContext2D,
  type: number | null,
  hasBit: boolean,
  x: number,
  y: number,
) => {
  const pixelScale = useSettingsStore.getState().pixelScale;

  const cellsImage = getSprite(SPRITES.cells);

  if (type === null) return;

  ctx.drawImage(
    cellsImage,
    type * CELL_SIZE,
    hasBit ? CELL_SIZE : 0,
    CELL_SIZE,
    CELL_SIZE,
    x * CELL_SIZE * pixelScale,
    y * CELL_SIZE * pixelScale,
    CELL_SIZE * pixelScale,
    CELL_SIZE * pixelScale,
  );
};
