import * as JSX from "../common/jsx-extra.ts";

import { Language, Languages } from "./Languages.tsx";

import Style from "../common/Style.tsx";
import { font } from "../themes/utils.tsx";
import getLanguageColor from "../common/languageColors.ts";
import { useTheme } from "../themes/Theme.tsx";

export const CompactLanguageList: JSX.FC<{
  languages: Languages;
  width: number;
}> = ({ languages, width }) => {
  const theme = useTheme();

  return (
    <>
      <CompactProgressBar languages={languages} width={width} />
      {languages.map((language, index) => {
        const x = index % 2 === 0 ? theme.paddingX : width / 2 + theme.paddingX;
        const y = theme.lineHeight * Math.floor(index / 2) + theme.lineHeight;
        return <CompactLanguage language={language} x={x} y={y} />;
      })}
    </>
  );
};

export const CompactLanguage: JSX.FC<{
  language: Language;
  x: number;
  y: number;
}> = ({ language, x, y }) => {
  const theme = useTheme();
  return (
    <g transform={`translate(${x}, ${y})`}>
      <Style>
        {`
        .lang-name {
          font: ${font(theme.textFont)};
          fill: ${theme.textColor};
        }
      `}
      </Style>
      <circle cx="5" cy="6" r="5" fill={getLanguageColor(language.name)} />
      <text x="15" y="10" class="lang-name">
        {language.name} - {language.text}
      </text>
    </g>
  );
};

export const CompactProgressBar: JSX.FC<{
  languages: Languages;
  width: number;
}> = ({ languages, width }) => {
  const theme = useTheme();

  let progressOffset = 0;
  return (
    <>
      <mask id="rect-mask">
        <rect
          x={theme.paddingX}
          y={0}
          width={width}
          height={8}
          fill="white"
          rx="5"
        />
      </mask>
      <rect
        mask="url(#rect-mask)"
        x={theme.paddingX}
        y={0}
        width={width}
        height={8}
        fill={theme.progressBarBackgroundColor}
      />
      {languages.map((language) => {
        const output = (
          <rect
            mask="url(#rect-mask)"
            x={progressOffset * width + theme.paddingX}
            y={0}
            width={(language.percent * width) / 100}
            height={8}
            fill={getLanguageColor(language.name)}
          />
        );
        progressOffset += language.percent / 100;
        return output;
      })}
    </>
  );
};
