import { useState, useEffect } from "react";
import { useGameStore } from "../stores/useGameStore";
import { type SoundMode, ASSETS, getRandomTip } from "../utils/game";
import { playTrack, stopTrack } from "../utils/audio";

import Button from "../components/Button";

export default function Menu() {
  const { level, bits, soundMode } = useGameStore();
  const set = useGameStore((state) => state.set);
  const [tip] = useState(getRandomTip);

  const isFrenzyLocked = level < 5;

  useEffect(() => {
    if (soundMode === 2) {
      playTrack("about");
    } else {
      stopTrack("about");
    }
  }, [soundMode]);

  return (
    <div className="flex flex-col items-center gap-16">
      <img src={ASSETS.tetrobits.src} className="w-md" />
      <div className="flex w-fit flex-col gap-5.5">
        <Button
          onClick={() => set({ gameMode: "classic", scene: "game" })}
          label="CLASSIC"
        />
        <Button
          onClick={() => {
            if (isFrenzyLocked) {
              set({
                modal: {
                  title: "LOCKED!",
                  content:
                    "YOU MUST BE AT LEAST LEVEL 5 TO UNLOCK FRENZY MODE.",
                  actions: (
                    <Button
                      label="OK"
                      onClick={() => {
                        set({ modal: null });
                      }}
                    />
                  ),
                },
              });

              return;
            }
            if (bits - 10 < 0) {
              set({
                modal: {
                  title: "NOT ENOUGH BITS!",
                  content: "YOU NEED AT LEAST 10 BITS TO PLAY FRENZY MODE.",
                  actions: (
                    <Button
                      label="OK"
                      onClick={() => {
                        set({ modal: null });
                      }}
                    />
                  ),
                },
              });

              return;
            }

            set((state) => ({ bits: state.bits - 10 }));
            set({ gameMode: "frenzy", scene: "game" });
          }}
          icon={isFrenzyLocked ? "lock" : undefined}
          label={isFrenzyLocked ? "FRENZY" : "FRENZY (-10 BITS)"}
        />
        <div className="flex gap-4">
          <Button
            onClick={() => set({ scene: "stats" })}
            label="STATS"
            className="w-full"
          />
          <Button
            onClick={() => set({ scene: "about" })}
            label="ABOUT"
            className="w-full"
          />
        </div>
        <Button
          onClick={() => set({ soundMode: ((soundMode + 1) % 3) as SoundMode })}
          icon={soundMode ? "speakerOn" : "speakerOff"}
          label={
            soundMode === 2 ? "ON" : soundMode === 1 ? "ON (MUTE MENU)" : "OFF"
          }
          className="min-w-85"
        />
      </div>
      <p className="text-center leading-relaxed">TIP: {tip}</p>
    </div>
  );
}
