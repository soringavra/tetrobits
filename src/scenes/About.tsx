import { useGameStore } from "../stores/useGameStore";

import Button from "../components/ui/Button";

import { version } from "../../package.json";

export default function About() {
  const setScene = useGameStore((state) => state.setScene);

  const formatVersionString = version.endsWith(".0")
    ? version.slice(0, -2)
    : version;

  return (
    <div className="flex flex-col gap-16">
      <p className="text-center">ABOUT</p>
      <div className="flex flex-col gap-[1lh] leading-7 text-pretty">
        <p>
          TETROBITS IS A 2D PUZZLE GAME WHERE YOU STACK AND CLEAR FALLING PIECES
          TO SCORE POINTS. SOME PIECES CONTAIN SPECIAL BIT-BLOCKS. CLEARING THEM
          YIELDS BITS, A CURRENCY YOU CAN SPEND ON UPGRADES AND UNLOCKS,
          INCLUDING FRENZY MODE. THIS CHALLENGING GAME MODE INTRODUCES A TIMER,
          WITH PIECES FALLING AT A FASTER PACE. THE ONLY WAY TO ADD TIME BACK
          AND SURVIVE IS BY CLEARING LINES.
        </p>
        <p>
          MOVE PIECES WITH [W] [A] [S] [D] OR THE ARROW KEYS, ROTATE WITH [W] OR
          [UP], AND HARD DROP WITH [SPACE]. PRESS [ESC] OR [P] TO PAUSE.
        </p>
        <p>
          DESIGNED AND DEVELOPED BY SORIN GAVRA. SOUNDTRACK BY DAVID RENDA.
          SOUND EFFECTS BY SUBSPACEAUDIO, WITH ADDITIONAL GENERATED SFX VIA
          JSFXR. PIXEL FONT BY PATRICK ADAMS (THEWOLFBUNNY64).
        </p>
        <p>VERSION {formatVersionString}</p>
      </div>
      <div className="flex justify-between gap-4">
        <Button onClick={() => setScene("menu")}>BACK</Button>
        <a
          href="https://github.com/soringavra/tetrobits"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button>VIEW SOURCE ON GITHUB</Button>
        </a>
      </div>
    </div>
  );
}
