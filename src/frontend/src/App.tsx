import { Toaster } from "@/components/ui/sonner";
import { useCallback, useState } from "react";
import { DailyQuestsCard } from "./components/DailyQuestsCard";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { LevelUpModal } from "./components/LevelUpModal";
import { LichessPuzzleSection } from "./components/LichessPuzzleSection";
import { Navbar } from "./components/Navbar";
import { PlayerProfileCard } from "./components/PlayerProfileCard";
import { QuestHistorySection } from "./components/QuestHistorySection";
import { SkillsCard } from "./components/SkillsCard";
import { WeeklyBossCard } from "./components/WeeklyBossCard";
import { useGameState } from "./hooks/useGameState";
import type { LevelUpResult } from "./hooks/useGameState";

type Section = "dashboard" | "quests" | "skills" | "history" | "puzzles";

export default function App() {
  const {
    state,
    completeQuest,
    completeWeeklyBoss,
    updatePlayerName,
    resetDailyQuests,
    earnXp,
    resetAllProgress,
  } = useGameState();
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [levelUpResult, setLevelUpResult] = useState<LevelUpResult | null>(
    null,
  );

  const handleLevelUp = useCallback((result: LevelUpResult) => {
    setLevelUpResult(result);
  }, []);

  const handleCloseLevelUp = useCallback(() => {
    setLevelUpResult(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <LevelUpModal result={levelUpResult} onClose={handleCloseLevelUp} />

      <Navbar
        playerName={state.playerName}
        level={state.level}
        activeSection={activeSection}
        onNavigate={(s) => setActiveSection(s as Section)}
        onResetAllProgress={resetAllProgress}
      />

      <main className="flex-1">
        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <>
            <HeroSection
              playerName={state.playerName}
              level={state.level}
              totalXpEarned={state.totalXpEarned}
              onNavigate={(s) => setActiveSection(s as Section)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
              {/* Row 1: 3 cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <PlayerProfileCard
                  state={state}
                  onUpdateName={updatePlayerName}
                />
                <DailyQuestsCard
                  quests={state.dailyQuests}
                  onComplete={completeQuest}
                  onReset={resetDailyQuests}
                  onLevelUp={handleLevelUp}
                />
                <SkillsCard level={state.level} />
              </div>

              {/* Row 2: Weekly Boss then Puzzles stacked vertically */}
              <div className="flex flex-col gap-6">
                <WeeklyBossCard
                  isCompleted={state.weeklyBossCompleted}
                  onComplete={completeWeeklyBoss}
                  onLevelUp={handleLevelUp}
                />
                <LichessPuzzleSection
                  onLevelUp={handleLevelUp}
                  earnXp={earnXp}
                />
              </div>
            </div>
          </>
        )}

        {/* Quests Section */}
        {activeSection === "quests" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            <div className="mb-8">
              <h1
                className="font-display font-extrabold text-3xl uppercase tracking-widest mb-2"
                style={{ color: "oklch(0.92 0 0)" }}
              >
                Daily Quests
              </h1>
              <p
                className="text-sm font-body"
                style={{ color: "oklch(0.55 0.01 255)" }}
              >
                Complete quests assigned by the System to earn XP and level up
                your chess mastery.
              </p>
            </div>
            <DailyQuestsCard
              quests={state.dailyQuests}
              onComplete={completeQuest}
              onReset={resetDailyQuests}
              onLevelUp={handleLevelUp}
            />
          </div>
        )}

        {/* Skills Section */}
        {activeSection === "skills" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            <div className="mb-8">
              <h1
                className="font-display font-extrabold text-3xl uppercase tracking-widest mb-2"
                style={{ color: "oklch(0.92 0 0)" }}
              >
                Skills
              </h1>
              <p
                className="text-sm font-body"
                style={{ color: "oklch(0.55 0.01 255)" }}
              >
                Your chess attributes grow as you level up. Keep training to
                maximize your potential.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkillsCard level={state.level} />
              <PlayerProfileCard
                state={state}
                onUpdateName={updatePlayerName}
              />
            </div>
          </div>
        )}

        {/* Puzzles Section */}
        {activeSection === "puzzles" && (
          <LichessPuzzleSection onLevelUp={handleLevelUp} earnXp={earnXp} />
        )}

        {/* History Section */}
        {activeSection === "history" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            <div className="mb-8">
              <h1
                className="font-display font-extrabold text-3xl uppercase tracking-widest mb-2"
                style={{ color: "oklch(0.92 0 0)" }}
              >
                Quest History
              </h1>
              <p
                className="text-sm font-body"
                style={{ color: "oklch(0.55 0.01 255)" }}
              >
                Every completed quest is recorded by the System. Your legacy
                grows with each challenge conquered.
              </p>
            </div>
            <QuestHistorySection history={state.questHistory} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
