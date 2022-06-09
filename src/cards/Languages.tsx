import * as JSX from '../common/jsx_extra.ts';

import { font, measureText } from '../themes/utils.tsx';

import { FlexLayout } from './Layout.tsx';
import Style from '../common/Style.tsx';
import getLanguageColor from '../common/languageColors.ts';
import { useTheme } from '../themes/Theme.tsx';

export interface Language {
  name: string;
  percent: number;
  text: string;
}

export type Languages = Language[];

export const NormalLanguageList: JSX.FC<{
  languages: Languages;
  top: number;
  width: number;
}> = ({ languages, top, width }) => {
  const theme = useTheme();

  const maxTextWidth = languages
    .map((language) => measureText(language.text, theme.textFont))
    .reduce((a, b) => Math.max(a, b), 0);

  return (
    <FlexLayout gap={theme.lineHeight + 15} direction="vertical">
      {languages.map((language) => (
        <NormalLanguage
          language={language}
          top={top}
          width={width}
          maxTextWidth={maxTextWidth}
        />
      ))}
    </FlexLayout>
  );
};

export const NormalLanguage: JSX.FC<{
  language: Language;
  top: number;
  width: number;
  maxTextWidth: number;
}> = ({ language, top, width, maxTextWidth }) => {
  const theme = useTheme();

  return (
    <g transform={`translate(${top}, 0)`}>
      <Style>{`
        .lang-name {
          font: ${font(theme.textFont)};
          fill: ${theme.textColor};
        }
      `}</Style>
      <text class="lang-name" x={2} y={15} data-testid={language.name}>
        {language.name}
      </text>
      <text class="lang-name" x={width - maxTextWidth} y={34}>
        {language.text}
      </text>

      {theme.hideProgressBar ? null : (
        <NormalProgressBar
          language={language}
          width={width - maxTextWidth - 10}
        />
      )}
    </g>
  );
};

export const NormalProgressBar: JSX.FC<{
  language: Language;
  width: number;
}> = ({ language, width }) => {
  const theme = useTheme();
  return (
    <svg width={width} x={0} y={25}>
      <rect
        rx="5"
        ry="5"
        x="0"
        y="0"
        width="100%"
        height="8"
        fill={theme.progressBarBackgroundColor}
      ></rect>
      <rect
        height="8"
        fill={getLanguageColor(language.name)}
        rx="5"
        ry="5"
        x="0"
        y="0"
        data-testid="lang-progress"
        width={`${language.percent}%`}
      ></rect>
    </svg>
  );
};
