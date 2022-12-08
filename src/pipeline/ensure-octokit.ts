import getOctokit, { Octokit } from '../common/octokit.ts';

import logging from '../common/logging.ts';

export default function ensureOctokit<
  T extends {
    ghToken?: string;
    committerToken?: string;
    userOctokit?: Octokit;
    actionOctokit?: Octokit;
  }
>({ ghToken, committerToken, userOctokit, actionOctokit, ...env }: T) {
  if (!ghToken) {
    logging.exit('Missing GitHub personal access token.'), Deno.exit(1);
  }
  if (!committerToken) {
    logging.exit('Missing GitHub token.'), Deno.exit(1);
  }

  if (!userOctokit) userOctokit = getOctokit(ghToken);
  if (!actionOctokit) actionOctokit = getOctokit(committerToken);

  return {
    userOctokit,
    actionOctokit,
    ghToken,
    committerToken,
    ...env,
  };
}
