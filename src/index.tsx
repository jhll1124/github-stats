import * as JSX from './common/jsx_extra.ts';

import { ThemeProvider } from './themes/Theme.tsx';
import WakatimeCard from './cards/WakatimeCard.tsx';
import { chain } from './optimizers/core.ts';
import { fetchWakatimeStats } from './fetchers/wakatime-fetcher.ts';
import formatSvg from './optimizers/format-svg.ts';
import optimizeSvg from './optimizers/optimize-svg.ts';
import { renderSSR } from 'nano-jsx';

// const stats = await fetchWakatimeStats('wybxc');

// await Deno.writeTextFile("stats.json", JSON.stringify(stats));

const stats = JSON.parse(await Deno.readTextFile('test-data/stats.json'));

const MySvg: JSX.FC = () => {
  return (
    <ThemeProvider>
      <WakatimeCard
        stats={stats}
        title="Wakatime Stats"
        compact={false}
        width={495}
        languagesCount={8}
      />
    </ThemeProvider>
  );
};

const result = renderSSR(<MySvg />);

const optimizer = chain([optimizeSvg, formatSvg]);
// const optimizer = chain([]);

await Deno.writeTextFile('test-data/index.svg', optimizer(result));
