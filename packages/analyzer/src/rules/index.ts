import ts from "typescript";
import type { FindingRecord } from "../types.js";
import type { RuleContext } from "./types.js";
import { classifyFile } from "../program.js";
import { makeId } from "../id.js";
import { producerRules } from "./producer.js";
import { consumerRules } from "./consumer.js";

export const allRules = [...producerRules, ...consumerRules];

export function runRules(
  sourceFiles: ts.SourceFile[],
  ctx: RuleContext,
): FindingRecord[] {
  const findings: FindingRecord[] = [];

  for (const sf of sourceFiles) {
    const scope = classifyFile(sf.fileName, ctx.root);
    if (scope === "external") continue;

    for (const rule of allRules) {
      if (rule.scope !== scope) continue;

      for (const f of rule.check(sf, ctx)) {
        findings.push({
          ...f,
          id: makeId(
            "fnd",
            f.rule,
            f.location.file,
            f.location.line,
            f.location.column,
            f.message,
          ),
        });
      }
    }
  }

  return findings;
}
