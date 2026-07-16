import { useState, useCallback } from "react";
import {
  type BoardProps,
  getFullRowIndices,
  countBits,
  removeRows,
} from "../utils/board";
import { useSettingsStore } from "../stores/useSettingsStore";

export const LINE_CLEAR_DELAY_CLASSIC = 300; // ms
export const LINE_CLEAR_DELAY_FRENZY = 200;

export function useLineClearAnimation(
  onCleared: (
    finalBoard: BoardProps,
    linesCleared: number,
    bitsFromLines: number,
  ) => void,
) {
  const [clearedRows, setClearedRows] = useState<number[]>([]);

  const startClearIfNeeded = useCallback(
    (mergedBoard: BoardProps) => {
      const fullRows = getFullRowIndices(mergedBoard);

      if (fullRows.length === 0) return false;

      const bitsFromLines = countBits(mergedBoard, fullRows);

      setClearedRows(fullRows);

      setTimeout(
        () => {
          const finalBoard = removeRows(mergedBoard, fullRows);

          onCleared(finalBoard, fullRows.length, bitsFromLines);
          setClearedRows([]);
        },
        useSettingsStore.getState().gameMode === "frenzy"
          ? LINE_CLEAR_DELAY_FRENZY
          : LINE_CLEAR_DELAY_CLASSIC,
      );

      return true;
    },
    [onCleared],
  );

  return {
    isClearingRows: clearedRows.length > 0,
    clearedRows,
    startClearIfNeeded,
  };
}
