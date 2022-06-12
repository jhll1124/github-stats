import type { Commiter } from './commiters/types.ts';
import GitHubStatsCard from './cards/GitHubStatsCard.tsx';
import type { Octokit } from 'octokit';
import { ThemeProvider } from './themes/Theme.tsx';
import fetchGitHubUser from './fetchers/github-user-fetcher.ts';
import logging from './common/logging.ts';
import { renderSSR } from 'nano-jsx';
import writeSvg from './write-svg.ts';

interface Parameters {
  user: string;
  octokit: Octokit;
  title?: string;
  width: number;
  includeCollaboratedStargazers: boolean;
  onlyLastYear: boolean;
  hideStats: ('stars' | 'commits' | 'prs' | 'issues' | 'contributions')[];
  output: string;
  commiters: Commiter[];
}

export default async function renderGitHubStats({
  user,
  octokit,
  title,
  width,
  includeCollaboratedStargazers,
  onlyLastYear,
  hideStats,
  output,
  commiters,
}: Parameters) {
  logging.verbose(1, 'start render github stats');
  logging.verbose(1, 'fetch github stats');
  const stats = await fetchGitHubUser({ user, octokit });
  logging.verbose(1, 'stats fetched');
  logging.verbose(2, stats);

  logging.verbose(1, 'generate svg');
  const result = renderSSR(
    <ThemeProvider>
      <GitHubStatsCard
        stats={stats}
        title={title}
        width={width}
        includeCollaboratedStargazers={includeCollaboratedStargazers}
        onlyLastYear={onlyLastYear}
        hideStats={hideStats}
      />
    </ThemeProvider>
  );
  logging.verbose(1, 'svg generated');
  logging.verbose(2, result);

  await writeSvg({ path: output, content: result, commiters });
}
