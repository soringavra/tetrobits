import { useGameStore } from "../../stores/useGameStore";

import Panel from "./Panel";

export default function Modal() {
  const modal = useGameStore((state) => state.modal);

  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-8">
      <Panel className="flex max-w-2xl flex-col gap-8 p-8">
        <p>{modal.title}</p>
        <div className="leading-7 text-pretty">{modal.content}</div>
        <div className="flex gap-4 *:flex-1">{modal.actions}</div>
      </Panel>
    </div>
  );
}
