import { Check, Pencil, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { RANKS, getRankForLevel, getXpNeeded } from "../hooks/useGameState";
import type { GameState } from "../hooks/useGameState";

interface PlayerProfileCardProps {
  state: GameState;
  onUpdateName: (name: string) => void;
}

export function PlayerProfileCard({
  state,
  onUpdateName,
}: PlayerProfileCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(state.playerName);
  const inputRef = useRef<HTMLInputElement>(null);
  const rank = getRankForLevel(state.level);
  const xpNeeded = getXpNeeded(state.level);
  const xpPercent = Math.min(100, (state.xp / xpNeeded) * 100);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const handleSave = () => {
    if (draft.trim()) onUpdateName(draft.trim().toUpperCase());
    setEditing(false);
  };

  return (
    <motion.div
      className="card-glass rounded-2xl p-6 neon-border-blue h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center gap-2 mb-5">
        <h2
          className="font-display font-bold text-sm tracking-widest uppercase"
          style={{ color: "oklch(0.62 0.19 255)" }}
        >
          Player Profile
        </h2>
        <div
          className="flex-1 h-px"
          style={{ background: "oklch(0.62 0.19 255 / 0.3)" }}
        />
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-display font-extrabold text-3xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.20 0.03 255), oklch(0.15 0.025 255))",
              border: `3px solid ${rank.color}`,
              boxShadow: `0 0 20px ${rank.color}66, 0 0 40px ${rank.color}33`,
              color: rank.color,
            }}
          >
            ♞
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.62 0.19 255), oklch(0.49 0.22 275))",
              color: "white",
              border: "2px solid oklch(0.10 0.022 255)",
            }}
          >
            {state.level}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {editing ? (
            <>
              <input
                ref={inputRef}
                data-ocid="profile.input"
                className="bg-transparent border-b text-center font-display font-bold text-sm tracking-widest uppercase outline-none"
                style={{
                  borderColor: "oklch(0.62 0.19 255)",
                  color: "oklch(0.92 0 0)",
                  width: "140px",
                }}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") setEditing(false);
                }}
              />
              <button
                type="button"
                data-ocid="profile.save_button"
                onClick={handleSave}
                className="p-1 rounded"
                style={{ color: "oklch(0.79 0.15 165)" }}
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                data-ocid="profile.cancel_button"
                onClick={() => setEditing(false)}
                className="p-1 rounded"
                style={{ color: "oklch(0.65 0.22 25)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <span
                className="font-display font-bold text-sm tracking-widest uppercase"
                style={{ color: "oklch(0.92 0 0)" }}
              >
                {state.playerName}
              </span>
              <button
                type="button"
                data-ocid="profile.edit_button"
                onClick={() => {
                  setDraft(state.playerName);
                  setEditing(true);
                }}
                className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity"
              >
                <Pencil
                  className="w-3 h-3"
                  style={{ color: "oklch(0.62 0.19 255)" }}
                />
              </button>
            </>
          )}
        </div>

        <div
          className="mt-1 px-3 py-0.5 rounded-full text-xs font-mono font-semibold tracking-widest"
          style={{
            background: `${rank.color}22`,
            border: `1px solid ${rank.color}66`,
            color: rank.color,
          }}
        >
          {rank.rank === "Absolute" ? "✦ ABSOLUTE ✦" : `RANK ${rank.rank}`}
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-mono tracking-widest"
            style={{ color: "oklch(0.60 0.01 255)" }}
          >
            LEVEL {state.level}
          </span>
          <span
            className="text-xs font-mono"
            style={{ color: "oklch(0.60 0.01 255)" }}
          >
            {state.xp} / {xpNeeded} XP
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "oklch(0.20 0.015 255)" }}
        >
          <motion.div
            className="h-full rounded-full xp-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div
          className="text-xs font-mono mt-1 text-right"
          style={{ color: "oklch(0.50 0.01 255)" }}
        >
          {Math.round(xpPercent)}%
        </div>
      </div>

      <div>
        <div
          className="text-xs font-mono tracking-widest mb-2"
          style={{ color: "oklch(0.50 0.01 255)" }}
        >
          RANK LADDER
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {RANKS.map((r) => {
            const isCurrent = r.rank === rank.rank;
            const isPast = state.level > r.maxLevel;
            return (
              <div
                key={r.rank}
                className="w-8 h-8 rounded flex items-center justify-center text-xs font-mono font-bold transition-all"
                style={{
                  background: isCurrent
                    ? `${r.color}22`
                    : isPast
                      ? "oklch(0.18 0.015 255)"
                      : "oklch(0.13 0.015 255)",
                  border: `1px solid ${isCurrent ? r.color : isPast ? `${r.color}55` : "oklch(0.25 0.015 255)"}`,
                  color: isCurrent
                    ? r.color
                    : isPast
                      ? `${r.color}88`
                      : "oklch(0.40 0.01 255)",
                  boxShadow: isCurrent ? `0 0 10px ${r.color}44` : "none",
                  fontSize:
                    r.rank === "National" ||
                    r.rank === "Monarch" ||
                    r.rank === "Absolute"
                      ? "7px"
                      : undefined,
                }}
              >
                {r.rank === "National"
                  ? "NAT"
                  : r.rank === "Monarch"
                    ? "MON"
                    : r.rank === "Absolute"
                      ? "ABS"
                      : r.rank}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
