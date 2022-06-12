import type { Octokit } from "octokit";
import logging from "../common/logging.ts";

interface QueryDefaultBranchName {
  owner: string;
  repo: string;
}

export async function queryDefaultBranchName(
  octokit: Octokit,
  { owner, repo }: QueryDefaultBranchName,
): Promise<string> {
  const query = await octokit.graphql(
    `
      query defaultBranchName($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          defaultBranchRef { name }
        }
      }
    `,
    { owner, repo },
  );
  logging.verbose(1, `query default branch name for ${owner}/${repo}`);
  logging.verbose(2, query);
  const name = query.repository?.defaultBranchRef?.name;
  logging.verbose(1, `default branch name: ${name}`);
  return name ?? "master";
}
