import { createHash } from "node:crypto";

/** Deterministic short id, stable across runs and machines. */
export function makeId(prefix: string, ...parts: (string | number)[]): string {
  const hash = createHash("sha256").update(parts.join("|")).digest("hex");
  return `${prefix}_${hash.slice(0, 10)}`;
}
