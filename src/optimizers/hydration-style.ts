import { globalStyle } from "../common/Style.tsx";
import { minify } from "csso";

export default function hydrationStyle(svg: string) {
  const style = globalStyle.join("\n");
  const minified = minify(style, {});
  return svg.replace("#_STYLE_PLACEHOLDER_#", minified.css);
}
