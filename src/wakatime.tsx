import { ThemeProvider } from './themes/Theme.tsx';
import WakatimeCard from './cards/WakatimeCard.tsx';
import { chain } from './optimizers/core.ts';
import { fetchWakatimeStats } from './fetchers/wakatime-fetcher.ts';
import formatSvg from './optimizers/format-svg.ts';
import logging from './common/logging.ts';
import optimizeSvg from './optimizers/optimize-svg.ts';
import { renderSSR } from 'nano-jsx';

interface Parameters {
  username: string;
  title: string;
  compact: boolean;
  width: number;
  maxLanguagesCount: number;
  output: string;
  hideLanguages: string[];
}

export default async function renderWakatime({
  username,
  title,
  compact,
  width,
  maxLanguagesCount,
  output,
  hideLanguages,
}: Parameters) {
  logging.verbose(1, 'start rendering wakatime');
  logging.verbose(1, 'fetch wakatime stats');
  const stats = await fetchWakatimeStats(username);
  logging.verbose(1, 'stats fetched');
  logging.verbose(2, stats);

  logging.verbose(1, 'generate svg');
  const result = renderSSR(
    <ThemeProvider>
      <WakatimeCard
        stats={stats}
        title={title}
        compact={compact}
        width={width}
        maxLanguagesCount={maxLanguagesCount}
        hideLanguages={hideLanguages}
      />
    </ThemeProvider>
  );
  logging.verbose(1, 'svg generated');
  logging.verbose(2, result);

  logging.verbose(1, 'optimize svg');
  const optimize = chain([optimizeSvg, formatSvg]);
  const optimized = optimize(result);
  logging.verbose(1, 'svg optimized');
  logging.verbose(2, optimized);

  logging.verbose(1, 'write svg');
  await Deno.writeTextFile(output, optimized);
  logging.verbose(1, 'svg written');
}
