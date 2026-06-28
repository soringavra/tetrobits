import { cn } from "../utils/cn";

export default function BoardOverlay({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-3 flex flex-col items-center justify-center gap-6 bg-black/80 px-8 text-center text-pretty",
        className,
      )}
    >
      {children}
    </div>
  );
}
