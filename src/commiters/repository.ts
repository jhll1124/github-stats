import { Commiter } from "./types.ts";
import { Octokit } from "../common/octokit.ts";
import { encode } from "base64";
import { gitHashObject } from "../common/hash.ts";
import logging from "../common/logging.ts";
import { queryDefaultBranchName } from "../common/github.ts";

interface getRepositoryCommiterOptions {
  owner: string;
  repo: string;
  branch?: string;
}

export default async function getRepositoryCommiter(
  octokit: Octokit,
  { owner, repo, branch }: getRepositoryCommiterOptions,
): Promise<Commiter> {
  const realBranch = branch ||
    await queryDefaultBranchName(octokit, { owner, repo });

  return async function commit({ path, content }) {
    logging.verbose(1, "start commit to github");
    const {
      repository: {
        object: { oid: sha = "" } = {},
      } = {},
    } = await octokit.graphql(
      `#graphql
      query objectHash($owner: String!, $repo: String!, $path: String!) {
        repository(owner: $owner, name: $repo) {
          object(expression: $path) { ... on Blob { oid } }
        }
      }
      `,
      {
        owner,
        repo,
        path: `${realBranch}:${path}`,
      },
    );
    logging.verbose(1, "origin sha:", sha);

    if (sha === (await gitHashObject(content))) {
      logging.verbose(1, "content is same, skip commit");
      return;
    }

    logging.verbose(1, "start sending request");
    const { data } = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Update ${path} [Skip GitHub Action]`,
      ...(sha ? { sha } : {}),
      content: encode(content),
      branch: realBranch,
    });
    logging.verbose(2, "response:", data);
    logging.verbose(1, "finish sending request");
  };
}
