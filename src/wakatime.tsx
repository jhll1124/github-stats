import type { Commiter } from "./commiters/types.ts";
import { ThemeProvider } from "./themes/Theme.tsx";
import WakatimeCard from "./cards/WakatimeCard.tsx";
import { fetchWakatimeStats } from "./fetchers/wakatime-fetcher.ts";
import logging from "./common/logging.ts";
import { renderSSR } from "nano-jsx";
import writeSvg from "./write-svg.ts";

interface Parameters {
  username: string;
  title?: string;
  compact: boolean;
  width: number;
  maxLanguagesCount: number;
  output: string;
  hideLanguages: string[];
  commiters: Commiter[];
}

export default async function renderWakatime({
  username,
  title,
  compact,
  width,
  maxLanguagesCount,
  output,
  hideLanguages,
  commiters,
}: Parameters) {
  logging.verbose(1, "start rendering wakatime");
  logging.verbose(1, "fetch wakatime stats");
  const stats = await fetchWakatimeStats({ username });
  logging.verbose(1, "stats fetched");
  logging.verbose(2, stats);

  logging.verbose(1, "generate svg");
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
    </ThemeProvider>,
  );
  logging.verbose(1, "svg generated");
  logging.verbose(2, result);

  await writeSvg({ path: output, content: result, commiters });
}
