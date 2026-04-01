export interface Puzzle {
  id: string;
  title: string;
  theme: string;
  description: string;
  fen: string;
  solutionFrom: string;
  solutionTo: string;
  xpReward: number;
  sideToMove: "white" | "black";
}

export const PUZZLES: Puzzle[] = [
  {
    id: "p1",
    title: "Back Rank Mate",
    theme: "Back-Rank Mate",
    description: "The rook delivers checkmate on the back rank.",
    fen: "6k1/5ppp/8/8/8/8/5PPP/3R2K1 b - - 0 1",
    solutionFrom: "d1",
    solutionTo: "d8",
    xpReward: 50,
    sideToMove: "black",
  },
  {
    id: "p2",
    title: "Smothered King",
    theme: "Checkmate",
    description: "The rook delivers checkmate. Find the move.",
    fen: "5rk1/5ppp/8/8/8/8/5PPP/5RK1 b - - 0 1",
    solutionFrom: "f1",
    solutionTo: "f8",
    xpReward: 50,
    sideToMove: "black",
  },
  {
    id: "p3",
    title: "Rook Endgame",
    theme: "Rook Endgame",
    description: "Activate the rook. Cut off the king.",
    fen: "8/4k3/8/8/8/8/4K3/4R3 b - - 0 1",
    solutionFrom: "e1",
    solutionTo: "e7",
    xpReward: 50,
    sideToMove: "black",
  },
  {
    id: "p4",
    title: "Skewer Attack",
    theme: "Skewer",
    description: "Attack the king, win the rook behind it.",
    fen: "3k4/3r4/8/8/8/8/3B4/3K4 b - - 0 1",
    solutionFrom: "d2",
    solutionTo: "g5",
    xpReward: 50,
    sideToMove: "black",
  },
  {
    id: "p5",
    title: "Knight Fork",
    theme: "Fork",
    description: "The knight forks king and rook.",
    fen: "3k4/8/8/8/8/5N2/8/3K4 b - - 0 1",
    solutionFrom: "f3",
    solutionTo: "e5",
    xpReward: 50,
    sideToMove: "black",
  },
  {
    id: "p6",
    title: "Queen Mate",
    theme: "Checkmate",
    description: "Deliver checkmate with the queen.",
    fen: "7k/6pp/8/8/8/8/6PP/5Q1K b - - 0 1",
    solutionFrom: "f1",
    solutionTo: "f7",
    xpReward: 50,
    sideToMove: "black",
  },
  {
    id: "p7",
    title: "Rook Check",
    theme: "Rook Endgame",
    description: "Check the king and gain the opposition.",
    fen: "8/1k6/8/8/8/8/1K6/R7 b - - 0 1",
    solutionFrom: "a1",
    solutionTo: "a7",
    xpReward: 50,
    sideToMove: "black",
  },
  {
    id: "p8",
    title: "Bishop Skewer",
    theme: "Skewer",
    description: "Skewer the king to win the queen.",
    fen: "3qk3/8/8/8/8/8/8/B3K3 b - - 0 1",
    solutionFrom: "a1",
    solutionTo: "e5",
    xpReward: 50,
    sideToMove: "black",
  },
];
