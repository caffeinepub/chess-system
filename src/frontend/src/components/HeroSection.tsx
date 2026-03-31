import { Zap } from "lucide-react";
import { motion } from "motion/react";
import { getRankForLevel } from "../hooks/useGameState";

interface HeroSectionProps {
  playerName: string;
  level: number;
  totalXpEarned: number;
  onNavigate: (section: string) => void;
}

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: `particle-${i}`,
  size: 2 + (i % 3),
  left: 10 + i * 7,
  top: 20 + (i % 5) * 15,
  isBlue: i % 2 === 0,
  duration: 2 + (i % 3),
  delay: i * 0.4,
}));

export function HeroSection({
  playerName,
  level,
  totalXpEarned,
  onNavigate,
}: HeroSectionProps) {
  const rank = getRankForLevel(level);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "480px" }}
    >
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-chess-player.dim_800x600.jpg"
          alt="Shadow Chess Hero"
          className="w-full h-full object-cover object-center"
          style={{ opacity: 0.4 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.08 0.025 255 / 0.95) 0%, oklch(0.10 0.022 255 / 0.7) 50%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, oklch(0.09 0.020 255) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: p.isBlue
                ? "oklch(0.62 0.19 255)"
                : "oklch(0.49 0.22 275)",
              boxShadow: `0 0 6px ${p.isBlue ? "oklch(0.62 0.19 255)" : "oklch(0.49 0.22 275)"}`,
              animation: `particle-rise ${p.duration}s ease-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col lg:flex-row items-center justify-between gap-8">
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-widest uppercase"
              style={{
                background: "oklch(0.62 0.19 255 / 0.15)",
                border: "1px solid oklch(0.62 0.19 255 / 0.4)",
                color: "oklch(0.82 0.12 200)",
              }}
            >
              <Zap className="inline w-3 h-3 mr-1" />
              SYSTEM ACTIVE
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-mono font-semibold"
              style={{
                background: `${rank.color}22`,
                border: `1px solid ${rank.color}66`,
                color: rank.color,
              }}
            >
              RANK [{rank.rank}]
            </div>
          </div>

          <h1
            className="font-display font-extrabold uppercase leading-none mb-4"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              letterSpacing: "-0.02em",
              color: "oklch(0.96 0.01 255)",
            }}
          >
            ARISE,
            <br />
            <span
              style={{
                color: "oklch(0.62 0.19 255)",
                textShadow:
                  "0 0 30px oklch(0.62 0.19 255 / 0.6), 0 0 60px oklch(0.62 0.19 255 / 0.3)",
              }}
            >
              {playerName}
            </span>
          </h1>

          <p
            className="font-body text-base mb-8"
            style={{
              color: "oklch(0.67 0.01 255)",
              maxWidth: "420px",
              lineHeight: "1.6",
            }}
          >
            The System has awakened. Complete your daily quests, conquer the
            Weekly Boss, and ascend the ranks. Your chess mastery begins now.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              data-ocid="hero.quests.primary_button"
              onClick={() => onNavigate("quests")}
              className="px-6 py-3 rounded-lg font-body font-semibold text-sm tracking-widest uppercase transition-all duration-200 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.62 0.19 255), oklch(0.49 0.22 275))",
                color: "white",
                boxShadow: "0 0 20px oklch(0.62 0.19 255 / 0.4)",
              }}
            >
              Begin Quests
            </button>
            <button
              type="button"
              data-ocid="hero.skills.secondary_button"
              onClick={() => onNavigate("skills")}
              className="px-6 py-3 rounded-lg font-body font-semibold text-sm tracking-widest uppercase transition-all duration-200"
              style={{
                background: "oklch(0.15 0.018 255 / 0.8)",
                border: "1px solid oklch(0.62 0.19 255 / 0.4)",
                color: "oklch(0.82 0.12 200)",
              }}
            >
              View Skills
            </button>
          </div>

          <div className="flex gap-6 mt-8">
            {[
              { label: "LEVEL", value: level },
              { label: "TOTAL XP", value: totalXpEarned.toLocaleString() },
              { label: "RANK", value: rank.rank },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-2xl font-display font-bold"
                  style={{ color: "oklch(0.62 0.19 255)" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs font-mono tracking-widest"
                  style={{ color: "oklch(0.50 0.01 255)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hidden lg:flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <div className="relative w-48 h-48">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "oklch(0.62 0.19 255 / 0.1)",
                boxShadow:
                  "0 0 60px oklch(0.62 0.19 255 / 0.3), 0 0 120px oklch(0.49 0.22 275 / 0.2)",
              }}
            />
            <div
              className="absolute inset-4 rounded-full flex items-center justify-center"
              style={{
                background: "oklch(0.12 0.025 255)",
                border: "2px solid oklch(0.62 0.19 255 / 0.5)",
              }}
            >
              <span
                className="font-display font-extrabold"
                style={{
                  fontSize: "6rem",
                  lineHeight: 1,
                  color: rank.color,
                  textShadow: `0 0 30px ${rank.color}88`,
                }}
              >
                ♔
              </span>
            </div>
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-mono text-xs font-bold tracking-widest"
              style={{
                background: `${rank.color}22`,
                border: `1px solid ${rank.color}66`,
                color: rank.color,
                whiteSpace: "nowrap",
              }}
            >
              RANK {rank.rank}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
