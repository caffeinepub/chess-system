import { CheckCircle2, Circle, RefreshCw, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { LevelUpResult, Quest } from "../hooks/useGameState";

interface DailyQuestsCardProps {
  quests: Quest[];
  onComplete: (questId: string) => LevelUpResult;
  onReset: () => void;
  onLevelUp: (result: LevelUpResult) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Tactics: "oklch(0.65 0.22 25)",
  Endgame: "oklch(0.62 0.19 255)",
  Opening: "oklch(0.79 0.15 165)",
  Positional: "oklch(0.49 0.22 275)",
  Blitz: "oklch(0.82 0.18 85)",
};

const DIFFICULTY_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Easy: {
    bg: "oklch(0.79 0.15 165 / 0.15)",
    text: "oklch(0.79 0.15 165)",
    border: "oklch(0.79 0.15 165 / 0.4)",
  },
  Medium: {
    bg: "oklch(0.62 0.19 255 / 0.15)",
    text: "oklch(0.62 0.19 255)",
    border: "oklch(0.62 0.19 255 / 0.4)",
  },
  Hard: {
    bg: "oklch(0.65 0.22 25 / 0.15)",
    text: "oklch(0.65 0.22 25)",
    border: "oklch(0.65 0.22 25 / 0.4)",
  },
  Legendary: {
    bg: "oklch(0.82 0.18 85 / 0.15)",
    text: "oklch(0.82 0.18 85)",
    border: "oklch(0.82 0.18 85 / 0.4)",
  },
};

