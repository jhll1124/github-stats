import * as JSX from '../common/jsx_extra.ts';

import { firefoxFontSize, font } from '../themes/utils.tsx';

import Style from '../common/Style.tsx';
import { useTheme } from '../themes/Theme.tsx';

export interface Language {
  name: string;
  percent: number;
  text: string;
}

export type Languages = Language[];

export const ProgressBar: JSX.FC<{
  language: Language;
}> = ({ language }) => {
  const theme = useTheme();
  return (
    <svg width={220} x={110} y={4}>
      <rect
        rx="5"
        ry="5"
        x="0"
        y="0"
        width={220}
        height="8"
        fill={theme.progressBarBackgroundColor ?? theme.textColor}
      ></rect>
      <rect
        height="8"
        fill={theme.progressBarColor ?? theme.titleColor}
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

export const LanguageWithProgressBar: JSX.FC<{
  language: Language;
}> = ({ language }) => {
  const theme = useTheme();
  // const staggerDelay = (index + 3) * 150;

  return (
    <g
      class="stagger"
      style="animation-delay: ${staggerDelay}ms"
      transform="translate(25, 0)"
    >
      <Style>{`
        .stat {
          font: ${font(theme.textFont)}; 
          fill: ${theme.textColor};
        }
        @supports(-moz-appearance: auto) {
          /* Selector detects Firefox */
          .stat { font-size: ${firefoxFontSize(theme.textFont)}; }
        }

        .bold { font-weight: 700 }
      `}</Style>
      <text class="stat bold" y="12.5" data-testid={language.name}>
        {language.name}:
      </text>
      <text class="stat" x={theme.hideProgressBar ? 170 : 350} y="12.5">
        {language.text}
      </text>

      {theme.hideProgressBar ? null : <ProgressBar language={language} />}
    </g>
  );
};
