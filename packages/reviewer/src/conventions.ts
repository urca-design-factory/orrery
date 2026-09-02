import { readFileSync } from "node:fs";

export interface ConventionRule {
  id: string;
  tag: "auto" | "llm" | "manual";
  text: string;
}

const RULE_LINE = /^\*\*([A-Z]-\d{2})\*\*\s+`\[(auto|llm|manual)\]`\s+(.+)$/;

export function parseConventions(path: string): ConventionRule[] {
  const rules: ConventionRule[] = [];

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = RULE_LINE.exec(line.trim());
    if (!match) continue;
    rules.push({
      id: match[1]!,
      tag: match[2] as ConventionRule["tag"],
      text: match[3]!.trim(),
    });
  }

  return rules;
}

export function formatRules(rules: ConventionRule[]): string {
  return rules.map((r) => `${r.id}: ${r.text}`).join("\n");
}
