import type React from "react";
import { useEffect, useState } from "react";
import type { Puzzle } from "../data/puzzles";

interface PuzzleBoardProps {
  puzzle: Puzzle;
  onCorrect: () => void;
  onWrong: () => void;
  solved: boolean;
}

type FlashState = "none" | "correct" | "wrong";

const IS_WHITE_PIECE: Record<string, boolean> = {
  K: true,
  Q: true,
  R: true,
  B: true,
  N: true,
  P: true,
  k: false,
  q: false,
  r: false,
  b: false,
  n: false,
  p: false,
};

const PIECE_SHADOW = {
  filter: "drop-shadow(0 0 2.5px white) drop-shadow(0 0 1.5px white)",
};

function WhiteKing() {
  return (
    <svg
      role="img"
      aria-label="chess piece"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 45"
      width={52}
      height={52}
      style={PIECE_SHADOW}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path strokeLinejoin="miter" d="M22.5 11.63V6M20 8h5" />
        <path
          fill="#fff"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
        />
        <path
          fill="#fff"
          d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10z"
        />
        <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" />
      </g>
    </svg>
  );
}

function WhiteQueen() {
  return (
    <svg
      role="img"
      aria-label="chess piece"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 45"
      width={52}
      height={52}
      style={PIECE_SHADOW}
    >
      <g
        fill="#fff"
        fillRule="evenodd"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0m16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0M41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0M16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0M33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0" />
        <path
          strokeLinecap="butt"
          d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14z"
        />
        <path
          strokeLinecap="butt"
          d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"
        />
        <path
          fill="none"
          d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0"
        />
      </g>
    </svg>
  );
}

function WhiteRook() {
  return (
    <svg
      role="img"
      aria-label="chess piece"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 45"
      width={52}
      height={52}
      style={PIECE_SHADOW}
    >
      <g
        fill="#fff"
        fillRule="evenodd"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="butt"
          d="M9 39h27v-3H9zm3-3v-4h21v4zm-1-22V9h4v2h5V9h5v2h5V9h4v5"
        />
        <path d="m34 14-3 3H14l-3-3" />
        <path
          strokeLinecap="butt"
          strokeLinejoin="miter"
          d="M31 17v12.5H14V17"
        />
        <path d="m31 29.5 1.5 2.5h-20l1.5-2.5" />
        <path fill="none" strokeLinejoin="miter" d="M11 14h23" />
      </g>
    </svg>
  );
}

function WhiteBishop() {
  return (
    <svg
      role="img"
      aria-label="chess piece"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 45"
      width={52}
      height={52}
      style={PIECE_SHADOW}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <g fill="#fff" strokeLinecap="butt">
          <path d="M9 36c3.4-1 10.1.4 13.5-2 3.4 2.4 10.1 1 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.4-1-10.1.46-13.5-1-3.4 1.46-10.1.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.94 3-2 3-2z" />
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
        </g>
        <path
          strokeLinejoin="miter"
          d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"
        />
      </g>
    </svg>
  );
}

function WhiteKnight() {
  return (
    <svg
      role="img"
      aria-label="chess piece"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 45"
      width={52}
      height={52}
      style={PIECE_SHADOW}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path fill="#fff" d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" />
        <path
          fill="#fff"
          d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"
        />
        <path
          fill="#000"
          d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0m5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5"
        />
      </g>
    </svg>
  );
}

function WhitePawn() {
  return (
    <svg
      role="img"
      aria-label="chess piece"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 45"
      width={52}
      height={52}
      style={PIECE_SHADOW}
    >
      <path
        fill="#fff"
        stroke="#000"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
      />
    </svg>
  );
}

function BlackKing() {
  return (
    <svg
      role="img"
      aria-label="chess piece"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 45"
      width={52}
      height={52}
      style={PIECE_SHADOW}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path strokeLinejoin="miter" d="M22.5 11.6V6" />
        <path
          fill="#000"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
        />
        <path
          fill="#000"
          d="M11.5 37a22.3 22.3 0 0 0 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10z"
        />
        <path strokeLinejoin="miter" d="M20 8h5" />
        <path
          stroke="#ececec"
          d="M32 29.5s8.5-4 6-9.7C34.1 14 25 18 22.5 24.6v2.1-2.1C20 18 9.9 14 7 19.9c-2.5 5.6 4.8 9 4.8 9"
        />
        <path
          stroke="#ececec"
          d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"
        />
      </g>
    </svg>
  );
}

