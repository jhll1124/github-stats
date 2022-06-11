import { Commiter } from "./types.ts";

const fileCommiter: Commiter = async ({ path, content }) => {
  await Deno.writeTextFile(path, content);
};

export default fileCommiter;