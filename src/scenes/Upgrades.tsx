import { useGameStore } from "../stores/useGameStore";
import { useProgressStore } from "../stores/useProgressStore";
import { formatBitLabel } from "../utils/game";

import UpgradeCard from "../components/UpgradeCard";
import Button from "../components/ui/Button";
import Panel from "../components/ui/Panel";

export type Type = "percent" | "numeric" | "boolean";

export type Tier = { cost: number; value: number | boolean };

export type UpgradeProps = {
  id: string;
  name: string;
  description: string;
  type: Type;
  baseValue: number | boolean;
  tiers: Tier[];
};

export const UPGRADES: UpgradeProps[] = [
  {
    id: "bitLuck",
    name: "BIT LUCK",
    description: "INCREASES THE CHANCE OF BIT-BLOCKS SPAWNING.",
    type: "percent",
    baseValue: 0.5,
    tiers: [
      { cost: 20, value: 0.6 },
      { cost: 50, value: 0.7 },
      { cost: 100, value: 0.85 },
      { cost: 200, value: 1 },
      { cost: 400, value: 1.25 },
      { cost: 700, value: 1.5 },
      { cost: 1300, value: 1.75 },
      { cost: 2500, value: 2 },
      { cost: 5000, value: 2.5 },
      { cost: 10_000, value: 3 },
    ],
  },
  {
    id: "nextTwoPreview",
    name: "NEXT TWO PREVIEW",
    description: "PREVIEW THE NEXT TWO UPCOMING PIECES.",
    type: "boolean",
    baseValue: false,
    tiers: [{ cost: 500, value: true }],
  },
];

export const UPGRADES_BY_ID: Record<string, UpgradeProps> = Object.fromEntries(
  UPGRADES.map((u) => [u.id, u]),
);

export const formatUpgradeValue = (type: Type, value: number | boolean) => {
  switch (type) {
    case "percent":
      return `${value}%`;
    case "numeric":
      return `${value}`;
    case "boolean":
      return value ? "UNLOCKED" : "LOCKED";
  }
};

export const getUpgradeTierInfo = (
  upgrade: UpgradeProps,
  currentLevel: number,
) => {
  const currentTier = currentLevel > 0 ? upgrade.tiers[currentLevel - 1] : null;
  const currentValue = currentTier ? currentTier.value : upgrade.baseValue;
  const nextTier = upgrade.tiers[currentLevel] ?? null;
  const isMaxed = nextTier === null;

  return { currentValue, nextTier, isMaxed };
};

export default function Upgrades() {
  const bits = useProgressStore((state) => state.bits);
  const upgradeLevels = useProgressStore((state) => state.upgradeLevels);
  const setScene = useGameStore((state) => state.setScene);

  return (
    <div className="flex flex-col items-center gap-16">
      <p>UPGRADES</p>
      <div className="flex gap-4">
        {UPGRADES.map((upgrade) => {
          const currentLevel = upgradeLevels[upgrade.id] ?? 0;
          const { currentValue, nextTier, isMaxed } = getUpgradeTierInfo(
            upgrade,
            currentLevel,
          );

          return (
            <UpgradeCard
              key={upgrade.id}
              upgrade={upgrade}
              currentLevel={currentLevel}
              currentValue={currentValue}
              nextTier={nextTier}
              isMaxed={isMaxed}
            />
          );
        })}
        <Panel className="grid max-w-xs place-items-center px-6 text-center opacity-50">
          MORE UPGRADES COMING SOON!
        </Panel>
      </div>
      <p>YOU HAVE: {formatBitLabel(bits)}</p>
      <Button onClick={() => setScene("menu")}>BACK</Button>
    </div>
  );
}
