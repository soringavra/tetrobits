import { ASSETS, PIXEL_SCALE } from "../utils/game";

const PANELS = {
  small: { src: ASSETS.panelSmall.src, width: 88, height: 40 },
  medium: { src: ASSETS.panelMedium.src, width: 88, height: 100 },
  large: { src: ASSETS.panelLarge.src, width: 88, height: 100 },
};

export default function Panel({
  variant = "small",
  children,
}: {
  variant?: "small" | "medium" | "large";
  children: React.ReactNode;
}) {
  const { src, width, height } = PANELS[variant];

  return (
    <div className="relative">
      <img
        src={src}
        style={{
          minWidth: width * PIXEL_SCALE,
          minHeight: height * PIXEL_SCALE,
        }}
      />
      <div className="absolute inset-0 left-5 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
