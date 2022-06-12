/**
 * Basic card component.
 * @module cards/Card
 */

import * as JSX from "../common/jsx-extra.ts";

import { LinearGradient } from "../themes/utils.tsx";
import Title from "./Title.tsx";
import { useTheme } from "../themes/Theme.tsx";

interface CardProps {
  width: number;
  height: number;
  title: string;
  titlePrefixIcon?: string;
}

const Card: JSX.FC<CardProps> = ({
  width,
  height,
  title,
  titlePrefixIcon,
  children,
}) => {
  const theme = useTheme();

  const defs = [];
  if (theme.bgColor instanceof Object) {
    defs.push(
      <LinearGradient id="bgcolor-gradient" gradient={theme.bgColor} />,
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="descId"
    >
      <title id="descId">{title}</title>

      <style>#_STYLE_PLACEHOLDER_#</style>

      {defs ? <defs>{defs}</defs> : null}

      <rect
        x="0.5"
        y="0.5"
        rx={theme.borderRadius}
        height="99%"
        stroke={theme.borderColor}
        width={width - 1}
        fill={theme.bgColor instanceof Object
          ? "url(#bgcolor-gradient)"
          : theme.bgColor}
        stroke-opacity={theme.hideBorder ? 0 : 1}
      />

      {!theme.hideTitle
        ? <Title title={title} titlePrefixIcon={titlePrefixIcon} />
        : null}

      <svg
        x={0}
        y={theme.hideTitle ? theme.paddingY : theme.paddingY + theme.lineHeight}
      >
        {children}
      </svg>
    </svg>
  );
};

export default Card;
