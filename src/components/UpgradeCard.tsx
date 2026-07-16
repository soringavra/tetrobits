import { useGameStore } from "../stores/useGameStore";
import { useProgressStore } from "../stores/useProgressStore";
import {
  type Tier,
  type UpgradeProps,
  formatUpgradeValue,
} from "../scenes/Upgrades";
import { SFX } from "../utils/assets";
import { playSfx } from "../utils/audio";
import { cn } from "../utils/cn";

import Panel from "./ui/Panel";
import Button from "./ui/Button";

export default function UpgradeCard({
  upgrade,
  currentLevel,
  currentValue,
  nextTier,
  isMaxed,
}: {
  upgrade: UpgradeProps;
  currentLevel: number;
  currentValue: number | boolean;
  nextTier: Tier | null;
  isMaxed: boolean;
}) {
  const bits = useProgressStore((state) => state.bits);
  const setModal = useGameStore((state) => state.setModal);
  const setBits = useProgressStore((state) => state.setBits);
  const setUpgradeLevel = useProgressStore((state) => state.setUpgradeLevel);

  const handlePurchase = () => {
    if (!nextTier) return;

    if (bits < nextTier.cost) {
      setModal({
        title: "NOT ENOUGH BITS!",
        content: `YOU NEED ${nextTier.cost} BITS FOR THIS UPGRADE.`,
        actions: <Button onClick={() => setModal(null)}>OK</Button>,
      });

      return;
    }

    setModal({
      title: `UPGRADE ${upgrade.name}?`,
      content: `SPEND ${nextTier.cost} BITS TO ${upgrade.type === "boolean" ? "UNLOCK" : "UPGRADE"}
      ${upgrade.name} ${upgrade.type !== "boolean" && `TO ${formatUpgradeValue(upgrade.type, nextTier.value)}`}?`,
      actions: (
        <>
          <Button onClick={() => setModal(null)}>BACK</Button>
          <Button
            onClick={() => {
              setBits(bits - nextTier.cost);
              setUpgradeLevel(upgrade.id, currentLevel + 1);
              setModal(null);
              playSfx(SFX.notification);
            }}
          >
            UPGRADE
          </Button>
        </>
      ),
    });
  };

  return (
    <Panel
      className={cn(
        "flex max-w-xs flex-col justify-between gap-4 px-6 py-5",
        isMaxed && "bg-gold-dim",
      )}
    >
      <div className="flex flex-col gap-4">
        <p>{upgrade.name}</p>
        <p>{upgrade.description}</p>
        {upgrade.type !== "boolean" && (
          <p>
            {formatUpgradeValue(upgrade.type, currentValue)}
            {!isMaxed &&
              nextTier &&
              ` -> ${formatUpgradeValue(upgrade.type, nextTier.value)}`}
          </p>
        )}
      </div>
      {!isMaxed && nextTier ? (
        <Button onClick={handlePurchase} className="w-full">
          {nextTier.cost} BITS
        </Button>
      ) : (
        <>{upgrade.type === "boolean" ? <p>UNLOCKED</p> : <p>MAXED OUT</p>}</>
      )}
    </Panel>
  );
}
