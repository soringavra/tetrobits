import { cn } from "../../utils/cn";

export default function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-gold border-2 bg-black px-2 py-1 outline-3 outline-black",
        className,
      )}
    >
      {children}
    </div>
  );
}
