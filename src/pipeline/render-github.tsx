import type { Commiter } from "../commiters/types.ts";
import GitHubStatsCard from "../cards/GitHubStatsCard.tsx";
import type { Octokit } from "octokit";
import { ThemeProvider } from "../themes/Theme.tsx";
import fetchGitHubUser from "../fetchers/github-user-fetcher.ts";
import logging from "../common/logging.ts";
import { renderSSR } from "nano-jsx";

export default async function renderGitHubStats<
  T extends {
    githubUserName: string;
    octokit: Octokit;
    githubTitle?: string;
    githubWidth: number;
    githubIncludeCollaboratedStargazers: boolean;
    githubOnlyLastYear: boolean;
    githubHideStats: (
      | "stars"
      | "commits"
      | "prs"
      | "issues"
      | "contributions"
    )[];
    githubOutput: string;
    results?: { path: string; content: string }[];
  },
>({
  githubUserName: user,
  octokit,
  githubTitle: title,
  githubWidth: width,
  githubIncludeCollaboratedStargazers: includeCollaboratedStargazers,
  githubOnlyLastYear: onlyLastYear,
  githubHideStats: hideStats,
  githubOutput: output,
  results = [],
  ...env
}: T) {
  logging.verbose(1, "start render github stats");
  logging.verbose(1, "fetch github stats");
  const stats = await fetchGitHubUser({ user, octokit });
  logging.verbose(1, "stats fetched");
  logging.verbose(2, stats);

  logging.verbose(1, "generate svg");
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
    </ThemeProvider>,
  );
  logging.verbose(1, "svg generated");
  logging.verbose(2, result);

  results.push({ path: output, content: result });
  return {
    results,
    ...env,
  };
}
