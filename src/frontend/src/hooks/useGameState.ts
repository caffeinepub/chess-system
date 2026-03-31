import { useCallback, useEffect, useState } from "react";

export type QuestCategory =
  | "Tactics"
  | "Endgame"
  | "Opening"
  | "Positional"
  | "Blitz";
export type QuestDifficulty = "Easy" | "Medium" | "Hard" | "Legendary";

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xpReward: number;
  completed: boolean;
  completedAt?: number;
}

export interface QuestHistoryEntry {
  questId: string;
  title: string;
  xpEarned: number;
  completedAt: number;
  category: QuestCategory;
}

export interface GameState {
  playerName: string;
  level: number;
  xp: number;
  totalXpEarned: number;
  dailyQuests: Quest[];
  questsDate: string; // YYYY-MM-DD
  questHistory: QuestHistoryEntry[];
  weeklyBossCompleted: boolean;
  weeklyBossDate: string;
}

const QUEST_POOL: Omit<Quest, "id" | "completed">[] = [
  {
    title: "The Tactical Gauntlet",
    description:
      "Solve 10 tactical puzzles on Lichess (rating 1500+). Train your calculation muscles.",
    category: "Tactics",
    difficulty: "Easy",
    xpReward: 75,
  },
  {
    title: "Pattern Seeker",
    description:
      "Identify 5 different tactical motifs: pin, fork, skewer, discovered attack, zwischenzug.",
    category: "Tactics",
    difficulty: "Medium",
    xpReward: 120,
  },
  {
    title: "Endgame Ascension",
    description:
      "Practice King + Pawn vs King endgame technique. Master the opposition and key squares.",
    category: "Endgame",
    difficulty: "Easy",
    xpReward: 80,
  },
  {
    title: "Rook Domination",
    description:
      "Study and practice Rook vs Pawn endgames. Complete 3 endgame studies on Chess.com.",
    category: "Endgame",
    difficulty: "Medium",
    xpReward: 130,
  },
  {
    title: "Opening Architect",
    description:
      "Learn 10 moves deep into the Sicilian Najdorf or your preferred opening. Understand the ideas.",
    category: "Opening",
    difficulty: "Medium",
    xpReward: 110,
  },
  {
    title: "Surprise Weapon",
    description:
      "Study an aggressive surprise weapon: the King's Gambit, Evans Gambit, or Trompowsky.",
    category: "Opening",
    difficulty: "Hard",
    xpReward: 160,
  },
  {
    title: "Strategic Vision",
    description:
      "Play 5 classical games (15+10) focusing on piece coordination and pawn structure.",
    category: "Positional",
    difficulty: "Medium",
    xpReward: 115,
  },
  {
    title: "The Blitz Trial",
    description:
      "Play 10 blitz games (3+2) and analyze all of them. Find your most common mistake.",
    category: "Blitz",
    difficulty: "Easy",
    xpReward: 90,
  },
  {
    title: "Speed Demon",
    description:
      "Play 20 bullet games and focus on intuition and pattern recognition under pressure.",
    category: "Blitz",
    difficulty: "Hard",
    xpReward: 150,
  },
  {
    title: "Grandmaster Study",
    description:
      "Analyze 2 complete grandmaster games in your opening. Understand every move deeply.",
    category: "Positional",
    difficulty: "Hard",
    xpReward: 170,
  },
  {
    title: "The 1000 Puzzles Sprint",
    description:
      "Complete a 60-minute puzzle marathon on Lichess. No skipping. Full focus.",
    category: "Tactics",
    difficulty: "Legendary",
    xpReward: 250,
  },
  {
    title: "Fortress Breaker",
    description:
      "Study 5 opposite-colored bishop endgames and learn when to push, when to hold.",
    category: "Endgame",
    difficulty: "Hard",
    xpReward: 165,
  },
  {
    title: "The Prophylactic Eye",
    description:
      "Play 3 long games focusing only on prophylactic thinking. Stop the opponent's plans first.",
    category: "Positional",
    difficulty: "Hard",
    xpReward: 155,
  },
  {
    title: "Clock Management",
    description:
      "Play 5 rapid games (10+5) and never let your clock drop below 3 minutes.",
    category: "Blitz",
    difficulty: "Medium",
    xpReward: 105,
  },
];

