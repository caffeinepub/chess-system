import { Skull, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { LevelUpResult } from "../hooks/useGameState";

interface WeeklyBossCardProps {
  isCompleted: boolean;
  onComplete: () => LevelUpResult;
  onLevelUp: (result: LevelUpResult) => void;
}

export function WeeklyBossCard({
  isCompleted,
  onComplete,
  onLevelUp,
}: WeeklyBossCardProps) {
  const [completing, setCompleting] = useState(false);

  const handleComplete = async () => {
    if (completing || isCompleted) return;
    setCompleting(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = onComplete();
    toast.success("Weekly Boss defeated! The System acknowledges your power.", {
      style: {
        background: "oklch(0.15 0.018 255)",
        border: "1px solid oklch(0.65 0.22 25 / 0.5)",
        color: "oklch(0.92 0 0)",
      },
    });
    setCompleting(false);
    if (result.leveledUp) setTimeout(() => onLevelUp(result), 500);
  };

  return (
    <motion.div
      className="card-glass rounded-2xl p-6 neon-border-red h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Skull
          className="w-5 h-5"
          style={{
            color: "oklch(0.65 0.22 25)",
            filter: "drop-shadow(0 0 6px oklch(0.65 0.22 25 / 0.8))",
          }}
        />
        <h2
          className="font-display font-bold text-sm tracking-widest uppercase"
          style={{ color: "oklch(0.65 0.22 25)" }}
        >
          Weekly Boss
        </h2>
        <div
          className="flex-1 h-px"
          style={{ background: "oklch(0.65 0.22 25 / 0.3)" }}
        />
      </div>

      <div
        className="rounded-xl p-4 mb-4"
        style={{
          background: "oklch(0.65 0.22 25 / 0.08)",
          border: "1px solid oklch(0.65 0.22 25 / 0.2)",
        }}
      >
        <div className="text-center mb-3">
          <div
            className="font-display font-extrabold text-3xl mb-1"
            style={{ color: "oklch(0.92 0 0)" }}
          >
            ♛ THE IMMORTAL GAMBIT
          </div>
          <p
            className="text-sm"
            style={{ color: "oklch(0.60 0.01 255)", lineHeight: "1.5" }}
          >
            A legendary positional sacrifice opens the way to glory. Solve this
            masterpiece — an opening gambit favored by immortals. Survive the
            complications. Convert the advantage.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span
            className="px-3 py-1 rounded-full text-xs font-mono font-bold"
            style={{
              background: "oklch(0.82 0.18 85 / 0.15)",
              border: "1px solid oklch(0.82 0.18 85 / 0.5)",
              color: "oklch(0.82 0.18 85)",
            }}
          >
            ✦ LEGENDARY
          </span>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" style={{ color: "oklch(0.82 0.18 85)" }} />
            <span
              className="font-mono font-bold text-sm"
              style={{
                color: "oklch(0.82 0.18 85)",
                textShadow: "0 0 10px oklch(0.82 0.18 85 / 0.6)",
              }}
            >
              500 XP
            </span>
          </div>
        </div>
      </div>

      <div
        className="mb-4 text-xs"
        style={{ color: "oklch(0.55 0.01 255)", lineHeight: "1.5" }}
      >
        <strong style={{ color: "oklch(0.75 0.01 255)" }}>Challenge:</strong>{" "}
        Play 5 consecutive games using the Evans Gambit (1.e4 e5 2.Nf3 Nc6 3.Bc4
        Bc5 4.b4). Win at least 3. Study Morphy’s immortal games for
        inspiration. Submit your game results by analyzing with Stockfish.
      </div>

      {isCompleted ? (
        <div
          className="text-center py-3 rounded-xl"
          style={{
            background: "oklch(0.79 0.15 165 / 0.1)",
            border: "1px solid oklch(0.79 0.15 165 / 0.3)",
          }}
          data-ocid="boss.success_state"
        >
          <div
            className="font-display font-bold text-sm tracking-widest"
            style={{ color: "oklch(0.79 0.15 165)" }}
          >
            ✓ BOSS DEFEATED THIS WEEK
          </div>
        </div>
      ) : (
        <button
          type="button"
          data-ocid="boss.complete.primary_button"
          onClick={handleComplete}
          disabled={completing}
          className="w-full py-3 rounded-xl font-display font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
          style={{
            background: completing
              ? "oklch(0.20 0.02 255)"
              : "linear-gradient(135deg, oklch(0.65 0.22 25 / 0.3), oklch(0.50 0.20 30 / 0.3))",
            border: "1px solid oklch(0.65 0.22 25 / 0.5)",
            color: "oklch(0.90 0.10 35)",
            boxShadow: completing
              ? "none"
              : "0 0 20px oklch(0.65 0.22 25 / 0.2)",
          }}
        >
          {completing ? "Challenging..." : "Challenge Boss"}
        </button>
      )}
    </motion.div>
  );
}
