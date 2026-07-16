import { type CellProps, CELL_SIZE } from "./cell";

export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;

// px
export const BOARD_WIDTH = CELL_SIZE * BOARD_COLS;
export const BOARD_HEIGHT = CELL_SIZE * BOARD_ROWS;

export type BoardProps = CellProps[][];

export type PieceProps = {
  type: number | null;
  shape: number[][];
  x: number;
  y: number;
};

export const TETROMINOES = [
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
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
  [
    [1, 1],
    [1, 1],
  ],
];

export const createEmptyBoard = () => {
  const rows = [];

  for (let y = 0; y < BOARD_ROWS; y++) {
    const col = [];

    for (let x = 0; x < BOARD_COLS; x++) {
      col.push({ type: null, hasBit: false, x, y });
    }

    rows.push(col);
  }

  return rows;
};

export const getRandomPiece = (bitChance: number = 0.5) => {
  const type = Math.floor(Math.random() * TETROMINOES.length);
  const shape = TETROMINOES[type].map((row) =>
    row.map((cell) => {
      if (!cell) return 0;

      return Math.random() * 100 < bitChance ? 2 : 1;
    }),
  );

  return {
    type,
    shape,
    x: Math.floor(BOARD_COLS / 2) - Math.floor(TETROMINOES[type][0].length / 2),
    y: 0,
  };
};

export const isValidMove = (
  board: BoardProps,
  shape: number[][],
  x: number,
  y: number,
) => {
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (!shape[i][j]) continue;

      const newX = x + j;
      const newY = y + i;

      if (newX < 0 || newX >= BOARD_COLS || newY >= BOARD_ROWS) return false;
      if (newY < 0) continue;
      if (board[newY][newX].type !== null) return false;
    }
  }

  return true;
};

export const rotateMatrix = (matrix: number[][]) =>
  matrix[0].map((_, i) => matrix.map((row) => row[i]).reverse());

const KICKS = [0, 1, -1, 2, -2];

export const rotateWithKick = (board: BoardProps, piece: PieceProps) => {
  const rotated = rotateMatrix(piece.shape);

  for (const kick of KICKS) {
    if (isValidMove(board, rotated, piece.x + kick, piece.y)) {
      return { ...piece, shape: rotated, x: piece.x + kick };
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

export const mergePiece = (board: BoardProps, piece: PieceProps) => {
  const merged = board.map((row) => row.map((cell) => ({ ...cell })));

  piece.shape.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (!cell) return;

      const y = piece.y + i,
        x = piece.x + j;

      if (y >= 0 && y < BOARD_ROWS && x >= 0 && x < BOARD_COLS) {
        merged[y][x] = { type: piece.type, hasBit: cell === 2, x, y };
      }
    }),
  );

  return merged;
};

export const getFullRowIndices = (board: BoardProps) =>
  board.reduce<number[]>(
    (acc, row, i) => (row.every((c) => c.type !== null) ? [...acc, i] : acc),
    [],
  );

export const countBits = (board: BoardProps, rows: number[]) =>
  rows.reduce((total, i) => total + board[i].filter((c) => c.hasBit).length, 0);

export const removeRows = (board: BoardProps, rows: number[]) => {
  const remaining = board.filter((_, i) => !rows.includes(i));
  const empty = Array.from({ length: rows.length }, () =>
    Array.from({ length: BOARD_COLS }, () => ({
      type: null,
      hasBit: false,
      x: 0,
      y: 0,
    })),
  );

  return [...empty, ...remaining].map((row, y) =>
    row.map((c, x) => ({ ...c, x, y })),
  );
};
