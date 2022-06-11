import * as JSX from '../common/jsx-extra.ts';

import type { Font, Gradient } from './utils.tsx';
import { createContext, useContext } from 'nano-jsx';

export interface Theme {
  defaultFontFamlily: string;

  titleColor: string;
  titleFont: Font;
  hideTitle: boolean;

  borderRadius: number;
  borderColor: string;
  hideBorder: boolean;

  bgColor: string | Gradient;

  paddingX: number;
  paddingY: number;

  enableAnimations: boolean;

  textColor: string;
  textFont: Font;
  lineHeight: number;

  progressBarBackgroundColor: string;
  hideProgressBar: boolean;
}

const defaultTheme: Theme = {
  defaultFontFamlily: "'Segoe UI', Ubuntu, Sans-Serif",

  titleColor: '#2f80ed',
  titleFont: {
    size: 18,
    weight: 600,
  },
  hideTitle: false,

  borderRadius: 4.5,
  borderColor: '#e4e2e2',
  hideBorder: false,

  bgColor: '#fffefe',

  paddingX: 25,
  paddingY: 35,

  enableAnimations: true,

  textColor: '#434d58',
  textFont: {
    size: 11,
    weight: 400,
  },
  lineHeight: 25,

  progressBarBackgroundColor: '#ddd',
  hideProgressBar: false,
};

const ThemeContext = createContext(defaultTheme);

export const ThemeProvider: JSX.FC<{ theme?: Theme }> = ({
  theme = defaultTheme,
  children,
}) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => useContext(ThemeContext);
