import { EarlyExitFlag, MAIN_COMMAND, args } from "args";
import { dealGitHubCommand, githubOptions } from "./github.ts";
import { dealWakatimeCommand, wakatimeOptions } from "./wakatime.ts";

import logging from "../common/logging.ts";

const parser = args.describe(
  "GitHub readme stats generator.",
).with(
  EarlyExitFlag("help", {
    alias: ["h"],
    describe: "Show help and exit.",
    exit() {
      logging.error(parser.help());
      Deno.exit(0);
    },
  }),
).sub(
  "help",
  args.describe("Print this message or the help of the given subcommand."),
).sub(
  "wakatime",
  wakatimeOptions,
).sub(
  "github",
  githubOptions,
);

export default async function run() {
  const parsed = parser.parse(Deno.args);

  if (parsed.error) {
    logging.error(parsed.error.toString());
    logging.exit(parser.help());
  }

  switch (parsed.tag) {
    case MAIN_COMMAND:
      logging.exit(parser.help());
      break;
    case "help":
      logging.error(parser.help(...parsed.remaining().rawValues()));
      Deno.exit(0);
      break;
    case "wakatime":
      await dealWakatimeCommand(parsed.value.value);
      break;
    case "github":
      await dealGitHubCommand(parsed.value.value);
      break;
  }
}
