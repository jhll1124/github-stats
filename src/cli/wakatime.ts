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

import { allLanguages } from "../common/languageColors.ts";
import logging from "../common/logging.ts";
import renderWakatime from "../pipeline/render-wakatime.tsx";
import { setUpCommitersForCli } from "../pipeline/setup-commiters.ts";
import setUpVerbose from "../pipeline/setup-verbose.ts";
import writeSvg from "../pipeline/write-svg.ts";

export const wakatimeOptions = globalOptions.describe(
  "Generate a wakatime stats.",
).with(
  EarlyExitFlag("help", {
    alias: ["h"],
    describe: "Show help and exit.",
    exit() {
      logging.error(wakatimeOptions.help());
      Deno.exit(0);
    },
  }),
).with(
  Option("username", {
    type: Text,
    alias: ["u"],
    describe: "Your wakatime username.",
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
    describe: "The width of the image.",
    default: 495,
  }),
).with(
  BinaryFlag("compact", {
    alias: ["c"],
    describe: "Use compact layout.",
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
  PartialOption("max-languages-count", {
    type: FiniteNumber,
    alias: ["m", "max"],
    describe: "The maximum number of languages to show.",
    default: 0,
    describeDefault: "Show all languages.",
  }),
).with(
  DrainOption("hide-languages", {
    type: Text,
    alias: ["H", "hide"],
    describe: "Hide the specified languages.",
    while: (arg) => allLanguages.has(arg.raw),
  }),
);

export async function dealWakatimeCommand({
  username: wakatimeUserName,
  output: wakatimeOutputFileName,
  width: wakatimeImageWidth,
  compact: wakatimeCompactLayout,
  title: wakatimeCardTitle,
  "max-languages-count": wakatimeMaxLanguagesCount,
  "hide-languages": wakatimeHideLanguages,
  write: shouldWrite,
  commit: shouldCommit,
  repo: repoCommitTo,
  branch: branchCommitTo,
  token: ghToken,
  verbose,
}: Parsed<typeof wakatimeOptions>) {
  await Promise.resolve({
    wakatimeUserName,
    wakatimeOutputFileName,
    wakatimeImageWidth,
    wakatimeCompactLayout,
    wakatimeCardTitle,
    wakatimeMaxLanguagesCount: Math.floor(wakatimeMaxLanguagesCount),
    wakatimeHideLanguages,
    shouldWrite,
    shouldCommit,
    repoCommitTo,
    branchCommitTo,
    ghToken,
    verbose,
  }).then(setUpVerbose)
    .then(setUpCommitersForCli)
    .then(renderWakatime)
    .then(writeSvg);

  Deno.exit(0);
}
