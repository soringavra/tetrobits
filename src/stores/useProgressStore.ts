import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProgressState = {
  xp: number;
  level: number;
  bits: number;
  highScore: number;
  upgradeLevels: Record<string, number>; // { id: level }
  totalGames: number;
  totalLines: number;
};

type ProgressActions = {
  setXp: (xp: number) => void;
  setLevel: (level: number) => void;
  setBits: (bits: number) => void;
  setHighScore: (highScore: number) => void;
  setUpgradeLevel: (id: string, level: number) => void;
  setTotalGames: (totalGames: number) => void;
  setTotalLines: (totalLines: number) => void;
  set: (
    updater:
      | Partial<ProgressState>
      | ((state: ProgressState) => Partial<ProgressState>),
  ) => void;
  reset: () => void;
};

const initialState: ProgressState = {
  xp: 0,
  level: 1,
  bits: 0,
  highScore: 0,
  upgradeLevels: {},
  totalGames: 0,
  totalLines: 0,
};

export const useProgressStore = create<ProgressState & ProgressActions>()(
  persist(
    (set) => ({
      ...initialState,
      setXp: (xp) => set({ xp }),
      setLevel: (level) => set({ level }),
      setBits: (bits) => set({ bits }),
      setHighScore: (highScore) => set({ highScore }),
      setUpgradeLevel: (id, level) =>
        set((state) => ({
          upgradeLevels: { ...state.upgradeLevels, [id]: level },
        })),
      setTotalGames: (totalGames) => set({ totalGames }),
      setTotalLines: (totalLines) => set({ totalLines }),
      set: (updater) =>
        set((state) =>
          typeof updater === "function" ? updater(state) : updater,
        ),
      reset: () => set(initialState),
    }),
    {
      name: "tetrobits-progress",
    },
  ),
);
