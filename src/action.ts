import * as core from '@actions/core';
import * as github from '@actions/github';

import { Commiter } from './commiters/types.ts';
import actionCommiter from "./commiters/action.ts";
import getRepositoryCommiter from './commiters/repository.ts';
import logging from './common/logging.ts';
import { queryDefaultBranchName } from './common/github.ts';
import renderWakatime from './wakatime.tsx';

if (
  github.context.eventName === 'push' &&
  github.context.payload?.head_commit
) {
  const lastCommitMessage = github.context.payload.head_commit.message;

  if (/\[Skip GitHub Action\]/.test(lastCommitMessage)) {
    logging.log('Skipped because [Skip GitHub Action] is in commit message');
    Deno.exit(0);
  }

  if (/Auto-generated stats for run #\d+/.test(lastCommitMessage)) {
    logging.log(
      'Skipped because this seems to be an automated pull request merge'
    );
    Deno.exit(0);
  }
}

const verbose = parseInt(core.getInput('verbose')) || 0;
logging.setVerbose(verbose);

async function getCommiters(): Promise<Commiter[]> {
  logging.log('======== Output Action ========');
  const outputAction = core.getInput('output-action');
  const commiters = [actionCommiter];
  switch (outputAction) {
    case 'commit':
      {
        const token = core.getInput('token');
        if (!token)
          throw new Error('No token was provided for GitHub repository.');

        const octokit = github.getOctokit(token);

        const owner = core.getInput('owner') || github.context.repo.owner;
        const repo = core.getInput('repo') || github.context.repo.repo;
        const branch =
          core.getInput('branch') ||
          (await queryDefaultBranchName(octokit, { owner, repo }));

        const commiter = getRepositoryCommiter(octokit, {
          owner,
          repo,
          branch,
        });
        commiters.push(commiter);

        logging.table({ owner, repo, branch });
      }
      break;
    case 'none':
      break;
    default:
      throw new Error(`Unsupported output action: ${outputAction}`);
  }
  return commiters;
}

function getWakatimeConfig() {
  logging.log('======== Wakatime ========');
  const username = core.getInput('wakatime-username');
  if (!username) {
    logging.log('Wakatime card skipped because no username was provided.');
    return null;
  }
  const output = core.getInput('wakatime-output-filename');
  const width = parseInt(core.getInput('wakatime-image-width'));
  const compact = core.getBooleanInput('wakatime-compact-layout');
  const title =
    core.getInput('wakatime-card-title') || `${username}'s Wakatime Stats`;
  const maxLanguagesCount = parseInt(
    core.getInput('wakatime-max-languages-count')
  );
  const hideLanguages = core
    .getInput('wakatime-hide-languages')
    .split(/[,\n]/)
    .filter(Boolean);

  const config = {
    username,
    output,
    width,
    compact,
    title,
    maxLanguagesCount,
    hideLanguages,
  };
  logging.log('Wakatime config:');
  logging.table(config);

  return config;
}

const commiters = await getCommiters();
const wakatimeConfig = getWakatimeConfig();

await Promise.all([
  wakatimeConfig && renderWakatime({ ...wakatimeConfig, commiters }),
]);