export function DailyQuestsCard({
  quests,
  onComplete,
  onReset,
  onLevelUp,
}: DailyQuestsCardProps) {
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [xpPopups, setXpPopups] = useState<
    { id: string; xp: number; key: number }[]
  >([]);

  const completedCount = quests.filter((q) => q.completed).length;
  const totalCount = quests.length;

  const handleComplete = useCallback(
    async (quest: Quest) => {
      if (quest.completed || completingId) return;
      setCompletingId(quest.id);
      await new Promise((r) => setTimeout(r, 300));

      const result = onComplete(quest.id);
      const key = Date.now();
      setXpPopups((prev) => [
        ...prev,
        { id: quest.id, xp: result.xpGained, key },
      ]);
      setTimeout(
        () => setXpPopups((prev) => prev.filter((p) => p.key !== key)),
        2000,
      );

      toast.success("Quest completed. The System records your progress.", {
        style: {
          background: "oklch(0.15 0.018 255)",
          border: "1px solid oklch(0.62 0.19 255 / 0.5)",
          color: "oklch(0.92 0 0)",
        },
      });

      setCompletingId(null);
      if (result.leveledUp) setTimeout(() => onLevelUp(result), 500);
    },
    [completingId, onComplete, onLevelUp],
  );

  return (
    <motion.div
      className="card-glass rounded-2xl p-6 neon-border-blue h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2
            className="font-display font-bold text-sm tracking-widest uppercase"
            style={{ color: "oklch(0.62 0.19 255)" }}
          >
            Daily Quests
          </h2>
          <div
            className="flex-1 h-px w-8"
            style={{ background: "oklch(0.62 0.19 255 / 0.3)" }}
          />
          <span
            className="text-xs font-mono"
            style={{ color: "oklch(0.60 0.01 255)" }}
          >
            {completedCount}/{totalCount}
          </span>
        </div>
        <button
          type="button"
          data-ocid="quests.reset.button"
          onClick={onReset}
          className="p-1.5 rounded-lg opacity-50 hover:opacity-100 transition-opacity"
          title="Reset quests"
        >
          <RefreshCw
            className="w-3.5 h-3.5"
            style={{ color: "oklch(0.62 0.19 255)" }}
          />
        </button>
      </div>

      <div
        className="h-1.5 rounded-full mb-5 overflow-hidden"
        style={{ background: "oklch(0.20 0.015 255)" }}
      >
        <motion.div
          className="h-full rounded-full xp-bar-fill"
          animate={{ width: `${(completedCount / totalCount) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div
        className="flex-1 space-y-3 overflow-y-auto"
        style={{ maxHeight: "420px" }}
      >
        {quests.map((quest, i) => {
          const catColor =
            CATEGORY_COLORS[quest.category] ?? "oklch(0.60 0.01 255)";
          const diffStyle = DIFFICULTY_STYLES[quest.difficulty];
          const isCompleting = completingId === quest.id;
          const popup = xpPopups.find((p) => p.id === quest.id);

          return (
            <div
              key={quest.id}
              data-ocid={`quest.item.${i + 1}`}
              className="relative rounded-xl p-3 transition-all duration-200"
              style={{
                background: quest.completed
                  ? "oklch(0.13 0.015 255)"
                  : "oklch(0.17 0.020 255)",
                border: `1px solid ${quest.completed ? "oklch(0.25 0.015 255)" : "oklch(0.28 0.025 255 / 0.6)"}`,
                opacity: quest.completed ? 0.6 : 1,
              }}
            >
              <AnimatePresence>
                {popup && (
                  <motion.div
                    key={popup.key}
                    className="absolute -top-6 right-4 font-mono font-bold text-sm pointer-events-none z-10"
                    style={{
                      color: "oklch(0.82 0.18 85)",
                      textShadow: "0 0 10px oklch(0.82 0.18 85 / 0.8)",
                    }}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -30 }}
                    transition={{ duration: 1.5 }}
                  >
                    +{popup.xp} XP
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {quest.completed ? (
                    <CheckCircle2
                      className="w-5 h-5"
                      style={{ color: "oklch(0.79 0.15 165)" }}
                    />
                  ) : (
                    <Circle
                      className="w-5 h-5"
                      style={{ color: "oklch(0.40 0.01 255)" }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span
                      className="font-body font-semibold text-sm"
                      style={{
                        color: quest.completed
                          ? "oklch(0.50 0.01 255)"
                          : "oklch(0.92 0 0)",
                      }}
                    >
                      {quest.title}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded text-xs font-mono"
                      style={{
                        background: `${catColor}22`,
                        color: catColor,
                        border: `1px solid ${catColor}44`,
                      }}
                    >
                      {quest.category}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded text-xs font-mono"
                      style={{
                        background: diffStyle.bg,
                        color: diffStyle.text,
                        border: `1px solid ${diffStyle.border}`,
                      }}
                    >
                      {quest.difficulty}
                    </span>
                  </div>
                  <p
                    className="text-xs mb-2"
                    style={{ color: "oklch(0.55 0.01 255)", lineHeight: "1.4" }}
                  >
                    {quest.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Zap
                        className="w-3 h-3"
                        style={{ color: "oklch(0.82 0.18 85)" }}
                      />
                      <span
                        className="text-xs font-mono font-bold"
                        style={{ color: "oklch(0.82 0.18 85)" }}
                      >
                        {quest.xpReward} XP
                      </span>
                    </div>
                    {!quest.completed && (
                      <button
                        type="button"
                        data-ocid={`quest.complete.button.${i + 1}`}
                        onClick={() => handleComplete(quest)}
                        disabled={!!completingId}
                        className="px-3 py-1 rounded-lg text-xs font-mono font-semibold tracking-wider uppercase transition-all duration-200 hover:scale-105 disabled:opacity-50"
                        style={{
                          background: isCompleting
                            ? "oklch(0.62 0.19 255 / 0.3)"
                            : "linear-gradient(135deg, oklch(0.62 0.19 255 / 0.2), oklch(0.49 0.22 275 / 0.2))",
                          border: "1px solid oklch(0.62 0.19 255 / 0.4)",
                          color: "oklch(0.82 0.12 200)",
                        }}
                      >
                        {isCompleting ? "..." : "Complete"}
                      </button>
                    )}
                    {quest.completed && (
                      <span
                        className="text-xs font-mono"
                        style={{ color: "oklch(0.79 0.15 165)" }}
                      >
                        ✓ Done
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
