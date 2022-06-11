import type { Octokit } from 'octokit';
import logging from '../common/logging.ts';

interface QueryObjectHash {
  owner: string;
  repo: string;
  branch: string;
  path: string;
}

export async function queryObjectHash(
  octokit: Octokit,
  { owner, repo, branch, path }: QueryObjectHash
): Promise<string | undefined> {
  const query = await octokit.graphql(
    `
      query {
        repository(owner: "${owner}", name: "${repo}") {
          object(expression: "${branch}:${path}") { ... on Blob { oid } }
        }
      }
        `
  );
  return query.repository?.object?.oid;
}

interface QueryDefaultBranchName {
  owner: string;
  repo: string;
}

export async function queryDefaultBranchName(
  octokit: Octokit,
  { owner, repo }: QueryDefaultBranchName
): Promise<string> {
  const query = await octokit.graphql(
    `
      query {
        repository(owner: "${owner}", name: "${repo}") {
          defaultBranchRef { name }
        }
      }
    `
  );
  logging.verbose(1, `query default branch name for ${owner}/${repo}`);
  logging.verbose(2, query);
  const name = query.repository?.defaultBranchRef?.name;
  logging.verbose(1, `default branch name: ${name}`);
  return name ?? 'master';
}