export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function getWeekString(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function generateDailyQuests(dateStr: string): Quest[] {
  const seed = dateStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rng = seededRandom(seed);
  const shuffled = [...QUEST_POOL].sort(() => rng() - 0.5);
  return shuffled.slice(0, 6).map((q, i) => ({
    ...q,
    id: `quest_${dateStr}_${i}`,
    completed: false,
  }));
}

const STORAGE_KEY = "shadowchess_gamestate";

export const DEFAULT_STATE: GameState = {
  playerName: "DARK_SLAYER",
  level: 1,
  xp: 0,
  totalXpEarned: 0,
  dailyQuests: generateDailyQuests(getTodayString()),
  questsDate: getTodayString(),
  questHistory: [],
  weeklyBossCompleted: false,
  weeklyBossDate: getWeekString(),
};

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed: GameState = JSON.parse(raw);
    const today = getTodayString();
    if (parsed.questsDate !== today) {
      parsed.dailyQuests = generateDailyQuests(today);
      parsed.questsDate = today;
    }
    const thisWeek = getWeekString();
    if (parsed.weeklyBossDate !== thisWeek) {
      parsed.weeklyBossCompleted = false;
      parsed.weeklyBossDate = thisWeek;
    }
    return parsed;
  } catch {
    return DEFAULT_STATE;
  }
}

export type RankInfo = {
  rank: string;
  color: string;
  minLevel: number;
  maxLevel: number;
};

export const RANKS: RankInfo[] = [
  { rank: "E", color: "#9CA3AF", minLevel: 1, maxLevel: 9 },
  { rank: "D", color: "#34D399", minLevel: 10, maxLevel: 19 },
  { rank: "C", color: "#3B82F6", minLevel: 20, maxLevel: 29 },
  { rank: "B", color: "#A78BFA", minLevel: 30, maxLevel: 39 },
  { rank: "A", color: "#FB923C", minLevel: 40, maxLevel: 49 },
  { rank: "S", color: "#FBBF24", minLevel: 50, maxLevel: 59 },
  { rank: "National", color: "#EF4444", minLevel: 60, maxLevel: 69 },
  { rank: "Monarch", color: "#C084FC", minLevel: 70, maxLevel: 89 },
  { rank: "Absolute", color: "#FFFFFF", minLevel: 90, maxLevel: 999 },
];

export function getRankForLevel(level: number): RankInfo {
  return (
    RANKS.find((r) => level >= r.minLevel && level <= r.maxLevel) ?? RANKS[0]
  );
}

export function getXpNeeded(level: number): number {
  return level * 100;
}

export type LevelUpResult = {
  leveledUp: boolean;
  newLevel: number;
  rankChanged: boolean;
  newRank: string;
  xpGained: number;
};