function BlackQueen() {
  return (
    <svg
      role="img"
      aria-label="chess piece"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 45"
      width={52}
      height={52}
      style={PIECE_SHADOW}
    >
      <g
        fillRule="evenodd"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <g stroke="none">
          <circle cx="6" cy="12" r="2.75" />
          <circle cx="14" cy="9" r="2.75" />
          <circle cx="22.5" cy="8" r="2.75" />
          <circle cx="31" cy="9" r="2.75" />
          <circle cx="39" cy="12" r="2.75" />
        </g>
        <path
          strokeLinecap="butt"
          d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5z"
        />
        <path
          strokeLinecap="butt"
          d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"
        />
        <path fill="none" strokeLinecap="butt" d="M11 38.5a35 35 1 0 0 23 0" />
        <path
          fill="none"
          stroke="#ececec"
          d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0m-23 3a35 35 1 0 0 24 0"
        />
      </g>
    </svg>
  );
}

function BlackRook() {
  return (
    <svg
      role="img"
      aria-label="chess piece"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 45"
      width={52}
      height={52}
      style={PIECE_SHADOW}
    >
      <g
        fillRule="evenodd"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="butt"
          d="M9 39h27v-3H9zm3.5-7 1.5-2.5h17l1.5 2.5zm-.5 4v-4h21v4z"
        />
        <path
          strokeLinecap="butt"
          strokeLinejoin="miter"
          d="M14 29.5v-13h17v13z"
        />
        <path
          strokeLinecap="butt"
          d="M14 16.5 11 14h23l-3 2.5zM11 14V9h4v2h5V9h5v2h5V9h4v5z"
        />
        <path
          fill="none"
          stroke="#ececec"
          strokeLinejoin="miter"
          strokeWidth="1"
          d="M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23"
        />
      </g>
    </svg>
  );
}

function BlackBishop() {
  return (
    <svg
      role="img"
      aria-label="chess piece"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 45"
      width={52}
      height={52}
      style={PIECE_SHADOW}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <g fill="#000" strokeLinecap="butt">
          <path d="M9 36c3.4-1 10.1.4 13.5-2 3.4 2.4 10.1 1 13.5 2 0 0 1.6.5 3 2-.7 1-1.6 1-3 .5-3.4-1-10.1.5-13.5-1-3.4 1.5-10.1 0-13.5 1-1.4.5-2.3.5-3-.5 1.4-2 3-2 3-2z" />
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
        </g>
        <path
          stroke="#ececec"
          strokeLinejoin="miter"
          d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"
        />
      </g>
    </svg>
  );
}

function BlackKnight() {
  return (
    <svg
      role="img"
      aria-label="chess piece"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 45"
      width={52}
      height={52}
      style={PIECE_SHADOW}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path fill="#000" d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" />
        <path
          fill="#000"
          d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.04-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-1-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-2 2.5-3c1 0 1 3 1 3"
        />
        <path
          fill="#ececec"
          stroke="#ececec"
          d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0m5.43-9.75a.5 1.5 30 1 1-.86-.5.5 1.5 30 1 1 .86.5"
        />
        <path
          fill="#ececec"
          stroke="none"
          d="m24.55 10.4-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34s-5.79-6.64-9.19-7.16z"
        />
      </g>
    </svg>
  );
}

function BlackPawn() {
  return (
    <svg
      role="img"
      aria-label="chess piece"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 45"
      width={52}
      height={52}
      style={PIECE_SHADOW}
    >
      <path
        stroke="#000"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M22.5 9a4 4 0 0 0-3.22 6.38 6.48 6.48 0 0 0-.87 10.65c-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47a6.46 6.46 0 0 0-.87-10.65A4.01 4.01 0 0 0 22.5 9z"
      />
    </svg>
  );
}

const PIECE_COMPONENTS: Record<string, () => React.ReactElement> = {
  K: WhiteKing,
  Q: WhiteQueen,
  R: WhiteRook,
  B: WhiteBishop,
  N: WhiteKnight,
  P: WhitePawn,
  k: BlackKing,
  q: BlackQueen,
  r: BlackRook,
  b: BlackBishop,
  n: BlackKnight,
  p: BlackPawn,
};

function parseFen(fen: string): (string | null)[][] {
  const placement = fen.split(" ")[0];
  const rows = placement.split("/");
  return rows.map((row) => {
    const cells: (string | null)[] = [];
    for (const ch of row) {
      if (ch >= "1" && ch <= "8") {
        for (let i = 0; i < Number.parseInt(ch); i++) cells.push(null);
      } else {
        cells.push(ch);
      }
    }
    return cells;
  });
}

function squareToCoords(sq: string): [number, number] {
  const file = sq.charCodeAt(0) - 97;
  const rank = 8 - Number.parseInt(sq[1]);
  return [rank, file];
}

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];

