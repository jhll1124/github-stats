import * as JSX from '../common/jsx_extra.ts';

import { CompactLanguageList, CompactProgressBar } from './Compact.tsx';

import Card from './Card.tsx';
import { FlexLayout } from './Layout.tsx';
import { LanguageWithProgressBar } from './Languages.tsx';
import { WakaTimeData } from '../fetchers/wakatime-fetcher.ts';
import { useTheme } from '../themes/Theme.tsx';

interface WakatimeCardProps {
  stats: WakaTimeData;
  title: string;
  compact: boolean;
  languagesCount?: number;
  hideLanguages?: string[];
}

const WakatimeCard: JSX.FC<WakatimeCardProps> = ({
  stats,
  title,
  compact,
  languagesCount = stats.languages?.length ?? 0,
  hideLanguages = [],
}) => {
  const theme = useTheme();

  const languages = takeLanguages(
    stats.languages,
    hideLanguages,
    languagesCount
  );

  const height = compact
    ? 90 + Math.ceil(languages.length / 2) * theme.lineHeight
    : 45 + (languages.length + 1) * theme.lineHeight;

  return (
    <Card title={title} width={495} height={height}>
      <svg x="0" y="0" width="100%">
        {compact ? (
          <>
            <CompactProgressBar languages={languages} />
            <CompactLanguageList languages={languages} top={25} />
          </>
        ) : (
          <FlexLayout gap={theme.lineHeight} direction="vertical">
            {languages.map((language) => (
              <LanguageWithProgressBar language={language} />
            ))}
          </FlexLayout>
        )}
      </svg>
    </Card>
  );
};

export default WakatimeCard;

function takeLanguages(
  languages: WakaTimeData['languages'] | undefined,
  hide: string[],
  count = 0
): WakaTimeData['languages'] {
  const hideLangs = new Set(hide.map((lang) => lang.trim().toLowerCase()));
  const langs =
    languages?.filter(
      (language) =>
        !hideLangs.has(language.name.trim().toLowerCase()) &&
        (language.hours || language.minutes)
    ) ?? [];

  let langsTop;
  if (!hideLangs.has('other')) {
    const langsNorm = langs.filter(
      (language) => language.name.trim().toLowerCase() !== 'other'
    );
    let other =
      langs.find((language) => language.name.trim().toLowerCase() === 'other')
        ?.total_seconds ?? 0;

    // Sum all the other languages
    langsTop = langsNorm.slice(0, count);
    langsNorm.slice(count).forEach((language) => {
      other += language.total_seconds;
    });
    if (langsTop.length >= count && other > langsTop[count - 1].total_seconds) {
      other += langsTop[count - 1].total_seconds;
    }
    
    const otherHours = Math.floor(other / 3600);
    const otherMinutes = Math.floor((other % 3600) / 60);
    langsTop.push({
      name: 'Other',
      hours: otherHours,
      minutes: otherMinutes,
      text: otherHours
        ? `${otherHours} hrs ${otherMinutes} mins`
        : otherMinutes
        ? `${otherMinutes} mins`
        : `${other} secs`,
      total_seconds: other,
      percent: 0,
    });
    langsTop.sort((a, b) => b.total_seconds - a.total_seconds);

    langsTop = langsTop.slice(0, count);
  } else {
    langsTop = langs.slice(0, count);
  }

  const total = langsTop.reduce(
    (total, language) => total + language.total_seconds,
    0
  );
  langsTop.forEach((language) => {
    language.percent = +((language.total_seconds * 100) / total).toFixed(2);
  });

  return langsTop;
}
