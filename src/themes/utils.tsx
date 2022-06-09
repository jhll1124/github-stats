import { FC } from '../common/jsx_extra.ts';
import { useTheme } from "./Theme.tsx";

export interface Gradient {
  angle: number;
  stops: Array<[number, string]>;
}

export const LinearGradient: FC<{ id: string; gradient: Gradient }> = ({
  id,
  gradient,
}) => {
  return (
    <linearGradient
      id={id}
      gradientTransform={`rotate(${gradient.angle})`}
      gradientUnits="userSpaceOnUse"
    >
      {gradient.stops.map(([offset, color]) => (
        <stop key={offset} offset={`${offset * 100}%`} stop-color={color} />
      ))}
    </linearGradient>
  );
};

export interface Font {
  family?: string;
  size: number;
  weight: number;
}

export function font({ family, size, weight }: Font): string {
  const theme = useTheme();
  return `${weight} ${size}px ${family ?? theme.defaultFontFamlily}`;
}

/**
 * Calculate the font size in Firefox to fix text overflow.
 */
export function firefoxFontSize(font: Font): string {
  return `${(font.size * 0.85).toFixed(1)}px`;
}