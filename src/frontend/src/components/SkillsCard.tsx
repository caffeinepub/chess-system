import { motion } from "motion/react";
import type { Skills } from "../backend.d";

interface SkillsCardProps {
  level: number;
}

const SKILLS = [
  { key: "calculation", label: "Calculation", icon: "⚡" },
  { key: "patternRecognition", label: "Pattern Recognition", icon: "👁" },
  { key: "endgameTechnique", label: "Endgame Technique", icon: "♚" },
  { key: "openingKnowledge", label: "Opening Knowledge", icon: "📖" },
  { key: "timeManagement", label: "Time Management", icon: "⏱" },
] as const;

function skillValue(level: number, index: number): number {
  const base = Math.min(95, Math.floor(level * 2.5 + (index * 7 + 5)));
  return Math.min(99, base);
}

export function SkillsCard({ level }: SkillsCardProps) {
  return (
    <motion.div
      className="card-glass rounded-2xl p-6 neon-border-violet h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <h2
          className="font-display font-bold text-sm tracking-widest uppercase"
          style={{ color: "oklch(0.72 0.17 280)" }}
        >
          Skills
        </h2>
        <div
          className="flex-1 h-px"
          style={{ background: "oklch(0.49 0.22 275 / 0.3)" }}
        />
        <span
          className="text-xs font-mono"
          style={{ color: "oklch(0.60 0.01 255)" }}
        >
          LVL {level}
        </span>
      </div>

      <div className="space-y-5">
        {SKILLS.map((skill, i) => {
          const value = skillValue(level, i);
          return (
            <div key={skill.key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{skill.icon}</span>
                  <span
                    className="text-xs font-body font-semibold tracking-wide"
                    style={{ color: "oklch(0.80 0.01 255)" }}
                  >
                    {skill.label}
                  </span>
                </div>
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: "oklch(0.72 0.17 280)" }}
                >
                  {value}
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "oklch(0.20 0.015 255)" }}
              >
                <motion.div
                  className="h-full rounded-full skill-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, delay: 0.1 * i, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div
        className="mt-6 p-3 rounded-xl"
        style={{
          background: "oklch(0.12 0.020 255)",
          border: "1px solid oklch(0.49 0.22 275 / 0.2)",
        }}
      >
        <div
          className="text-xs font-mono tracking-wider mb-1"
          style={{ color: "oklch(0.72 0.17 280)" }}
        >
          SYSTEM TIP
        </div>
        <p
          className="text-xs"
          style={{ color: "oklch(0.55 0.01 255)", lineHeight: "1.5" }}
        >
          Complete daily quests to accelerate skill growth. The System rewards
          consistent training.
        </p>
      </div>
    </motion.div>
  );
}
