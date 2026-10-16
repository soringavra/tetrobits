import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GameMode = "classic" | "frenzy";

export type SettingsState = {
  music: boolean;
  sfx: boolean;
  mouseInput: boolean;
  showFrenzyModeDialog: boolean;
  gameMode: GameMode;
  pixelScale: number;
  debugMode: boolean;
};

type SettingsActions = {
  setMusic: (music: boolean) => void;
  setSfx: (sfx: boolean) => void;
  setMouseInput: (mouseInput: boolean) => void;
  setShowFrenzyModeDialog: (showFrenzyModeDialog: boolean) => void;
  setGameMode: (gameMode: GameMode) => void;
  setPixelScale: (pixelScale: number) => void;
  setDebugMode: (debugMode: boolean) => void;
  set: (
    updater:
      | Partial<SettingsState>
      | ((state: SettingsState) => Partial<SettingsState>),
  ) => void;
  reset: () => void;
};

const initialState: SettingsState = {
  music: true,
  sfx: true,
  mouseInput: true,
  showFrenzyModeDialog: true,
  gameMode: "classic",
  pixelScale: 2,
  debugMode: false,
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...initialState,
      setMusic: (music) => set({ music }),
      setSfx: (sfx) => set({ sfx }),
      setMouseInput: (mouseInput) => set({ mouseInput }),
      setShowFrenzyModeDialog: (showFrenzyModeDialog) =>
        set({ showFrenzyModeDialog }),
      setGameMode: (gameMode) => set({ gameMode }),
      setPixelScale: (pixelScale) => set({ pixelScale }),
      setDebugMode: (debugMode) => set({ debugMode }),
      set: (updater) =>
        set((state) =>
          typeof updater === "function" ? updater(state) : updater,
        ),
      reset: () => set(initialState),
    }),
    {
      name: "tetrobits-settings",
      partialize: (state) => {
        const { showFrenzyModeDialog, gameMode, ...rest } = state;

        return rest;
      },
    },
  ),
);
