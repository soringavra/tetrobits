import { useSettingsStore } from "../stores/useSettingsStore";

export const DROP_INTERVAL_CLASSIC = 800;
export const DROP_INTERVAL_FRENZY = 500;

export const XP_TABLE = [
  0, // level 1 (default)
  100,
  250,
  500,
  800,
  1300,
  2100,
  3200,
  5000,
  7500,
  11_500,
  17_000,
  26_000,
  39_000,
  58_000,
  88_000,
  130_000,
  200_000,
  300_000,
  450_000,
  675_000,
  1_000_000,
  1_500_000,
  2_250_000,
  3_400_000, // level 25
];

const LINES_XP_MULTIPLIER = [1, 2.8, 5.2, 8.5];
export const LINES_TIME_MULTIPLIER = [1, 4, 10, 25];

export const LEVEL_UP_MODAL_POPUP_DELAY = 200; // ms

export const calculateDropInterval = (score: number, base: number) => {
  const level = Math.floor(score / 1000);

  return Math.max(100, base - level * 70);
};

export const calculateXpFromLines = (lines: number, level: number) => {
  const multiplier = LINES_XP_MULTIPLIER[Math.min(lines, 4) - 1];
  const levelBonus = 1 + (level - 1) * 0.1;
  const gameModeMultiplier =
    useSettingsStore.getState().gameMode === "frenzy" ? 1.1 : 1;

  return Math.round(multiplier * levelBonus * gameModeMultiplier);
};

export const formatTimer = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const formatBitLabel = (bits: number) => {
  return `${bits} ${bits === 1 ? "BIT" : "BITS"}`;
};

export const debugArray: Record<string, unknown> = {};

export const setDebugValue = (key: string, value: unknown) => {
  debugArray[key] = value;
};
