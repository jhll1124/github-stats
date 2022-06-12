import * as JSX from "../common/jsx-extra.ts";

import { firefoxFontSize, font } from "../themes/utils.tsx";

import { FlexLayout } from "./Layout.tsx";
import Style from "../common/Style.tsx";
import { useTheme } from "../themes/Theme.tsx";

const Title: JSX.FC<{ title: string; titlePrefixIcon?: string }> = ({
  title,
  titlePrefixIcon,
}) => {
  const theme = useTheme();
  return (
    <g
      transform={`translate(${theme.paddingX}, ${theme.paddingY})`}
    >
      <Style>
        {`
        .header {
          font: ${font(theme.titleFont)};
          fill: ${theme.titleColor};
          ${
          theme.enableAnimations
            ? "animation: fadeInAnimation 0.8s ease-in-out forwards;"
            : ""
        }
        }
        @supports(-moz-appearance: auto) {
          /* Selector detects Firefox */
          .header { font-size: ${firefoxFontSize(theme.titleFont)}; }
        }

        @keyframes fadeInAnimation {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}
      </Style>
      <FlexLayout gap={theme.lineHeight} direction="horizon">
        {titlePrefixIcon
          ? (
            <svg
              class="icon"
              x="0"
              y="-13"
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              height="16"
            >
              {titlePrefixIcon}
            </svg>
          )
          : null}
        <text x="0" y="0" class="header">
          {title}
        </text>
      </FlexLayout>
    </g>
  );
};

export default Title;
