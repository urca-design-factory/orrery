import { execFileSync } from "node:child_process";

/**
 * Files changed relative to a base ref, limited to reviewable source files.
 * Deleted files are excluded — there is nothing left to review.
 */
export function changedFiles(baseRef: string): string[] {
  const output = execFileSync(
    "git",
    ["diff", "--name-only", "--diff-filter=ACMR", `${baseRef}...HEAD`],
    { encoding: "utf8" },
  );

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"))
    .filter((file) => !file.includes("/eval/"))
    .filter((file) => !file.endsWith(".d.ts"));
}
