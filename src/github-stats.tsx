import { Commiter } from './commiters/types.ts';
import GitHubStatsCard from './cards/GitHubStatsCard.tsx';
import { Octokit } from 'octokit';
import { ThemeProvider } from './themes/Theme.tsx';
import { chain } from './optimizers/core.ts';
import fetchGitHubUser from './fetchers/github-user-fetcher.ts';
import fileCommiter from './commiters/file.ts';
import formatSvg from './optimizers/format-svg.ts';
import hydrationStyle from "./optimizers/hydration-style.ts";
import logging from './common/logging.ts';
import optimizeSvg from './optimizers/optimize-svg.ts';
import { renderSSR } from 'nano-jsx';

interface Parameters {
  user: string;
  octokit: Octokit;
  title?: string;
  width: number;
  output: string;
  commiters: Commiter[];
}

export default async function renderGitHubStats({
  user,
  octokit,
  title,
  width,
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
      <GitHubStatsCard stats={stats} title={title} width={width} />
    </ThemeProvider>
  );
  logging.verbose(1, 'svg generated');
  logging.verbose(2, result);

  logging.verbose(1, 'optimize svg');
  const optimize = chain([hydrationStyle, optimizeSvg, formatSvg]);
  const optimized = optimize(result);
  logging.verbose(1, 'svg optimized');
  logging.verbose(2, optimized);

  logging.verbose(1, 'write svg');
  await Promise.all(
    commiters.map((commiter) => commiter({ path: output, content: optimized }))
  );
  logging.verbose(1, 'svg written');
}

logging.setVerbose(1);
const octokit = new Octokit({
  auth: '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',
});
await renderGitHubStats({
  user: 'wybxc',
  octokit,
  width: 495,
  output: './test-data/github-stats.svg',
  commiters: [fileCommiter],
});
Deno.exit(0);
