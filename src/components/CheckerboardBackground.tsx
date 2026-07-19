const TILE_SIZE = 576; // px
const TILE_COLOR = "#2b2b2280";

const half = TILE_SIZE / 2;
const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${TILE_SIZE}" height="${TILE_SIZE}">
    <rect x="0" y="0" width="${half}" height="${half}" fill="${TILE_COLOR}" />
    <rect x="${half}" y="${half}" width="${half}" height="${half}" fill="${TILE_COLOR}" />
  </svg>
`;
const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export default function CheckerboardBackground() {
  return (
    <div
      className="absolute inset-0 -z-10"
      style={{
        backgroundImage: `url("${dataUrl}")`,
        backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
        backgroundPosition: "center",
      }}
    />
  );
}
