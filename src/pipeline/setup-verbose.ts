import logging from "../common/logging.ts";

export default function setUpVerbose<
  T extends {
    verbose?: number;
  },
>({ verbose = 0, ...env }: T) {
  logging.setVerbose(verbose);
  return env;
}
