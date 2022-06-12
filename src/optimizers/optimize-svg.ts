import SVGO from "svgo";

/**
 * Optimizes SVG code, using SVGO.
 * @param svg SVG code.
 */
export default function optimizeSvg(svg: string) {
  const result = SVGO.optimize(svg, {
    multipass: true,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            //Force CSS style consistency
            inlineStyles: false,
            removeViewBox: false,
            removeTitle: false,
            removeHiddenElems: false,
            minifyStyles: false,
          },
        },
      },
      //Additional cleanup
      "cleanupListOfValues",
      "removeRasterImages",
      "removeScriptElement",
    ],
  });
  if (result.error !== undefined) throw Error(result.error);
  return result.data;
}
