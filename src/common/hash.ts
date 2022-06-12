import { crypto } from "crypto";

export async function gitHashObject(
  object: Uint8Array | string,
): Promise<string> {
  const buffer = typeof object === "string"
    ? new TextEncoder().encode(object)
    : object;
  const blob = Uint8Array.from([
    ...new TextEncoder().encode("blob "),
    ...new TextEncoder().encode(buffer.length.toString()),
    0,
    ...buffer,
  ]);
  return await crypto.subtle.digest("SHA-1", blob).then((hash) =>
    Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}
