import { args, BinaryFlag, CountFlag, PartialOption, Text } from "args";

export const globalOptions = args.with(
  CountFlag("verbose", {
    alias: ["v"],
    describe: "Show verbose output. Use -vv for more verbose output.",
  }),
).with(
  BinaryFlag("write", {
    alias: ["W"],
    describe: "Write output to file.",
  }),
).with(
  BinaryFlag("commit", {
    alias: ["C"],
    describe: "Commit output to GitHub repository.",
  }),
).with(
  PartialOption("repo", {
    type: Text,
    alias: ["r"],
    describe: "GitHub repository, e.g. Wybxc/github-stats",
    default: "",
  }),
).with(
  PartialOption("branch", {
    type: Text,
    alias: ["b"],
    describe: "GitHub repository branch.",
    default: "",
    describeDefault: "master or main branch",
  }),
).with(
  PartialOption("token", {
    type: Text,
    alias: ["T"],
    describe: "GitHub personal access token.",
    default: "",
  }),
);

export type Parsed<
  Options extends {
    // deno-lint-ignore no-explicit-any
    parse(...args: any): any;
  },
> = NonNullable<ReturnType<Options["parse"]>["value"]>;