function squareKey(ri: number, ci: number): string {
  return `${FILES[ci]}${RANKS[ri]}`;
}

const SQ = 60;

export function PuzzleBoard({
  puzzle,
  onCorrect,
  onWrong,
  solved,
}: PuzzleBoardProps) {
  const [board, setBoard] = useState<(string | null)[][]>(() =>
    parseFen(puzzle.fen),
  );
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [flash, setFlash] = useState<FlashState>("none");

  useEffect(() => {
    setBoard(parseFen(puzzle.fen));
    setSelected(null);
    setFlash("none");
  }, [puzzle.fen]);

  const handleSquareClick = (row: number, col: number) => {
    if (solved || flash === "correct") return;

    const piece = board[row][col];

    if (selected === null) {
      if (piece === null) return;
      const isWhite = IS_WHITE_PIECE[piece];
      if (puzzle.sideToMove === "white" && !isWhite) return;
      if (puzzle.sideToMove === "black" && isWhite) return;
      setSelected([row, col]);
    } else {
      const [selRow, selCol] = selected;
      if (selRow === row && selCol === col) {
        setSelected(null);
        return;
      }

      const fromFile = FILES[selCol];
      const fromRank = RANKS[selRow];
      const toFile = FILES[col];
      const toRank = RANKS[row];
      const fromSq = fromFile + fromRank;
      const toSq = toFile + toRank;

      if (fromSq === puzzle.solutionFrom && toSq === puzzle.solutionTo) {
        setBoard((prev) => {
          const next = prev.map((r) => [...r]);
          next[row][col] = next[selRow][selCol];
          next[selRow][selCol] = null;
          return next;
        });
        setSelected(null);
        setFlash("correct");
        onCorrect();
      } else {
        if (piece !== null) {
          const isWhite = IS_WHITE_PIECE[piece];
          if (
            (puzzle.sideToMove === "white" && isWhite) ||
            (puzzle.sideToMove === "black" && !isWhite)
          ) {
            setSelected([row, col]);
            return;
          }
        }
        setSelected(null);
        setFlash("wrong");
        setTimeout(() => setFlash("none"), 700);
        onWrong();
      }
    }
  };

  const [solFrom, solFromCol] = squareToCoords(puzzle.solutionFrom);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-lg overflow-hidden select-none"
        style={{
          border:
            flash === "correct"
              ? "2px solid oklch(0.72 0.20 142)"
              : flash === "wrong"
                ? "2px solid oklch(0.65 0.22 25)"
                : "2px solid oklch(0.62 0.19 255 / 0.5)",
          boxShadow:
            flash === "correct"
              ? "0 0 30px oklch(0.72 0.20 142 / 0.5)"
              : flash === "wrong"
                ? "0 0 30px oklch(0.65 0.22 25 / 0.5)"
                : "0 0 20px oklch(0.62 0.19 255 / 0.15)",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <div className="flex">
          <div className="flex flex-col" style={{ width: 20 }}>
            {RANKS.map((rank) => (
              <div
                key={rank}
                style={{
                  width: 20,
                  height: SQ,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: "oklch(0.55 0.01 255)",
                }}
              >
                {rank}
              </div>
            ))}
          </div>

          <div>
            {board.map((rowArr, ri) => (
              <div key={RANKS[ri]} className="flex">
                {rowArr.map((piece, ci) => {
                  const isLight = (ri + ci) % 2 === 0;
                  const isSelected =
                    selected !== null &&
                    selected[0] === ri &&
                    selected[1] === ci;
                  const isFromSquare =
                    solved && ri === solFrom && ci === solFromCol;

                  let bg = isLight ? "#000000" : "oklch(0.62 0.19 255)";
                  if (isSelected) bg = "oklch(0.42 0.18 255)";
                  if (isFromSquare) bg = "oklch(0.42 0.18 142)";

                  const PieceComponent = piece ? PIECE_COMPONENTS[piece] : null;
                  const key = squareKey(ri, ci);

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSquareClick(ri, ci)}
                      style={{
                        width: SQ,
                        height: SQ,
                        background: bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: solved ? "default" : "pointer",
                        transition: "background 0.15s",
                        outline: "none",
                        border: "none",
                        padding: 0,
                      }}
                    >
                      {PieceComponent ? <PieceComponent /> : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex" style={{ paddingLeft: 20 }}>
          {FILES.map((file) => (
            <div
              key={file}
              style={{
                width: SQ,
                height: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontFamily: "monospace",
                color: "oklch(0.55 0.01 255)",
              }}
            >
              {file}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
