// deno-lint-ignore-file no-explicit-any

import { Octokit as OctokitOrigin } from "octokit";

export interface Octokit {
  graphql(query: string, variables?: Record<string, any>): Promise<any>;
  rest: any;
}

export default function getOctokit(token: string): Octokit {
  return new OctokitOrigin({ auth: token });
}
