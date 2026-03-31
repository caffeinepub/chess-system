const ELO_KEY = "chess_puzzle_elo";

export function getPlayerElo(): number {
  const stored = localStorage.getItem(ELO_KEY);
  return stored ? Number.parseInt(stored, 10) : 1200;
}

export function savePlayerElo(elo: number): void {
  localStorage.setItem(ELO_KEY, String(Math.round(elo)));
}

export function calculateNewElo(
  playerElo: number,
  puzzleRating: number,
  solved: boolean,
): number {
  const K = 32;
  const expected = 1 / (1 + 10 ** ((puzzleRating - playerElo) / 400));
  const actual = solved ? 1 : 0;
  const newElo = playerElo + K * (actual - expected);
  return Math.max(400, Math.round(newElo));
}
