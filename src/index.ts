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

import { allLanguages } from './common/languageColors.ts';
import logging from './common/logging.ts';
import renderWakatime from './wakatime.tsx';

const globalOptions = args.with(
  CountFlag('verbose', {
    alias: ['v'],
    describe: 'Show verbose output. Use -vv for more verbose output.',
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
  .describe('Github readme stats generator.')
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
  .sub('help', args.describe('Print this message or the help of the given subcommand.'))
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
      title = `${username}'s Wakatime Stats`,
      'max-languages-count': maxLanguagesCount,
      'hide-languages': hideLanguages,
      verbose,
    } = parsed.value.value;
    logging.setVerbose(verbose);

    await renderWakatime({
      username,
      output,
      width,
      compact,
      title,
      maxLanguagesCount: Math.floor(maxLanguagesCount),
      hideLanguages,
    });
  }
}
