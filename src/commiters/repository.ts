import { Commiter } from './types.ts';
import { Octokit } from 'octokit';
import { encode } from 'base64';
import { gitHashObject } from '../common/hash.ts';
import logging from '../common/logging.ts';
import { queryObjectHash } from '../common/github.ts';

interface getRepositoryCommiterOptions {
  owner: string;
  repo: string;
  branch: string;
}

export default function getRepositoryCommiter(
  octokit: Octokit,
  { owner, repo, branch }: getRepositoryCommiterOptions
): Commiter {
  return async function commit({ path, content }) {
    logging.verbose(1, 'start commit to github');
    const sha = await queryObjectHash(octokit, {
      owner,
      repo,
      branch,
      path,
    });
    logging.verbose(1, 'origin sha:', sha);

    if (sha === (await gitHashObject(content))) {
      logging.verbose(1, 'content is same, skip commit');
      return;
    }

    logging.verbose(1, 'start sending request');
    const { data } = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Update ${path} [Skip GitHub Action]`,
      ...(sha ? { sha } : {}),
      content: encode(content),
      branch,
    });
    logging.verbose(2, 'response:', data);
    logging.verbose(1, 'finish sending request');
  };
}
