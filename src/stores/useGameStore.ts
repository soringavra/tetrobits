import { create } from "zustand";

export type Scene =
  "loading" | "menu" | "game" | "upgrades" | "stats" | "about" | "settings";

export type ModalProps = {
  title: string;
  content: React.ReactNode;
  actions: React.ReactNode;
  actionButtonDirection?: "horizontal" | "vertical";
} | null;

type GameState = {
  scene: Scene;
  modal: ModalProps;
  setScene: (scene: Scene) => void;
  setModal: (modal: ModalProps) => void;
};

export const useGameStore = create<GameState>((set) => ({
  scene: "loading",
  modal: null,
  setScene: (scene) => set({ scene }),
  setModal: (modal) => set({ modal }),
}));
