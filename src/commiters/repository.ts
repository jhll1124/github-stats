import { Commiter } from './types.ts';
import { Octokit } from 'octokit';
import { encode } from 'base64';
import { gitHashObject } from '../common/hash.ts';
import logging from '../common/logging.ts';

export default function getRepositoryCommiter(
  token: string,
  owner: string,
  repo: string,
  branch: string
): Commiter {
  const octokit = new Octokit({ auth: token });

  return async function commit({ path, content }) {
    logging.verbose(1, 'start commit to github');
    const shaQuery = await octokit.graphql(
      `
      query {
        repository(owner: "${owner}", name: "${repo}") {
          object(expression: "${branch}:${path}") { ... on Blob { oid } }
        }
      }
      `
    );
    const sha = shaQuery.repository?.object?.oid;
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
      message: 'Update file',
      ...(sha ? { sha } : {}),
      content: encode(content),
      branch: branch,
    });
    logging.verbose(2, 'response:', data);
    logging.verbose(1, 'finish sending request');
  };
}
