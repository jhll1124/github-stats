import * as JSX from '../common/jsx_extra.ts';

import { Language, Languages } from './Languages.tsx';

import Style from '../common/Style.tsx';
import { font } from '../themes/utils.tsx';
import getLanguageColor from '../common/languageColors.ts';
import { useTheme } from '../themes/Theme.tsx';

export const CompactProgressBar: JSX.FC<{
  languages: Languages;
}> = ({ languages }) => {
  const width = 490;
  let progressOffset = 0;
  return (
    <>
      <mask id="rect-mask">
        <rect x="25" y="0" width={width - 50} height="8" fill="white" rx="5" />
      </mask>
      {languages.map((language) => {
        const progress = ((width - 25) * language.percent) / 100;

        const output = (
          <rect
            mask="url(#rect-mask)"
            data-testid="lang-progress"
            x={progressOffset}
            y="0"
            width={progress}
            height="8"
            fill={getLanguageColor(language.name)}
          />
        );
        progressOffset += progress;
        return output;
      })}
    </>
  );
};

export const CompactLanguageList: JSX.FC<{
  languages: Languages;
  top: number;
}> = ({ languages, top }) => {
  return (
    <>
      {languages.map((language, index) => {
        const x = index % 2 === 0 ? 25 : 230;
        const y = index % 2 === 0 ? 12.5 * index + top : 12.5 * index + top / 2;
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
      <Style>{`      
        .lang-name { 
          font: ${font(theme.textFont)}; 
          fill: ${theme.textColor};
        }    
      `}</Style>
      <circle cx="5" cy="6" r="5" fill={getLanguageColor(language.name)} />
      <text data-testid="lang-name" x="15" y="10" class="lang-name">
        {language.name} - {language.text}
      </text>
    </g>
  );
};
