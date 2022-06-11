import { FC } from '../common/jsx-extra.ts';
import { useTheme } from './Theme.tsx';

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

export function measureText(str: string, font: Font): number {
  const widths = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0.2796875, 0.2765625, 0.3546875, 0.5546875, 0.5546875,
    0.8890625, 0.665625, 0.190625, 0.3328125, 0.3328125, 0.3890625, 0.5828125,
    0.2765625, 0.3328125, 0.2765625, 0.3015625, 0.5546875, 0.5546875, 0.5546875,
    0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875,
    0.2765625, 0.2765625, 0.584375, 0.5828125, 0.584375, 0.5546875, 1.0140625,
    0.665625, 0.665625, 0.721875, 0.721875, 0.665625, 0.609375, 0.7765625,
    0.721875, 0.2765625, 0.5, 0.665625, 0.5546875, 0.8328125, 0.721875,
    0.7765625, 0.665625, 0.7765625, 0.721875, 0.665625, 0.609375, 0.721875,
    0.665625, 0.94375, 0.665625, 0.665625, 0.609375, 0.2765625, 0.3546875,
    0.2765625, 0.4765625, 0.5546875, 0.3328125, 0.5546875, 0.5546875, 0.5,
    0.5546875, 0.5546875, 0.2765625, 0.5546875, 0.5546875, 0.221875, 0.240625,
    0.5, 0.221875, 0.8328125, 0.5546875, 0.5546875, 0.5546875, 0.5546875,
    0.3328125, 0.5, 0.2765625, 0.5546875, 0.5, 0.721875, 0.5, 0.5, 0.5,
    0.3546875, 0.259375, 0.353125, 0.5890625,
  ];

  const avg = 0.5279276315789471;

  return (
    str
      .split('')
      .map((c) => widths[c.charCodeAt(0)] ?? avg)
      .reduce((cur, acc) => acc + cur) * font.size
  );
}
