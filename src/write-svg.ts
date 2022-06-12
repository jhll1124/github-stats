import type { Commiter } from "./commiters/types.ts";
import { chain } from "./optimizers/core.ts";
import formatSvg from "./optimizers/format-svg.ts";
import hydrationStyle from "./optimizers/hydration-style.ts";
import logging from "./common/logging.ts";
import optimizeSvg from "./optimizers/optimize-svg.ts";

export default async function writeSvg({ path, content, commiters }: {
  path: string;
  content: string;
  commiters: Commiter[];
}): Promise<void> {
  logging.verbose(1, "optimize svg");
  const optimize = chain([hydrationStyle, optimizeSvg, formatSvg]);
  const optimized = optimize(content);
  logging.verbose(1, "svg optimized");
  logging.verbose(2, optimized);

  logging.verbose(1, "write svg");
  await Promise.all(
    commiters.map((commiter) => commiter({ path, content: optimized })),
  );
  logging.verbose(1, "svg written");
}
