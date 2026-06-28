import { ASSETS, SPRITE_SIZE, PIXEL_SCALE } from "./game";

export const BOARD_WIDTH = 172 * PIXEL_SCALE;
export const BOARD_HEIGHT = 332 * PIXEL_SCALE;

export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;

export const BOARD_PADDING = 12;

export const TETROMINOES = [
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 0],
  ],
  [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
];

export type CellProps = {
  type: number | null;
  bits: number;
  x: number;
  y: number;
};

export type PieceProps = {
  type: number | null;
  shape: number[][];
  bitsMap: number[][];
  x: number;
  y: number;
};

export type BoardProps = CellProps[][];

export const createEmptyBoard = () => {
  const rows = [];

  for (let y = 0; y < BOARD_ROWS; y++) {
    const col = [];

    for (let x = 0; x < BOARD_COLS; x++) {
      col.push({ type: null, bits: 0, x, y });
    }

    rows.push(col);
  }

  return rows;
};

export const getRandomPiece = () => {
  const type = Math.floor(Math.random() * TETROMINOES.length);
  const bitsMap = TETROMINOES[type].map((row) =>
    row.map((cell) => {
      if (!cell) return 0;

      return Math.random() * 100 < 3 ? 1 : 0;
    }),
  );

  return {
    type,
    shape: TETROMINOES[type],
    bitsMap,
    x: Math.floor(BOARD_COLS / 2) - Math.floor(TETROMINOES[type][0].length / 2),
    y: 0,
  };
};

export const rotatePiece = (shape: number[][]) =>
  shape[0].map((_, i) => shape.map((row) => row[i]).reverse());

const KICKS = [0, 1, -1, 2, -2];

export const rotateWithKick = (
  board: BoardProps,
  piece: PieceProps,
): PieceProps | null => {
  const rotated = rotatePiece(piece.shape);
  const rotatedbits = rotatePiece(piece.bitsMap);

  for (const kick of KICKS) {
    if (isValidMove(board, rotated, piece.x + kick, piece.y)) {
      return {
        ...piece,
        shape: rotated,
        bitsMap: rotatedbits,
        x: piece.x + kick,
      };
    }
  }

  return null;
};

export const trimShapeMatrix = (shape: number[][]) => {
  const rows = shape.filter((row) => row.some((cell) => cell));
  const cols = rows[0].map((_, i) => rows.map((row) => row[i]));
  const trimmedCols = cols.filter((col) => col.some((cell) => cell));

  return trimmedCols[0].map((_, i) => trimmedCols.map((col) => col[i]));
};

export const isValidMove = (
  board: BoardProps,
  shape: number[][],
  x: number,
  y: number,
): boolean => {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (!shape[row][col]) continue;

      const newX = x + col;
      const newY = y + row;

      if (newX < 0 || newX >= BOARD_COLS || newY >= BOARD_ROWS) return false;
      if (newY < 0) continue;
      if (board[newY][newX].type !== null) return false;
    }
  }

  return true;
};

export const renderGhostPiece = (
  ctx: CanvasRenderingContext2D,
  board: BoardProps,
  piece: PieceProps,
) => {
  let ghostY = piece.y;

  while (isValidMove(board, piece.shape, piece.x, ghostY + 1)) ghostY++;

  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (!piece.shape[row][col]) continue;

      drawCell(ctx, 7, 0, piece.x + col, ghostY + row);
    }
  }
};

export const mergePiece = (piece: PieceProps, board: BoardProps) => {
  const next = board.map((row) => row.map((cell) => ({ ...cell })));

  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (!piece.shape[row][col]) continue;

      const y = piece.y + row;
      const x = piece.x + col;

      if (y >= 0)
        next[y][x] = {
          type: piece.type,
          bits: piece.bitsMap[row][col],
          x,
          y,
        };
    }
  }

  return next;
};

export const clearLines = (board: BoardProps) => {
  const cleared = board.filter((row) =>
    row.every((cell) => cell.type !== null),
  );
  const next = board.filter((row) => row.some((cell) => cell.type === null));
  const bitsCollected = cleared.reduce(
    (sum, row) => sum + row.reduce((s, cell) => s + cell.bits, 0),
    0,
  );
  const empty = Array.from({ length: BOARD_ROWS - next.length }, (_, i) =>
    Array.from({ length: BOARD_COLS }, (_, j) => ({
      type: null,
      bits: 0,
      x: j,
      y: i,
    })),
  );
  const merged = [...empty, ...next].map((row, y) =>
    row.map((cell, x) => ({ ...cell, x, y })),
  );

  return { board: merged, cleared: BOARD_ROWS - next.length, bitsCollected };
};

export const getDropInterval = (score: number, base: number) => {
  const level = Math.floor(score / 1000);

  return Math.max(100, base - level * 70);
};

export const drawCell = (
  ctx: CanvasRenderingContext2D,
  type: number | null,
  bits: number,
  x: number,
  y: number,
  padding = BOARD_PADDING,
) => {
  if (type === null) return;

  ctx.drawImage(
    ASSETS.cells,
    type * SPRITE_SIZE,
    bits ? SPRITE_SIZE : 0,
    SPRITE_SIZE,
    SPRITE_SIZE,
    x * SPRITE_SIZE * PIXEL_SCALE + padding,
    y * SPRITE_SIZE * PIXEL_SCALE + padding,
    SPRITE_SIZE * PIXEL_SCALE,
    SPRITE_SIZE * PIXEL_SCALE,
  );
};
