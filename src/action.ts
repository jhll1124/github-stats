import * as core from "@actions/core";
import * as github from "@actions/github";

import ensureOctokit from "./pipeline/ensure-octokit.ts";
import logging from "./common/logging.ts";
import renderGitHubStats from "./pipeline/render-github-stats.tsx";
import renderWakatime from "./pipeline/render-wakatime.tsx";
import { setUpCommitersForActions } from "./pipeline/setup-commiters.ts";
import setUpVerbose from "./pipeline/setup-verbose.ts";
import writeSvg from "./pipeline/write-svg.ts";

if (
  github.context.eventName === "push" &&
  github.context.payload?.head_commit
) {
  const lastCommitMessage = github.context.payload.head_commit.message;

  if (/\[Skip GitHub Action\]/.test(lastCommitMessage)) {
    logging.log("Skipped because [Skip GitHub Action] is in commit message");
    Deno.exit(0);
  }

  if (/Auto-generated stats for run #\d+/.test(lastCommitMessage)) {
    logging.log(
      "Skipped because this seems to be an automated pull request merge",
    );
    Deno.exit(0);
  }
}

function getOutputConfig() {
  logging.log("======== Output Action ========");

  const outputAction = core.getInput("output-action");
  const ghToken = core.getInput("token");
  const committerToken = core.getInput("committer-token");
  const owner = core.getInput("owner") || github.context.repo.owner;
  const repo = core.getInput("repo") || github.context.repo.repo;
  const repoCommitTo = `${owner}/${repo}`;
  const branchCommitTo = core.getInput("branch") || undefined;

  logging.table({
    outputAction,
    owner,
    repo,
    branch: branchCommitTo || "[main branch]",
  });

  return {
    shouldWrite: false,
    shouldCommit: outputAction === "commit",
    ghToken,
    committerToken,
    repoCommitTo,
    branchCommitTo,
  };
}

function getGitHubConfig() {
  logging.log("======== GitHub Stats ========");
  const githubUserName = core.getInput("github-username");
  if (!githubUserName) {
    logging.log("GitHub card skipped because no username was provided.");
  }
  const githubOutputFileName = core.getInput("github-output-filename");
  const githubImageWidth = parseInt(core.getInput("github-image-width"));
  const githubCardTitle = core.getInput("github-card-title") || undefined;
  const githubIncludeCollaboratedStargazers = core.getBooleanInput(
    "github-include-collaborated-stargazers",
  );
  const githubOnlyLastYear = core.getBooleanInput("github-only-last-year");
  const githubHideStatItems = core
    .getInput("github-hide-stat-items")
    .split(/[,\n]/)
    .filter(Boolean);

  const config = {
    githubUserName,
    githubOutputFileName,
    githubImageWidth,
    githubCardTitle,
    githubIncludeCollaboratedStargazers,
    githubOnlyLastYear,
    githubHideStatItems,
  };

  logging.table(config);
  return config;
}

function getWakatimeConfig() {
  logging.log("======== Wakatime ========");
  const wakatimeUserName = core.getInput("wakatime-username");
  if (!wakatimeUserName) {
    logging.log("Wakatime card skipped because no username was provided.");
  }
  const wakatimeOutputFileName = core.getInput("wakatime-output-filename");
  const wakatimeImageWidth = parseInt(core.getInput("wakatime-image-width"));
  const wakatimeCompactLayout = core.getBooleanInput("wakatime-compact-layout");
  const wakatimeCardTitle = core.getInput("wakatime-card-title") || undefined;
  const wakatimeMaxLanguagesCount = parseInt(
    core.getInput("wakatime-max-languages-count"),
  );
  const wakatimeHideLanguages = core
    .getInput("wakatime-hide-languages")
    .split(/[,\n]/)
    .filter(Boolean);

  const config = {
    wakatimeUserName,
    wakatimeOutputFileName,
    wakatimeImageWidth,
    wakatimeCompactLayout,
    wakatimeCardTitle,
    wakatimeMaxLanguagesCount,
    wakatimeHideLanguages,
  };
  logging.table(config);

  return config;
}

function getVerbose() {
  const verbose = parseInt(core.getInput("verbose")) || 0;
  return { verbose };
}

const env = {
  ...getOutputConfig(),
  ...getGitHubConfig(),
  ...getWakatimeConfig(),
  ...getVerbose(),
};

await Promise.resolve(env)
  .then(setUpVerbose)
  .then(setUpCommitersForActions)
  .then(ensureOctokit)
  .then((env) => ("githubUserName" in env ? renderGitHubStats(env) : env))
  .then((env) => ("wakatimeUserName" in env ? renderWakatime(env) : env))
  .then(writeSvg);
