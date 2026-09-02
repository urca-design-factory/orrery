import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export interface FixtureExemption {
  component: string;
  rule: string;
}

const ROW = /^\|\s*([A-Za-z][\w.]*)\s*\|\s*([A-Z]-\d{2})\s*\|/;

/**
 * Violations declared intentional in a package's FIXTURES.md. These exist so
 * the analyzer and reviewer have something real to detect; they are not debt.
 */
export function loadFixtures(paths: string[]): FixtureExemption[] {
  const exemptions: FixtureExemption[] = [];

  for (const path of paths) {
    if (!existsSync(path)) continue;

    for (const line of readFileSync(path, "utf8").split("\n")) {
      const match = ROW.exec(line.trim());
      if (!match) continue;
      exemptions.push({ component: match[1]!, rule: match[2]! });
    }
  }

  return exemptions;
}

export function isExempt(
  exemptions: FixtureExemption[],
  rule: string,
  file: string,
): boolean {
  const basename =
    file
      .split("/")
      .pop()
      ?.replace(/\.tsx?$/, "") ?? "";
  return exemptions.some((e) => e.rule === rule && e.component === basename);
}
