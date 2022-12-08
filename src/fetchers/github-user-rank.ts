function normalcdf(mean: number, sigma: number, to: number) {
  const z = (to - mean) / Math.sqrt(2 * sigma * sigma);
  const t = 1 / (1 + 0.3275911 * Math.abs(z));
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const erf =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
  const sign = z < 0 ? -1 : 1;
  return (1 / 2) * (1 + sign * erf);
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

const weight: Record<string, number> = {
  repos: 1,
  contributions: 1.65,
  commits: 1.65,
  followers: 0.45,
  prs: 0.5,
  issues: 1,
  stargazers: 0.75,
};

const totalWeight = Object.values(weight).reduce((a, b) => a + b, 0);

const ranks: [string, number][] = [
  ['S+', 1],
  ['S', 25],
  ['A++', 45],
  ['A+', 60],
  ['B+', 100],
];

const totalRanks = ranks.reduce((a, b) => a + b[1], 0);

export function calculateRank(stats: UserStats) {
  const rawScore =
    Object.entries(stats).reduce((acc, [key, value]) => {
      return acc + value * weight[key] ?? 0;
    }, 0) / 100;

  const normalizedScore = normalcdf(rawScore, totalRanks, totalWeight) * 100;

  const [level, score] = ranks.find(([, max]) => normalizedScore <= max) ?? [
    'C',
    100,
  ];

  return { level, score };
}
