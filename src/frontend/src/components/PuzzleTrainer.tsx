import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { PUZZLES } from "../data/puzzles";
import type { LevelUpResult } from "../hooks/useGameState";
import { PuzzleBoard } from "./PuzzleBoard";

interface PuzzleTrainerProps {
  onLevelUp: (result: LevelUpResult) => void;
  earnXp: (amount: number) => LevelUpResult;
}

const THEME_ICONS: Record<string, string> = {
  Fork: "⚔",
  "Back-Rank Mate": "💀",
  "Pin & Win": "📌",
  Skewer: "🗡",
  "Discovered Attack": "⚡",
  "Queen Fork": "👑",
  "Tactical Strike": "🔥",
  "Rook Endgame": "🏰",
};

export function PuzzleTrainer({ onLevelUp, earnXp }: PuzzleTrainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solvedSet, setSolvedSet] = useState<Set<string>>(new Set());
  const [wrongMessage, setWrongMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [xpGained, setXpGained] = useState(0);

  const puzzle = PUZZLES[currentIndex];
  const isSolved = solvedSet.has(puzzle.id);

  const handleCorrect = () => {
    if (isSolved) return;
    setSolvedSet((prev) => new Set(prev).add(puzzle.id));
    const result = earnXp(puzzle.xpReward);
    setXpGained(puzzle.xpReward);
    setSuccessMessage(true);
    if (result.leveledUp) {
      setTimeout(() => onLevelUp(result), 800);
    }
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  const handleWrong = () => {
    setWrongMessage(true);
    setTimeout(() => setWrongMessage(false), 1500);
  };

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setWrongMessage(false);
    setSuccessMessage(false);
  };

  const themeIcon = THEME_ICONS[puzzle.theme] ?? "♟";

  return (
    <div className="card-glass rounded-2xl p-6 neon-border-blue">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-mono tracking-widest px-3 py-1 rounded-full"
            style={{
              background: "oklch(0.62 0.19 255 / 0.15)",
              border: "1px solid oklch(0.62 0.19 255 / 0.4)",
              color: "oklch(0.82 0.12 200)",
            }}
          >
            PUZZLE {currentIndex + 1} / {PUZZLES.length}
          </span>
          <span
            className="text-xs font-mono tracking-widest px-3 py-1 rounded-full uppercase"
            style={{
              background: "oklch(0.49 0.22 275 / 0.15)",
              border: "1px solid oklch(0.49 0.22 275 / 0.4)",
              color: "oklch(0.82 0.18 300)",
            }}
          >
            {themeIcon} {puzzle.theme}
          </span>
        </div>
        <div
          className="text-xs font-mono tracking-widest px-3 py-1 rounded-full"
          style={{
            background: "oklch(0.82 0.18 85 / 0.1)",
            border: "1px solid oklch(0.82 0.18 85 / 0.3)",
            color: "oklch(0.82 0.18 85)",
          }}
        >
          +{puzzle.xpReward} XP
        </div>
      </div>

      {/* Title & description */}
      <div className="mb-6">
        <h3
          className="font-display font-bold text-lg uppercase tracking-widest mb-1"
          style={{ color: "oklch(0.92 0 0)" }}
        >
          {puzzle.title}
        </h3>
        <p
          className="text-sm font-body"
          style={{ color: "oklch(0.60 0.01 255)" }}
        >
          {puzzle.description}
        </p>
      </div>

      {/* Side to move */}
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-4 h-4 rounded-full border-2"
          style={{
            background:
              puzzle.sideToMove === "white"
                ? "oklch(0.92 0 0)"
                : "oklch(0.12 0 0)",
            borderColor: "oklch(0.62 0.19 255 / 0.6)",
          }}
        />
        <span
          className="text-xs font-mono tracking-wider uppercase"
          style={{ color: "oklch(0.62 0.19 255)" }}
        >
          {puzzle.sideToMove} to move
        </span>
      </div>

      {/* Board */}
      <div
        className="flex justify-center mb-5"
        data-ocid="puzzle.canvas_target"
      >
        <PuzzleBoard
          puzzle={puzzle}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
          solved={isSolved}
        />
      </div>

      {/* Feedback messages */}
      <div className="min-h-[36px] flex items-center justify-center mb-4">
        <AnimatePresence mode="wait">
          {successMessage && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="text-sm font-mono tracking-widest px-4 py-2 rounded-lg"
              style={{
                background: "oklch(0.72 0.20 142 / 0.15)",
                border: "1px solid oklch(0.72 0.20 142 / 0.5)",
                color: "oklch(0.80 0.18 142)",
              }}
              data-ocid="puzzle.success_state"
            >
              ⚡ SYSTEM: +{xpGained} XP AWARDED
            </motion.div>
          )}
          {wrongMessage && !successMessage && (
            <motion.div
              key="wrong"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="text-sm font-mono tracking-widest px-4 py-2 rounded-lg"
              style={{
                background: "oklch(0.65 0.22 25 / 0.15)",
                border: "1px solid oklch(0.65 0.22 25 / 0.5)",
                color: "oklch(0.75 0.18 25)",
              }}
              data-ocid="puzzle.error_state"
            >
              ✗ WRONG MOVE — TRY AGAIN
            </motion.div>
          )}
          {isSolved && !successMessage && !wrongMessage && (
            <motion.div
              key="solved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-mono tracking-widest px-4 py-2 rounded-lg"
              style={{
                background: "oklch(0.72 0.20 142 / 0.10)",
                border: "1px solid oklch(0.72 0.20 142 / 0.3)",
                color: "oklch(0.72 0.20 142)",
              }}
            >
              ✓ PUZZLE SOLVED
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => goTo(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          data-ocid="puzzle.pagination_prev"
          className="px-4 py-2 text-xs font-mono tracking-widest uppercase rounded-lg transition-all disabled:opacity-30"
          style={{
            background: "oklch(0.18 0.02 255)",
            border: "1px solid oklch(0.30 0.025 255 / 0.5)",
            color: "oklch(0.67 0.01 255)",
          }}
        >
          ← PREV
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {PUZZLES.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => goTo(i)}
              data-ocid={`puzzle.item.${i + 1}`}
              className="w-2.5 h-2.5 rounded-full transition-all duration-200"
              style={{
                background: solvedSet.has(p.id)
                  ? "oklch(0.72 0.20 142)"
                  : i === currentIndex
                    ? "oklch(0.62 0.19 255)"
                    : "oklch(0.28 0.025 255)",
                boxShadow:
                  i === currentIndex
                    ? "0 0 8px oklch(0.62 0.19 255 / 0.8)"
                    : "none",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(Math.min(PUZZLES.length - 1, currentIndex + 1))}
          disabled={currentIndex === PUZZLES.length - 1}
          data-ocid="puzzle.pagination_next"
          className="px-4 py-2 text-xs font-mono tracking-widest uppercase rounded-lg transition-all disabled:opacity-30"
          style={{
            background: "oklch(0.18 0.02 255)",
            border: "1px solid oklch(0.30 0.025 255 / 0.5)",
            color: "oklch(0.67 0.01 255)",
          }}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}
