import { useCallback, useRef, useState } from "react";
import type { Puzzle } from "../data/puzzles";
import { Chess } from "../lib/chess-engine";

export const LICHESS_THEMES = [
  { key: "mix", label: "Mix" },
  { key: "fork", label: "Fork" },
  { key: "pin", label: "Pin" },
  { key: "skewer", label: "Skewer" },
  { key: "discoveredAttack", label: "Discovered Attack" },
  { key: "backRankMate", label: "Back Rank Mate" },
  { key: "mateIn1", label: "Mate in 1" },
  { key: "mateIn2", label: "Mate in 2" },
  { key: "mateIn3", label: "Mate in 3" },
  { key: "endgame", label: "Endgame" },
  { key: "kingsideAttack", label: "Kingside Attack" },
  { key: "queensideAttack", label: "Queenside Attack" },
  { key: "sacrifice", label: "Sacrifice" },
  { key: "deflection", label: "Deflection" },
  { key: "attraction", label: "Attraction" },
  { key: "interference", label: "Interference" },
  { key: "clearance", label: "Clearance" },
  { key: "xRayAttack", label: "X-Ray Attack" },
  { key: "zugzwang", label: "Zugzwang" },
  { key: "quietMove", label: "Quiet Move" },
  { key: "defensiveMove", label: "Defensive Move" },
  { key: "trappedPiece", label: "Trapped Piece" },
  { key: "advancedPawn", label: "Advanced Pawn" },
  { key: "promotion", label: "Promotion" },
  { key: "underPromotion", label: "Underpromotion" },
  { key: "hangingPiece", label: "Hanging Piece" },
  { key: "exposedKing", label: "Exposed King" },
  { key: "knightEndgame", label: "Knight Endgame" },
  { key: "rookEndgame", label: "Rook Endgame" },
  { key: "bishopEndgame", label: "Bishop Endgame" },
  { key: "queenEndgame", label: "Queen Endgame" },
  { key: "pawnEndgame", label: "Pawn Endgame" },
  { key: "master", label: "Master Game" },
  { key: "opening", label: "Opening" },
  { key: "middlegame", label: "Middlegame" },
  { key: "long", label: "Long" },
  { key: "short", label: "Short" },
  { key: "oneMove", label: "One Move" },
];

interface LichessPuzzleData {
  puzzle: {
    id: string;
    rating: number;
    plays: number;
    initialPly: number;
    solution: string[];
    themes: string[];
  };
  game: {
    pgn: string;
  };
}

function uciToFromTo(uci: string): { from: string; to: string } {
  return { from: uci.slice(0, 2), to: uci.slice(2, 4) };
}

function getPuzzleFenFromLichess(data: LichessPuzzleData): {
  fen: string;
  solutionFrom: string;
  solutionTo: string;
  sideToMove: "white" | "black";
} | null {
  try {
    const chess = new Chess();
    const pgnMoves = data.game.pgn.replace(/\[.*?\]\s*/g, "").trim();
    chess.loadPgn(pgnMoves);

    const history = chess.history({ verbose: true });

    const chess2 = new Chess();
    for (let i = 0; i < data.puzzle.initialPly && i < history.length; i++) {
      chess2.move(history[i]);
    }

    const fen = chess2.fen();
    const sideToMove = chess2.turn() === "w" ? "white" : "black";

    const firstMove = uciToFromTo(data.puzzle.solution[0]);

    return {
      fen,
      solutionFrom: firstMove.from,
      solutionTo: firstMove.to,
      sideToMove,
    };
  } catch (e) {
    console.error("Failed to parse puzzle", e);
    return null;
  }
}

export interface LichessPuzzle extends Puzzle {
  lichessRating: number;
  lichessId: string;
  themes: string[];
  fullSolution: string[];
}

export function useLichessPuzzle() {
  const [puzzle, setPuzzle] = useState<LichessPuzzle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState("mix");
  const cacheRef = useRef<Map<string, LichessPuzzle[]>>(new Map());
  const indexRef = useRef<Map<string, number>>(new Map());

  const fetchNextPuzzle = useCallback(async (themeKey: string) => {
    const cached = cacheRef.current.get(themeKey) ?? [];
    const idx = indexRef.current.get(themeKey) ?? 0;

    if (idx < cached.length) {
      setPuzzle(cached[idx]);
      indexRef.current.set(themeKey, idx + 1);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url =
        themeKey === "mix"
          ? "https://lichess.org/api/puzzle/next"
          : `https://lichess.org/api/puzzle/next?angle=${themeKey}`;

      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: LichessPuzzleData = await res.json();
      const parsed = getPuzzleFenFromLichess(data);

      if (!parsed) throw new Error("Could not parse puzzle position");

      const lichessPuzzle: LichessPuzzle = {
        id: data.puzzle.id,
        lichessId: data.puzzle.id,
        lichessRating: data.puzzle.rating,
        themes: data.puzzle.themes,
        fullSolution: data.puzzle.solution,
        title: data.puzzle.themes[0]
          ? data.puzzle.themes[0].replace(/([A-Z])/g, " $1").trim()
          : "Puzzle",
        theme: data.puzzle.themes[0] ?? "Tactics",
        description: `Solve this ${data.puzzle.themes
          .slice(0, 2)
          .join(", ")} puzzle. Rating: ${data.puzzle.rating}`,
        fen: parsed.fen,
        solutionFrom: parsed.solutionFrom,
        solutionTo: parsed.solutionTo,
        sideToMove: parsed.sideToMove,
        xpReward: Math.min(
          200,
          Math.max(50, Math.floor(data.puzzle.rating / 20)),
        ),
      };

      const arr = cacheRef.current.get(themeKey) ?? [];
      arr.push(lichessPuzzle);
      cacheRef.current.set(themeKey, arr);
      indexRef.current.set(themeKey, arr.length);

      setPuzzle(lichessPuzzle);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load puzzle");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPuzzle = useCallback(
    (themeKey: string) => {
      setTheme(themeKey);
      fetchNextPuzzle(themeKey);
    },
    [fetchNextPuzzle],
  );

  const nextPuzzle = useCallback(() => {
    fetchNextPuzzle(theme);
  }, [fetchNextPuzzle, theme]);

  return { puzzle, loading, error, theme, loadPuzzle, nextPuzzle };
}
