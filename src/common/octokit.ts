// deno-lint-ignore-file no-explicit-any
import * as github from "@actions/github";

import { Octokit as OctokitOrigin } from "octokit";

export interface Octokit {
  graphql(query: string, variables?: Record<string, any>): Promise<any>;
  rest: any;
}

export default function getOctokit(token: string): Octokit {
  if (github.context.action) {
    return github.getOctokit(token);
  }
  return new OctokitOrigin({ auth: token });
}
