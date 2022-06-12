import getOctokit, { Octokit } from "../common/octokit.ts";

import logging from "../common/logging.ts";

export default function ensureOctokit<
  T extends {
    ghToken?: string;
    octokit?: Octokit;
  },
>({ ghToken, octokit, ...env }: T) {
  if (!ghToken) {
    logging.exit("Missing GitHub personal access token."), Deno.exit(1);
  }

  if (!octokit) {
    octokit = getOctokit(ghToken);
  }

  return {
    octokit,
    ghToken,
    ...env,
  };
}