export function useGameState() {
  const [state, setState] = useState<GameState>(() => loadState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const completeQuest = useCallback((questId: string): LevelUpResult => {
    let result: LevelUpResult = {
      leveledUp: false,
      newLevel: 1,
      rankChanged: false,
      newRank: "E",
      xpGained: 0,
    };

    setState((prev) => {
      const quest = prev.dailyQuests.find((q) => q.id === questId);
      if (!quest || quest.completed) return prev;

      const xpGained = quest.xpReward;
      let newXp = prev.xp + xpGained;
      let newLevel = prev.level;
      let leveledUp = false;

      const oldRank = getRankForLevel(prev.level);

      while (newXp >= getXpNeeded(newLevel)) {
        newXp -= getXpNeeded(newLevel);
        newLevel += 1;
        leveledUp = true;
      }

      const newRank = getRankForLevel(newLevel);
      const rankChanged = leveledUp && newRank.rank !== oldRank.rank;

      result = {
        leveledUp,
        newLevel,
        rankChanged,
        newRank: newRank.rank,
        xpGained,
      };

      const historyEntry: QuestHistoryEntry = {
        questId: quest.id,
        title: quest.title,
        xpEarned: xpGained,
        completedAt: Date.now(),
        category: quest.category,
      };

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        totalXpEarned: prev.totalXpEarned + xpGained,
        dailyQuests: prev.dailyQuests.map((q) =>
          q.id === questId
            ? { ...q, completed: true, completedAt: Date.now() }
            : q,
        ),
        questHistory: [historyEntry, ...prev.questHistory].slice(0, 50),
      };
    });

    return result;
  }, []);

  const completeWeeklyBoss = useCallback((): LevelUpResult => {
    let result: LevelUpResult = {
      leveledUp: false,
      newLevel: 1,
      rankChanged: false,
      newRank: "E",
      xpGained: 0,
    };

    setState((prev) => {
      if (prev.weeklyBossCompleted) return prev;
      const xpGained = 500;
      let newXp = prev.xp + xpGained;
      let newLevel = prev.level;
      let leveledUp = false;
      const oldRank = getRankForLevel(prev.level);

      while (newXp >= getXpNeeded(newLevel)) {
        newXp -= getXpNeeded(newLevel);
        newLevel += 1;
        leveledUp = true;
      }

      const newRank = getRankForLevel(newLevel);
      const rankChanged = leveledUp && newRank.rank !== oldRank.rank;
      result = {
        leveledUp,
        newLevel,
        rankChanged,
        newRank: newRank.rank,
        xpGained,
      };

      const historyEntry: QuestHistoryEntry = {
        questId: `boss_${prev.weeklyBossDate}`,
        title: "Weekly Boss: The Immortal Gambit",
        xpEarned: xpGained,
        completedAt: Date.now(),
        category: "Tactics",
      };

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        totalXpEarned: prev.totalXpEarned + xpGained,
        weeklyBossCompleted: true,
        questHistory: [historyEntry, ...prev.questHistory].slice(0, 50),
      };
    });

    return result;
  }, []);

  const earnXp = useCallback((amount: number): LevelUpResult => {
    let result: LevelUpResult = {
      leveledUp: false,
      newLevel: 1,
      rankChanged: false,
      newRank: "E",
      xpGained: amount,
    };

    setState((prev) => {
      const xpGained = amount;
      let newXp = prev.xp + xpGained;
      let newLevel = prev.level;
      let leveledUp = false;
      const oldRank = getRankForLevel(prev.level);

      while (newXp >= getXpNeeded(newLevel)) {
        newXp -= getXpNeeded(newLevel);
        newLevel += 1;
        leveledUp = true;
      }

      const newRank = getRankForLevel(newLevel);
      const rankChanged = leveledUp && newRank.rank !== oldRank.rank;
      result = {
        leveledUp,
        newLevel,
        rankChanged,
        newRank: newRank.rank,
        xpGained,
      };

      const historyEntry: QuestHistoryEntry = {
        questId: `puzzle_xp_${Date.now()}`,
        title: "Puzzle Trainer",
        xpEarned: xpGained,
        completedAt: Date.now(),
        category: "Tactics",
      };

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        totalXpEarned: prev.totalXpEarned + xpGained,
        questHistory: [historyEntry, ...prev.questHistory].slice(0, 50),
      };
    });

    return result;
  }, []);

  const updatePlayerName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, playerName: name }));
  }, []);

  const resetDailyQuests = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dailyQuests: generateDailyQuests(getTodayString()).map((q) => ({ ...q })),
    }));
  }, []);

  const resetAllProgress = useCallback(() => {
    const fresh = {
      ...DEFAULT_STATE,
      dailyQuests: generateDailyQuests(getTodayString()),
      questsDate: getTodayString(),
    };
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("shadowchess_puzzle_elo");
    setState(fresh);
  }, []);

  return {
    state,
    completeQuest,
    completeWeeklyBoss,
    earnXp,
    updatePlayerName,
    resetDailyQuests,
    resetAllProgress,
  };
}
