import { useCallback, useEffect, useRef, useState } from "react";
import type { LichessPuzzle } from "./useLichessPuzzle";

interface RawPuzzle {
  id: string;
  fen: string;
  solutionFrom: string;
  solutionTo: string;
  fullSolution: string[];
  rating: number;
  themes: string[];
  sideToMove: "white" | "black";
}

function mapRawToLichess(raw: RawPuzzle): LichessPuzzle {
  const firstTheme = raw.themes[0] ?? "tactics";
  const title = firstTheme
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
  return {
    id: raw.id,
    lichessId: raw.id,
    lichessRating: raw.rating,
    themes: raw.themes,
    fullSolution: raw.fullSolution,
    title,
    theme: firstTheme,
    description: `Solve this ${raw.themes.slice(0, 2).join(", ")} puzzle. Rating: ${raw.rating}`,
    fen: raw.fen,
    solutionFrom: raw.solutionFrom,
    solutionTo: raw.solutionTo,
    sideToMove: raw.sideToMove,
    xpReward: Math.min(200, Math.max(50, Math.floor(raw.rating / 20))),
  };
}

export function useStaticPuzzles() {
  const [puzzle, setPuzzle] = useState<LichessPuzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState("mix");
  const [totalCount, setTotalCount] = useState(0);

  const allPuzzlesRef = useRef<LichessPuzzle[]>([]);
  const filteredRef = useRef<LichessPuzzle[]>([]);
  const indexRef = useRef(0);
  const themeRef = useRef("mix");

  const applyFilter = useCallback(
    (themeKey: string, puzzles: LichessPuzzle[]) => {
      const filtered =
        themeKey === "mix"
          ? puzzles
          : puzzles.filter((p) => p.themes.includes(themeKey));
      filteredRef.current = filtered;
      setTotalCount(filtered.length);
      return filtered;
    },
    [],
  );

  // Load all chunks; chunk 0 first, rest in background
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only effect; applyFilter is stable, themeRef avoids stale closure
  useEffect(() => {
    let cancelled = false;

    async function loadChunk0() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/puzzles/chunk_0.json");
        if (!res.ok)
          throw new Error(`Failed to load puzzles (HTTP ${res.status})`);
        const raw: RawPuzzle[] = await res.json();
        if (cancelled) return;
        const mapped = raw.map(mapRawToLichess);
        allPuzzlesRef.current = mapped;
        const filtered = applyFilter("mix", mapped);
        const startIdx = Math.floor(Math.random() * filtered.length);
        indexRef.current = startIdx;
        setPuzzle(filtered[startIdx] ?? null);
        setLoading(false);
        loadRemainingChunks();
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load puzzles");
          setLoading(false);
        }
      }
    }

    async function loadRemainingChunks() {
      for (let i = 1; i <= 4; i++) {
        try {
          const res = await fetch(`/puzzles/chunk_${i}.json`);
          if (!res.ok) continue;
          const raw: RawPuzzle[] = await res.json();
          if (cancelled) return;
          const mapped = raw.map(mapRawToLichess);
          allPuzzlesRef.current = [...allPuzzlesRef.current, ...mapped];
          applyFilter(themeRef.current, allPuzzlesRef.current);
        } catch {
          // silently skip failed chunks
        }
      }
    }

    loadChunk0();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadPuzzle = useCallback(
    (themeKey: string) => {
      setTheme(themeKey);
      themeRef.current = themeKey;
      const filtered = applyFilter(themeKey, allPuzzlesRef.current);
      if (filtered.length === 0) {
        setPuzzle(null);
        return;
      }
      const startIdx = Math.floor(Math.random() * filtered.length);
      indexRef.current = startIdx;
      setPuzzle(filtered[startIdx]);
    },
    [applyFilter],
  );

  const nextPuzzle = useCallback(() => {
    const filtered = filteredRef.current;
    if (filtered.length === 0) return;
    indexRef.current = (indexRef.current + 1) % filtered.length;
    setPuzzle(filtered[indexRef.current]);
  }, []);

  return { puzzle, loading, error, theme, loadPuzzle, nextPuzzle, totalCount };
}
