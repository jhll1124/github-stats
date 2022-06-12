function expsf(x: number, mean: number) {
  return 2 ** (-x / mean);
}

export interface UserStats {
  repos: number;
  commits: number;
  contributions: number;
  followers: number;
  prs: number;
  issues: number;
  stargazers: number;
}

const mean = {
  repos: 1, // ignored
  contributions: 1, // ignored
  commits: 300,
  followers: 20,
  prs: 10,
  issues: 20,
  stargazers: 100,
};

const weight = {
  repos: 0, // ignored
  contributions: 0, // ignored
  commits: 0.4,
  followers: 0.6,
  prs: 0.8,
  issues: 0.4,
  stargazers: 1.0,
};

const ranks: [string, number][] = [
  ["S+", 0.025],
  ["S", 0.1],
  ["A++", 0.2],
  ["A+", 0.4],
  ["A", 0.6],
  ["B+", 0.8],
  ["B", 0.9],
  ["C+", 0.96],
  ["C", 1.0],
];

export function calculateRank(userStats: UserStats) {
  let rankTotal = 0;
  let weightTotal = 0;
  for (const key in userStats) {
    const item: keyof UserStats = key as keyof UserStats;
    rankTotal += weight[item] * expsf(userStats[item], mean[item]);
    weightTotal += weight[item];
  }
  const rank = rankTotal / weightTotal;

  for (const [rankName, rankValue] of ranks) {
    if (rank <= rankValue) return { level: rankName, score: rank * 100 };
  }

  return { level: "C", score: 100 };
}
