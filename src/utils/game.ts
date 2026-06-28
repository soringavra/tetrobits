import tetrobitsImageUrl from "../assets/sprites/tetrobits.png";
import boardImageUrl from "../assets/sprites/board.png";
import cellsImageUrl from "../assets/sprites/cells.png";
import panelSmallImageUrl from "../assets/sprites/panel_small.png";
import panelMediumImageUrl from "../assets/sprites/panel_medium.png";
import panelLargeImageUrl from "../assets/sprites/panel_large.png";

export const ASSETS = {
  tetrobits: new Image(),
  board: new Image(),
  cells: new Image(),
  panelSmall: new Image(),
  panelMedium: new Image(),
  panelLarge: new Image(),
};

ASSETS.tetrobits.src = tetrobitsImageUrl;
ASSETS.board.src = boardImageUrl;
ASSETS.cells.src = cellsImageUrl;
ASSETS.panelSmall.src = panelSmallImageUrl;
ASSETS.panelMedium.src = panelMediumImageUrl;
ASSETS.panelLarge.src = panelLargeImageUrl;

const TIPS = [
  "PRESS [ESC] OR [P] TO PAUSE AND RESUME THE GAME.",
  "REACH LEVEL 5 TO UNLOCK FRENZY MODE.",
  "CLEARING MULTIPLE LINES AT ONCE SCORES SIGNIFICANTLY MORE POINTS.",
  "HARD DROP WITH [SPACE] TO PLACE PIECES INSTANTLY AND EARN BONUS POINTS.",
  "IN FRENZY MODE, CLEARING LINES ADDS TIME BACK TO THE CLOCK.",
  "FRENZY MODE COSTS 10 BITS TO PLAY. SPEND THEM WISELY.",
];

export const SCORE_TABLE = [0, 20, 50, 100, 250];
export const XP_TABLE = [
  10, 25, 50, 80, 120, 180, 250, 500, 800, 1500, 2400, 3500, 5000, 6800, 9000,
];
export const DROP_INTERVAL_CLASSIC = 800;
export const DROP_INTERVAL_FRENZY = 500;

export const SPRITE_SIZE = 16;
export const PIXEL_SCALE = 2;

export type Scene = "menu" | "game" | "stats" | "about";
export type GameMode = "classic" | "frenzy";
export type SoundMode = 0 | 1 | 2;

export type GameState = {
  scene: Scene;
  gameMode: GameMode;
  xp: number;
  level: number;
  bits: number;
  score: number;
  highScore: number;
  lines: number;
  soundMode: SoundMode;
  modal: Modal;
  set: (
    updater: Partial<GameState> | ((state: GameState) => Partial<GameState>),
  ) => void;
  reset: () => void;
  resetProgress: () => void;
};

export type Modal = {
  title: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
} | null;

export const initialGlobalState = {
  highScore: 0,
  xp: 0,
  level: 1,
  bits: 0,
  soundMode: 1 as SoundMode,
  modal: null,
};

export const initialLocalState = {
  score: 0,
  lines: 0,
};

export const calculateXp = (
  score: number,
  level: number,
  gameMode: GameMode,
) => {
  if (score < 100) return 0;

  const scorePerPoint = gameMode === "frenzy" ? 100 - level * 3 : 100;
  const base = Math.floor(score / scorePerPoint);
  const multiplier = 1 + (level - 1) * 0.1;

  return Math.max(1, Math.floor(base * multiplier));
};

export const getRandomTip = () => TIPS[Math.floor(Math.random() * TIPS.length)];

export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");

  return `${m}:${s}`;
};
