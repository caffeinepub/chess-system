import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LevelUpResult } from "../hooks/useGameState";
import { LICHESS_THEMES, useLichessPuzzle } from "../hooks/useLichessPuzzle";
import {
  calculateNewElo,
  getPlayerElo,
  savePlayerElo,
} from "../utils/eloRating";
import { PuzzleBoard } from "./PuzzleBoard";

interface LichessPuzzleSectionProps {
  onLevelUp: (result: LevelUpResult) => void;
  earnXp: (amount: number) => LevelUpResult | null;
}

export function LichessPuzzleSection({ earnXp }: LichessPuzzleSectionProps) {
  const { puzzle, loading, error, theme, loadPuzzle, nextPuzzle } =
    useLichessPuzzle();
  const [solved, setSolved] = useState(false);
  const [playerElo, setPlayerElo] = useState(() => getPlayerElo());
  const [eloChange, setEloChange] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const themeBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPuzzle("mix");
  }, [loadPuzzle]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: optional chaining is valid dep here
  useEffect(() => {
    setSolved(false);
    setFeedback(null);
    setEloChange(null);
  }, [puzzle?.id]);

  const handleCorrect = useCallback(() => {
    if (!puzzle) return;
    const lichessRating = (puzzle as any).lichessRating ?? 1200;
    const newElo = calculateNewElo(playerElo, lichessRating, true);
    const change = newElo - playerElo;
    setPlayerElo(newElo);
    savePlayerElo(newElo);
    setEloChange(change);
    setFeedback("correct");
    setSolved(true);
    earnXp(puzzle.xpReward);
  }, [puzzle, playerElo, earnXp]);

  const handleWrong = useCallback(() => {
    if (!puzzle || solved) return;
    const lichessRating = (puzzle as any).lichessRating ?? 1200;
    const newElo = calculateNewElo(playerElo, lichessRating, false);
    const change = newElo - playerElo;
    setPlayerElo(newElo);
    savePlayerElo(newElo);
    setEloChange(change);
    setFeedback("wrong");
  }, [puzzle, playerElo, solved]);

  const handleNext = useCallback(() => {
    nextPuzzle();
  }, [nextPuzzle]);

  const handleThemeSelect = useCallback(
    (themeKey: string) => {
      loadPuzzle(themeKey);
    },
    [loadPuzzle],
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="font-display font-extrabold text-3xl uppercase tracking-widest mb-2"
          style={{ color: "oklch(0.92 0 0)" }}
        >
          Puzzles
        </h1>
        <p
          className="text-sm font-body"
          style={{ color: "oklch(0.55 0.01 255)" }}
        >
          Live puzzles from the Lichess database — rated, themed, and endless.
        </p>
      </div>

      {/* Rating Header */}
      <div
        className="flex items-center justify-between rounded-xl px-6 py-4 mb-6"
        style={{
          background: "oklch(0.15 0.02 255)",
          border: "1px solid oklch(0.25 0.04 255)",
        }}
      >
        <div>
          <div
            className="text-xs font-mono uppercase tracking-widest mb-1"
            style={{ color: "oklch(0.55 0.01 255)" }}
          >
            Your Puzzle Rating
          </div>
          <div className="flex items-end gap-2">
            <motion.span
              key={playerElo}
              initial={{ scale: 1.2, color: "oklch(0.92 0 0)" }}
              animate={{ scale: 1, color: "oklch(0.92 0 0)" }}
              className="text-4xl font-display font-extrabold"
              style={{ color: "oklch(0.92 0 0)" }}
            >
              {playerElo}
            </motion.span>
            <AnimatePresence>
              {eloChange !== null && (
                <motion.span
                  key={`change-${eloChange}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-lg font-bold mb-1"
                  style={{
                    color:
                      eloChange >= 0
                        ? "oklch(0.72 0.20 142)"
                        : "oklch(0.65 0.22 25)",
                  }}
                >
                  {eloChange >= 0 ? "+" : ""}
                  {eloChange}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {puzzle && (puzzle as any).lichessRating && (
          <div className="text-right">
            <div
              className="text-xs font-mono uppercase tracking-widest mb-1"
              style={{ color: "oklch(0.55 0.01 255)" }}
            >
              Puzzle Rating
            </div>
            <div
              className="text-3xl font-display font-extrabold"
              style={{ color: "oklch(0.72 0.19 255)" }}
            >
              {(puzzle as any).lichessRating}
            </div>
          </div>
        )}
      </div>

      {/* Theme Filter Bar */}
      <div
        ref={themeBarRef}
        className="flex gap-2 overflow-x-auto pb-3 mb-6"
        style={{ scrollbarWidth: "thin" }}
        data-ocid="puzzles.tab"
      >
        {LICHESS_THEMES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => handleThemeSelect(t.key)}
            data-ocid="puzzles.tab"
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all"
            style={{
              background:
                theme === t.key
                  ? "oklch(0.62 0.19 255)"
                  : "oklch(0.18 0.02 255)",
              color:
                theme === t.key ? "oklch(0.98 0 0)" : "oklch(0.55 0.01 255)",
              border:
                theme === t.key
                  ? "1px solid oklch(0.72 0.19 255)"
                  : "1px solid oklch(0.25 0.04 255)",
              flexShrink: 0,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Puzzle Area */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Board */}
        <div className="flex-shrink-0">
          {loading && (
            <div
              data-ocid="puzzles.loading_state"
              className="flex items-center justify-center"
              style={{ width: 500, height: 500 }}
            >
              <div className="text-center">
                <Skeleton className="w-[480px] h-[480px] rounded-lg" />
              </div>
            </div>
          )}
          {error && !loading && (
            <div
              data-ocid="puzzles.error_state"
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 500,
                height: 500,
                background: "oklch(0.15 0.02 255)",
                border: "1px solid oklch(0.65 0.22 25 / 0.4)",
              }}
            >
              <div className="text-center px-8">
                <div
                  className="text-4xl mb-4"
                  style={{ color: "oklch(0.65 0.22 25)" }}
                >
                  ⚠
                </div>
                <p
                  className="text-sm font-mono mb-4"
                  style={{ color: "oklch(0.65 0.22 25)" }}
                >
                  {error}
                </p>
                <Button
                  onClick={() => loadPuzzle(theme)}
                  data-ocid="puzzles.primary_button"
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}
          {puzzle && !loading && (
            <PuzzleBoard
              puzzle={puzzle}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
              solved={solved}
            />
          )}
        </div>

        {/* Puzzle Info Panel */}
        <div className="flex-1 min-w-0">
          {puzzle && !loading && (
            <motion.div
              key={puzzle.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="rounded-xl p-6 mb-4"
                style={{
                  background: "oklch(0.15 0.02 255)",
                  border: "1px solid oklch(0.25 0.04 255)",
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2
                    className="font-display font-bold text-xl uppercase tracking-wide"
                    style={{ color: "oklch(0.92 0 0)" }}
                  >
                    {puzzle.title}
                  </h2>
                  <Badge
                    variant="outline"
                    className="text-xs font-mono shrink-0"
                    style={{
                      color: "oklch(0.72 0.19 255)",
                      borderColor: "oklch(0.62 0.19 255 / 0.5)",
                    }}
                  >
                    {puzzle.theme}
                  </Badge>
                </div>
                <p
                  className="text-sm font-body mb-4"
                  style={{ color: "oklch(0.65 0.01 255)" }}
                >
                  {puzzle.description}
                </p>
                <div
                  className="text-xs font-mono uppercase"
                  style={{ color: "oklch(0.45 0.01 255)" }}
                >
                  {puzzle.sideToMove === "white" ? "White" : "Black"} to move
                </div>
              </div>

              {/* Themes Tags */}
              {(puzzle as any).themes?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {(puzzle as any).themes.slice(0, 6).map((t: string) => (
                    <span
                      key={t}
                      className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{
                        background: "oklch(0.20 0.03 255)",
                        color: "oklch(0.55 0.01 255)",
                        border: "1px solid oklch(0.25 0.04 255)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-lg px-4 py-3 mb-4"
                    data-ocid={
                      feedback === "correct"
                        ? "puzzles.success_state"
                        : "puzzles.error_state"
                    }
                    style={{
                      background:
                        feedback === "correct"
                          ? "oklch(0.72 0.20 142 / 0.12)"
                          : "oklch(0.65 0.22 25 / 0.12)",
                      border:
                        feedback === "correct"
                          ? "1px solid oklch(0.72 0.20 142 / 0.4)"
                          : "1px solid oklch(0.65 0.22 25 / 0.4)",
                    }}
                  >
                    <p
                      className="text-sm font-mono font-bold"
                      style={{
                        color:
                          feedback === "correct"
                            ? "oklch(0.72 0.20 142)"
                            : "oklch(0.65 0.22 25)",
                      }}
                    >
                      {feedback === "correct"
                        ? `✓ Correct! +${puzzle.xpReward} XP`
                        : "✗ Incorrect — keep trying"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* XP Reward */}
              <div
                className="flex items-center gap-2 text-xs font-mono mb-6"
                style={{ color: "oklch(0.55 0.01 255)" }}
              >
                <span>XP Reward:</span>
                <span style={{ color: "oklch(0.82 0.18 85)" }}>
                  +{puzzle.xpReward}
                </span>
              </div>

              <Button
                onClick={handleNext}
                disabled={loading}
                data-ocid="puzzles.primary_button"
                className="w-full font-mono uppercase tracking-widest"
                style={{
                  background: "oklch(0.62 0.19 255)",
                  color: "oklch(0.98 0 0)",
                }}
              >
                {solved ? "Next Puzzle →" : "Skip Puzzle →"}
              </Button>
            </motion.div>
          )}

          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
