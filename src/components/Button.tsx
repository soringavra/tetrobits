import { PIXEL_SCALE } from "../utils/game";
import { cn } from "../utils/cn";

import speakerOn from "../assets/sprites/icons/speaker_on.png";
import speakerOff from "../assets/sprites/icons/speaker_off.png";
import external from "../assets/sprites/icons/external.png";
import lock from "../assets/sprites/icons/lock.png";
import warning from "../assets/sprites/icons/warning.png";
import pause from "../assets/sprites/icons/pause.png";
import resume from "../assets/sprites/icons/resume.png";

export const ICONS = {
  speakerOn,
  speakerOff,
  external,
  lock,
  warning,
  pause,
  resume,
};

type Icon = keyof typeof ICONS;

type Variant = "normal" | "danger";

export default function Button({
  variant = "normal",
  icon,
  label,
  className,
  ...props
}: {
  variant?: Variant;
  icon?: Icon;
  label?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "flex h-16 min-w-17 translate-y-0 cursor-pointer items-center justify-center gap-4 border-2 bg-black py-4 outline-none hover:border-white hover:drop-shadow-[0px_6px_rgb(255,255,255)] active:translate-y-1.5 active:drop-shadow-none",
        variant === "danger"
          ? "border-red-500 drop-shadow-[0px_6px_rgb(251,44,54)]"
          : "border-gold drop-shadow-[0px_6px_rgb(183,189,83)]",
        label ? "px-8" : "px-4",
        className,
      )}
      {...props}
    >
      {icon && (
        <img
          src={ICONS[icon]}
          style={{
            width: 16 * PIXEL_SCALE,
            height: 16 * PIXEL_SCALE,
          }}
        />
      )}
      {label}
    </button>
  );
}
