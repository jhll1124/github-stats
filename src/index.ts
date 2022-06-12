import {
  BinaryFlag,
  CountFlag,
  DrainOption,
  EarlyExitFlag,
  FiniteNumber,
  MAIN_COMMAND,
  Option,
  PartialOption,
  Text,
  args,
} from 'args';

import { Octokit } from 'octokit';
import { allLanguages } from './common/languageColors.ts';
import fileCommiter from './commiters/file.ts';
import getRepositoryCommiter from './commiters/repository.ts';
import logging from './common/logging.ts';
import { queryDefaultBranchName } from './common/github.ts';
import renderWakatime from './wakatime.tsx';

const globalOptions = args
  .with(
    CountFlag('verbose', {
      alias: ['v'],
      describe: 'Show verbose output. Use -vv for more verbose output.',
    })
  )
  .with(
    BinaryFlag('write', {
      alias: ['W'],
      describe: 'Write output to file.',
    })
  )
  .with(
    BinaryFlag('commit', {
      alias: ['C'],
      describe: 'Commit output to GitHub repository.',
    })
  )
  .with(
    PartialOption('user', {
      type: Text,
      alias: ['U'],
      describe: 'GitHub username.',
      default: '',
    })
  )
  .with(
    PartialOption('repo', {
      type: Text,
      alias: ['r'],
      describe: 'GitHub repository.',
      default: '',
    })
  )
  .with(
    PartialOption('branch', {
      type: Text,
      alias: ['b'],
      describe: 'GitHub repository branch.',
      default: '',
      describeDefault: 'master or main branch',
    })
  )
  .with(
    PartialOption('token', {
      type: Text,
      alias: ['T'],
      describe: 'GitHub personal access token.',
      default: '',
    })
  );

const wakatimeOptions = globalOptions
  .describe('Generate a wakatime stats.')
  .with(
    EarlyExitFlag('help', {
      alias: ['h'],
      describe: 'Show help and exit.',
      exit() {
        logging.error(wakatimeOptions.help());
        Deno.exit(0);
      },
    })
  )
  .with(
    Option('username', {
      type: Text,
      alias: ['u'],
      describe: 'Your wakatime username.',
    })
  )
  .with(
    Option('output', {
      type: Text,
      alias: ['o'],
      describe: 'The filename of the output svg file.',
    })
  )
  .with(
    PartialOption('width', {
      type: FiniteNumber,
      alias: ['w'],
      describe: 'The width of the image.',
      default: 495,
    })
  )
  .with(
    BinaryFlag('compact', {
      alias: ['c'],
      describe: 'Use compact layout.',
    })
  )
  .with(
    PartialOption('title', {
      type: Text,
      alias: ['t'],
      describe: 'The title of the image.',
      default: undefined,
      describeDefault: "<username>'s Wakatime Stats",
    })
  )
  .with(
    PartialOption('max-languages-count', {
      type: FiniteNumber,
      alias: ['m', 'max'],
      describe: 'The maximum number of languages to show.',
      default: 0,
      describeDefault: 'Show all languages.',
    })
  )
  .with(
    DrainOption('hide-languages', {
      type: Text,
      alias: ['H', 'hide'],
      describe: 'Hide the specified languages.',
      while: (arg) => allLanguages.has(arg.raw),
    })
  );

const parser = args
  .describe('GitHub readme stats generator.')
  .with(
    EarlyExitFlag('help', {
      alias: ['h'],
      describe: 'Show help and exit.',
      exit() {
        logging.error(parser.help());
        Deno.exit(0);
      },
    })
  )
  .sub(
    'help',
    args.describe('Print this message or the help of the given subcommand.')
  )
  .sub('wakatime', wakatimeOptions);

const parsed = parser.parse(Deno.args);

if (parsed.error) {
  logging.error(parsed.error.toString());
  logging.error(parser.help());
  Deno.exit(1);
}

switch (parsed.tag) {
  case MAIN_COMMAND:
    logging.error(parser.help());
    Deno.exit(1);
    break;
  case 'help':
    logging.error(parser.help(...parsed.remaining().rawValues()));
    break;
  case 'wakatime': {
    const {
      username,
      output,
      width,
      compact,
      title,
      'max-languages-count': maxLanguagesCount,
      'hide-languages': hideLanguages,

      write,
      commit,
      user,
      repo,
      branch,
      token,

      verbose,
    } = parsed.value.value;
    logging.setVerbose(verbose);

    const commiters = [];
    if (write) commiters.push(fileCommiter);
    if (commit) {
      if (!user) logging.error('Missing GitHub username.'), Deno.exit(1);
      if (!repo) logging.error('Missing GitHub repository.'), Deno.exit(1);
      if (!token)
        logging.error('Missing GitHub personal access token.'), Deno.exit(1);

      const octokit = new Octokit({ auth: token });
      const realBranch =
        branch ||
        (await queryDefaultBranchName(octokit, { owner: user, repo }));

      commiters.push(
        getRepositoryCommiter(octokit, {
          owner: user,
          repo,
          branch: realBranch,
        })
      );
    }
    if (!commiters.length) commiters.push(fileCommiter);

    await renderWakatime({
      username,
      output,
      width,
      compact,
      title,
      maxLanguagesCount: Math.floor(maxLanguagesCount),
      hideLanguages,
      commiters,
    });
    Deno.exit(0);
  }
}
