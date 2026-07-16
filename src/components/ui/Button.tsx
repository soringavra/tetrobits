import { cn } from "../../utils/cn";

type Variant = "normal" | "disabled" | "danger";

export default function Button({
  onClick,
  variant = "normal",
  children,
  className,
  ...props
}: { variant?: Variant } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variantClasses = {
    normal: "border-gold drop-shadow-[0px_6px_0px_rgba(182,189,83,1)]",
    disabled:
      "border-olive-700 text-white/60 drop-shadow-[0px_6px_0px_rgba(71,71,57,1)]",
    danger: "border-red-500 drop-shadow-[0px_6px_0px_rgba(251,44,54)]",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative inline-flex w-fit cursor-pointer pb-1.5 drop-shadow-[3px_0px_0px_rgba(0,0,0,1),-3px_0px_0px_rgba(0,0,0,1),0px_-3px_0px_rgba(0,0,0,1),0px_3px_0px_rgba(0,0,0,1)]",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "w-full border-2 bg-black px-8 py-4 group-active:translate-y-1.5 group-active:drop-shadow-[0px_0px_0px_rgba(255,255,255,1)]",
          variantClasses[variant],
          variant !== "disabled" &&
            "group-hover:border-white group-hover:drop-shadow-[0px_6px_0px_rgba(255,255,255,1)]",
        )}
      >
        {children}
      </span>
    </button>
  );
}
