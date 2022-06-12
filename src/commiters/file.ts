import { Commiter } from "./types.ts";
import logging from "../common/logging.ts";

const fileCommiter: Commiter = async ({ path, content }) => {
  logging.verbose(1, "current directory:", Deno.cwd());
  await Deno.writeTextFile(path, content);
  logging.verbose(1, "write to:", await Deno.realPath(path));
};

export default fileCommiter;
