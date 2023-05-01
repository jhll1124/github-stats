import {
  BinaryFlag,
  DrainOption,
  EarlyExitFlag,
  FiniteNumber,
  Option,
  PartialOption,
  Text,
} from "args";
import { globalOptions, Parsed } from "./global.ts";

import ensureOctokit from "../pipeline/ensure-octokit.ts";
import logging from "../common/logging.ts";
import renderGitHubStats from "../pipeline/render-github-stats.tsx";
import { setUpCommitersForCli } from "../pipeline/setup-commiters.ts";
import setUpVerbose from "../pipeline/setup-verbose.ts";
import writeSvg from "../pipeline/write-svg.ts";

export const githubOptions = globalOptions.describe(
  "Generate GitHub stats.",
).with(
  EarlyExitFlag("help", {
    alias: ["h"],
    describe: "Show help and exit.",
    exit() {
      logging.error(githubOptions.help());
      Deno.exit(0);
    },
  }),
).with(
  Option("username", {
    type: Text,
    alias: ["u"],
    describe: "GitHub username.",
  }),
).with(
  Option("output", {
    type: Text,
    alias: ["o"],
    describe: "The filename of the output svg file.",
  }),
).with(
  PartialOption("width", {
    type: FiniteNumber,
    alias: ["w"],
    describe: "Width of the output image.",
    default: 495,
  }),
).with(
  PartialOption("title", {
    type: Text,
    alias: ["t"],
    describe: "The title of the image.",
    default: undefined,
    describeDefault: "<username>'s Wakatime Stats",
  }),
).with(
  BinaryFlag("collab-stars", {
    alias: ["c"],
    describe: "Include stars from repositories of which you are collaborators.",
  }),
).with(
  BinaryFlag("last-year", {
    alias: ["y"],
    describe: "Only show stats from the last year.",
  }),
).with(
  DrainOption("hide", {
    type: Text,
    alias: ["H"],
    describe: "Hide stats by name.",
    while: (arg) =>
      ["stars", "commits", "prs", "issues", "contributions"].includes(
        arg.raw,
      ),
  }),
);

export async function dealGitHubCommand({
  username: githubUserName,
  output: githubOutputFileName,
  width: githubImageWidth,
  title: githubCardTitle,
  "collab-stars": githubIncludeCollaboratedStargazers,
  "last-year": githubOnlyLastYear,
  hide: githubHideStatItems,
  write: shouldWrite,
  commit: shouldCommit,
  repo: repoCommitTo,
  branch: branchCommitTo,
  token: ghToken,
  verbose,
}: Parsed<typeof githubOptions>) {
  await Promise.resolve({
    githubUserName,
    githubOutputFileName,
    githubImageWidth,
    githubCardTitle,
    githubIncludeCollaboratedStargazers,
    githubOnlyLastYear,
    githubHideStatItems: githubHideStatItems,
    shouldWrite,
    shouldCommit,
    repoCommitTo,
    branchCommitTo,
    ghToken,
    verbose,
  }).then(setUpVerbose)
    .then(setUpCommitersForCli)
    .then(ensureOctokit)
    .then(renderGitHubStats)
    .then(writeSvg);
}
