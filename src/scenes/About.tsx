import { useGameStore } from "../stores/useGameStore";
import { ASSETS } from "../utils/game";

import Button from "../components/Button";

import packageJson from "../../package.json";

export default function About() {
  const set = useGameStore((state) => state.set);

  const version = packageJson.version;
  const formattedVersion = version.endsWith(".0")
    ? version.slice(0, -2)
    : version;

  return (
    <div className="flex flex-col gap-10 leading-relaxed text-pretty">
      <img src={ASSETS.tetrobits.src} className="mb-4 w-md" />
      <p>
        TETROBITS IS A PIXEL ART GAME INSPIRED BY THE CLASSIC TETRIS&reg;,
        FEATURING THE ORIGINAL MECHANICS ALONGSIDE A PROGRESSION SYSTEM WITH
        LEVELING AND BITS, A COLLECTIBLE CURRENCY EARNED DURING GAMEPLAY AND
        SPENT TO ACCESS FRENZY MODE.
      </p>
      <p>
        &copy; 2026 SORIN GAVRA. ALL SPRITES AND CODE ARE MY OWN. TETRIS&reg; IS
        A REGISTERED TRADEMARK OF THE TETRIS COMPANY. MUSIC COMPOSED BY DAVID
        RENDA. SOUND EFFECTS GENERATED WITH JSFXR. PIXEL FONT BY PATRICK ADAMS
        (THEWOLFBUNNY64).
      </p>
      <p>VERSION {formattedVersion}</p>
      <div className="flex justify-between gap-4">
        <Button
          onClick={() => set({ scene: "menu" })}
          label="BACK"
          className="w-fit"
        />
        <a
          href="https://github.com/soringavra/tetrobits"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            icon="external"
            label="VIEW SOURCE ON GITHUB"
            className="w-fit"
          />
        </a>
      </div>
    </div>
  );
}
