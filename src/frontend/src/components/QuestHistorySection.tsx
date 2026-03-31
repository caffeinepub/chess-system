import { Clock, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { QuestHistoryEntry } from "../hooks/useGameState";

interface QuestHistorySectionProps {
  history: QuestHistoryEntry[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Tactics: "oklch(0.65 0.22 25)",
  Endgame: "oklch(0.62 0.19 255)",
  Opening: "oklch(0.79 0.15 165)",
  Positional: "oklch(0.49 0.22 275)",
  Blitz: "oklch(0.82 0.18 85)",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

export function QuestHistorySection({ history }: QuestHistorySectionProps) {
  return (
    <motion.div
      className="card-glass rounded-2xl p-6 neon-border-violet"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Clock className="w-4 h-4" style={{ color: "oklch(0.72 0.17 280)" }} />
        <h2
          className="font-display font-bold text-sm tracking-widest uppercase"
          style={{ color: "oklch(0.72 0.17 280)" }}
        >
          Quest History
        </h2>
        <div
          className="flex-1 h-px"
          style={{ background: "oklch(0.49 0.22 275 / 0.3)" }}
        />
        <span
          className="text-xs font-mono"
          style={{ color: "oklch(0.50 0.01 255)" }}
        >
          {history.length} completed
        </span>
      </div>

      {history.length === 0 ? (
        <div data-ocid="history.empty_state" className="text-center py-12">
          <div className="text-4xl mb-3">📜</div>
          <p
            className="text-sm font-body"
            style={{ color: "oklch(0.45 0.01 255)" }}
          >
            No quest records yet. Complete your first quest to begin your
            legend.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.slice(0, 20).map((entry, i) => (
            <div
              key={`${entry.questId}-${entry.completedAt}`}
              data-ocid={`history.item.${i + 1}`}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: "oklch(0.17 0.018 255)",
                border: "1px solid oklch(0.25 0.018 255 / 0.6)",
              }}
            >
              <div
                className="w-1.5 h-8 rounded-full flex-shrink-0"
                style={{
                  background:
                    CATEGORY_COLORS[entry.category] ?? "oklch(0.50 0.01 255)",
                }}
              />
              <div className="flex-1 min-w-0">
                <div
                  className="text-xs font-body font-semibold truncate"
                  style={{ color: "oklch(0.80 0.01 255)" }}
                >
                  {entry.title}
                </div>
                <div
                  className="text-xs font-mono"
                  style={{ color: "oklch(0.45 0.01 255)" }}
                >
                  {timeAgo(entry.completedAt)}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Zap
                  className="w-3 h-3"
                  style={{ color: "oklch(0.82 0.18 85)" }}
                />
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: "oklch(0.82 0.18 85)" }}
                >
                  +{entry.xpEarned}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
