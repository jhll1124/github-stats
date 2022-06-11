import * as core from '@actions/core';

import renderWakatime from './wakatime.tsx';

function getWakatimeConfig() {
  console.log('======== Wakatime ========');
  const username = core.getInput('wakatime-username');
  if (!username) {
    console.log('Wakatime card skipped because no username was provided.');
    return null;
  }
  const output = core.getInput('wakatime-output-filename');
  const width = parseInt(core.getInput('wakatime-image-width'));
  const compact = core.getBooleanInput('wakatime-compact-layout');
  const title = core.getInput('wakatime-card-title') || `${username}'s Wakatime Stats`;
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
  console.log('Wakatime config:');
  console.table(config);

  return config;
}

const wakatimeConfig = getWakatimeConfig();

await Promise.allSettled([wakatimeConfig && renderWakatime(wakatimeConfig)]);
