import languageColors from './languageColors.json' assert { type: 'json' };

interface LanguageColors {
  [key: string]: string | undefined;
}

const langColors: LanguageColors = languageColors;

export default function getLanguageColor(name: string): string {
  return langColors[name] || languageColors["_default"];
}
