import * as core from "@actions/core";

import { Commiter } from "./types.ts";

// deno-lint-ignore require-await
const actionCommiter: Commiter = async ({ path, content }) => {
  core.setOutput(path, content);
};

export default actionCommiter;
