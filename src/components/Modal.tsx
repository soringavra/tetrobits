import { useGameStore } from "../stores/useGameStore";

export default function Modal() {
  const modal = useGameStore((state) => state.modal);

  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-8">
      <div className="border-gold flex max-w-2xl flex-col gap-8 border-2 bg-black p-8 leading-relaxed">
        <p>{modal.title}</p>
        {modal.content}
        {modal.actions}
      </div>
    </div>
  );
}
