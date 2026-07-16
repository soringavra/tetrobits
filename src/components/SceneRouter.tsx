import { type Scene, useGameStore } from "../stores/useGameStore";

import Loading from "../scenes/Loading";
import Menu from "../scenes/Menu";
import Game from "../scenes/Game";
import Upgrades from "../scenes/Upgrades";
import Stats from "../scenes/Stats";
import About from "../scenes/About";
import Settings from "../scenes/Settings";

export const SCENES: Record<Scene, React.ReactNode> = {
  loading: <Loading />,
  menu: <Menu />,
  game: <Game />,
  upgrades: <Upgrades />,
  stats: <Stats />,
  about: <About />,
  settings: <Settings />,
};

export default function SceneRouter() {
  const scene = useGameStore((state) => state.scene);

  return <div>{SCENES[scene]}</div>;
}
