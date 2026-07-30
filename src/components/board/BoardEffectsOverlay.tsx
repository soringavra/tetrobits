import { useSettingsStore } from "../../stores/useSettingsStore";
import { CELL_SIZE } from "../../utils/cell";
import { cn } from "../../utils/cn";

export default function BoardEffectsOverlay({
  rows,
  isClearingRows,
}: {
  rows: number[];
  isClearingRows: boolean;
}) {
  const gameMode = useSettingsStore((state) => state.gameMode);
  const pixelScale = useSettingsStore((state) => state.pixelScale);

  if (!isClearingRows) return null;

  return (
    <div className="absolute inset-1.25">
      {rows.map((row) => (
        <div
          key={row}
          className={cn(
            "absolute w-full bg-white",
            gameMode === "frenzy"
              ? "animate-line-flash-fast"
              : "animate-line-flash-slow",
          )}
          style={{
            height: `${CELL_SIZE * pixelScale}px`,
            top: `${CELL_SIZE * row * pixelScale}px`,
          }}
        />
      ))}
    </div>
  );
}
