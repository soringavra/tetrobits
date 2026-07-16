const TILE_SIZE = 576; // px
const TILE_COLOR = "#2b2b2280";

export default function CheckerboardBackground() {
  const half = TILE_SIZE / 2;

  return (
    <div
      className="absolute inset-0 -z-10"
      style={{
        backgroundImage: `
          linear-gradient(45deg, ${TILE_COLOR} 25%, transparent 25%),
          linear-gradient(-45deg, ${TILE_COLOR} 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, ${TILE_COLOR} 75%),
          linear-gradient(-45deg, transparent 75%, ${TILE_COLOR} 75%)
        `,
        backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
        backgroundPosition: `
          calc(50% + ${half}px) 50%,
          calc(50% + ${half}px) calc(50% + ${half}px),
          50% calc(50% - ${half}px),
          50% 50%
        `,
      }}
    />
  );
}
