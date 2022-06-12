import { ThemeProvider } from "../themes/Theme.tsx";
import WakatimeCard from "../cards/WakatimeCard.tsx";
import { fetchWakatimeStats } from "../fetchers/wakatime-fetcher.ts";
import logging from "../common/logging.ts";
import { renderSSR } from "nano-jsx";

export default async function renderWakatime<
  T extends {
    wakatimeUserName: string;
    wakatimeOutputFileName: string;
    wakatimeImageWidth: number;
    wakatimeCompactLayout: boolean;
    wakatimeCardTitle?: string;
    wakatimeMaxLanguagesCount: number;
    wakatimeHideLanguages: string[];
    results?: { path: string; content: string }[];
  },
>({
  wakatimeUserName: username,
  wakatimeOutputFileName: output,
  wakatimeImageWidth: width,
  wakatimeCompactLayout: compact,
  wakatimeCardTitle: title,
  wakatimeMaxLanguagesCount: maxLanguagesCount,
  wakatimeHideLanguages: hideLanguages,
  results = [],
  ...env
}: T) {
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

  results.push({ path: output, content: result });
  return {
    results,
    ...env,
  };
}
