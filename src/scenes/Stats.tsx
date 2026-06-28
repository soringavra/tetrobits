import { useGameStore } from "../stores/useGameStore";
import { XP_TABLE } from "../utils/game";

import Panel from "../components/Panel";
import Button from "../components/Button";

export default function Stats() {
  const { xp, level, bits, highScore, set, resetProgress } = useGameStore();

  return (
    <div className="flex flex-col items-center gap-8">
      <Panel variant="large">
        <p>
          STATS:
          <br />
          <br />
        </p>
        <p>BEST: {highScore}</p>
        <p>LEVEL: {level > XP_TABLE.length ? "MAX" : level}</p>
        <p>
          XP: {level > XP_TABLE.length ? xp : `${xp}/${XP_TABLE[level - 1]}`}
        </p>
        <p>BITS: {bits}</p>
      </Panel>
      <Button
        onClick={() =>
          set({
            modal: {
              title: "HOLD UP!",
              content:
                "ARE YOU SURE YOU WANT TO ERASE YOUR ENTIRE PROGRESS? THIS ACTION CANNOT BE UNDONE!",
              actions: (
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      set({ modal: null });
                    }}
                    label="CANCEL"
                  />
                  <Button
                    onClick={() => {
                      resetProgress();
                      set({ modal: null });
                    }}
                    icon="warning"
                    variant="danger"
                    label="PROCEED"
                  />
                </div>
              ),
            },
          })
        }
        variant="danger"
        icon="warning"
        label="ERASE PROGRESS"
        className="mb-16"
      />
      <Button onClick={() => set({ scene: "menu" })} label="BACK" />
    </div>
  );
}
