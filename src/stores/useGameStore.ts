import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type GameState,
  initialGlobalState,
  initialLocalState,
} from "../utils/game";

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...initialLocalState,
      ...initialGlobalState,
      scene: "menu",
      gameMode: "classic",
      set: (updater) =>
        set((state) =>
          typeof updater === "function" ? updater(state) : updater,
        ),
      reset: () => set({ ...initialLocalState }),
      resetProgress: () => set({ ...initialGlobalState }),
    }),
    {
      name: "tetris",
      partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        bits: state.bits,
        highScore: state.highScore,
        soundMode: state.soundMode === 0 ? 0 : 1,
      }),
    },
  ),
);
