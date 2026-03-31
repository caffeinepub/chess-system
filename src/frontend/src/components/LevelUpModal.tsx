import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { getRankForLevel } from "../hooks/useGameState";
import type { LevelUpResult } from "../hooks/useGameState";

interface LevelUpModalProps {
  result: LevelUpResult | null;
  onClose: () => void;
}

export function LevelUpModal({ result, onClose }: LevelUpModalProps) {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    if (result) {
      setParticles(Array.from({ length: 20 }, (_, i) => i));
      const timer = setTimeout(() => setParticles([]), 2500);
      return () => clearTimeout(timer);
    }
  }, [result]);

  if (!result) return null;

  const newRankInfo = getRankForLevel(result.newLevel);
  const oldRankInfo = getRankForLevel(result.newLevel - 1);

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          data-ocid="levelup.modal"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: "oklch(0.05 0.015 255 / 0.92)",
            backdropFilter: "blur(20px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {particles.map((i) => (
            <div
              key={`particle-modal-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${4 + (i % 4)}px`,
                height: `${4 + (i % 4)}px`,
                left: `${5 + i * 4.5}%`,
                bottom: "20%",
                background:
                  i % 3 === 0
                    ? "oklch(0.82 0.18 85)"
                    : i % 3 === 1
                      ? "oklch(0.62 0.19 255)"
                      : "oklch(0.49 0.22 275)",
                boxShadow: `0 0 8px ${i % 3 === 0 ? "oklch(0.82 0.18 85)" : "oklch(0.62 0.19 255)"}`,
                animation: `particle-rise ${1.5 + (i % 3) * 0.4}s ease-out ${i * 0.07}s forwards`,
              }}
            />
          ))}

          <motion.div
            className="relative text-center px-8 py-12 rounded-3xl max-w-lg w-full mx-4"
            style={{
              background: "oklch(0.12 0.025 255)",
              border: "2px solid oklch(0.82 0.18 85 / 0.6)",
              boxShadow:
                "0 0 60px oklch(0.82 0.18 85 / 0.3), 0 0 120px oklch(0.62 0.19 255 / 0.2)",
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ boxShadow: "inset 0 0 60px oklch(0.82 0.18 85 / 0.05)" }}
            />

            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <div
                className="font-display font-extrabold tracking-widest uppercase mb-2"
                style={{
                  fontSize: "clamp(2rem, 8vw, 3.5rem)",
                  letterSpacing: "0.1em",
                }}
              >
                <span
                  className="animate-levelup-glow"
                  style={{ color: "oklch(0.82 0.18 85)" }}
                >
                  LEVEL UP!
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <div
                    className="text-2xl font-display font-bold"
                    style={{ color: "oklch(0.60 0.01 255)" }}
                  >
                    {result.newLevel - 1}
                  </div>
                  <div
                    className="text-xs font-mono"
                    style={{ color: "oklch(0.45 0.01 255)" }}
                  >
                    BEFORE
                  </div>
                </div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: "oklch(0.82 0.18 85)" }}
                >
                  →
                </div>
                <div className="text-center">
                  <div
                    className="text-4xl font-display font-extrabold animate-levelup-glow"
                    style={{ color: "oklch(0.82 0.18 85)" }}
                  >
                    {result.newLevel}
                  </div>
                  <div
                    className="text-xs font-mono"
                    style={{ color: "oklch(0.70 0.10 85)" }}
                  >
                    NEW LEVEL
                  </div>
                </div>
              </div>

              {result.rankChanged && (
                <motion.div
                  className="mb-4 p-4 rounded-2xl"
                  style={{
                    background: `${newRankInfo.color}11`,
                    border: `2px solid ${newRankInfo.color}66`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <div
                    className="font-display font-bold text-lg tracking-widest uppercase mb-1"
                    style={{ color: newRankInfo.color }}
                  >
                    ✦ RANK UP!
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span
                      className="font-mono font-bold"
                      style={{ color: oldRankInfo.color }}
                    >
                      {oldRankInfo.rank}
                    </span>
                    <span style={{ color: "oklch(0.60 0.01 255)" }}>→</span>
                    <span
                      className="font-mono font-bold text-xl"
                      style={{
                        color: newRankInfo.color,
                        textShadow: `0 0 20px ${newRankInfo.color}88`,
                      }}
                    >
                      {newRankInfo.rank}
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p
                className="font-body text-sm mb-6"
                style={{ color: "oklch(0.55 0.01 255)", fontStyle: "italic" }}
              >
                "You have proven your worth. Level {result.newLevel} achieved."
                {result.rankChanged && (
                  <>
                    {" "}
                    A new power stirs within you. Rank [{result.newRank}]
                    unlocked.
                  </>
                )}
              </p>
              <p
                className="text-xs font-mono mb-1"
                style={{ color: "oklch(0.45 0.01 255)" }}
              >
                THE SYSTEM ACKNOWLEDGES YOUR GROWTH.
              </p>
              <button
                type="button"
                data-ocid="levelup.close_button"
                onClick={onClose}
                className="mt-4 px-8 py-3 rounded-xl font-display font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.62 0.19 255), oklch(0.49 0.22 275))",
                  color: "white",
                  boxShadow: "0 0 20px oklch(0.62 0.19 255 / 0.4)",
                }}
              >
                I Understand
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
