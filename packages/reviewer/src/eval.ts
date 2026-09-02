import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseConventions } from "./conventions.js";
import { reviewFile } from "./review.js";
import {
  score,
  formatMetrics,
  type CaseResult,
  type Metrics,
} from "./metrics.js";

const here = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(here, "../../..");

const setName = process.env.EVAL_SET ?? "cases";
const casesDir = resolve(here, `../eval/${setName}`);

const EXPECT_LINE = /^\/\/[ \t]*@expect[ \t]*(.*)$/m;

function expectedRules(source: string, file: string): string[] {
  const match = EXPECT_LINE.exec(source);
  if (!match) throw new Error(`${file} has no @expect line`);
  return match[1]!.trim().split(/\s+/).filter(Boolean).sort();
}

function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdev(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  return Math.sqrt(mean(values.map((v) => (v - m) ** 2)));
}

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

const rules = parseConventions(resolve(workspaceRoot, "CONVENTIONS.md"));
const llmRules = rules.filter((r) => r.tag === "llm");

if (llmRules.length === 0) {
  throw new Error(
    "No [llm] rules parsed from CONVENTIONS.md — check the rule line format.",
  );
}

const files = readdirSync(casesDir)
  .filter((f) => f.endsWith(".tsx"))
  .sort();
const runs = Number(process.env.EVAL_RUNS ?? "3");

console.log(
  `${files.length} cases, ${llmRules.length} [llm] rules, ${runs} run(s)\n`,
);

const perRun: Metrics[] = [];
const failuresByCase = new Map<string, number>();
let errors = 0;

for (let run = 1; run <= runs; run++) {
  const results: CaseResult[] = [];

  for (const file of files) {
    const source = readFileSync(resolve(casesDir, file), "utf8");
    const expected = expectedRules(source, file);

    let actual: string[] = [];
    let failed = false;

    try {
      const findings = await reviewFile(source, file, llmRules);
      actual = [...new Set(findings.map((f) => f.rule))].sort();
    } catch (error) {
      const summary = (error as Error).message.split("\n")[0];
      console.log(`✗ ${file} — review failed: ${summary}`);
      failed = true;
      errors++;
    }

    const hit =
      !failed &&
      expected.length === actual.length &&
      expected.every((r, i) => r === actual[i]);

    if (!hit) {
      failuresByCase.set(file, (failuresByCase.get(file) ?? 0) + 1);
    }

    if (!failed && (runs === 1 || !hit)) {
      console.log(
        `${hit ? "✓" : "✗"} ${file}${runs > 1 ? ` (run ${run})` : ""}`,
      );
      console.log(`    expected: ${expected.join(", ") || "(clean)"}`);
      console.log(`    actual:   ${actual.join(", ") || "(clean)"}`);
    }

    results.push({ file, expected, actual });
  }

  perRun.push(score(results));
}

console.log("");

if (runs === 1) {
  console.log(formatMetrics(perRun[0]!));
} else {
  const f1s = perRun.map((m) => m.f1);
  const precisions = perRun.map((m) => m.precision);
  const recalls = perRun.map((m) => m.recall);

  console.log(
    `  precision  ${pct(mean(precisions))} ± ${(stdev(precisions) * 100).toFixed(1)}`,
  );
  console.log(
    `  recall     ${pct(mean(recalls))} ± ${(stdev(recalls) * 100).toFixed(1)}`,
  );
  console.log(
    `  f1         ${pct(mean(f1s))} ± ${(stdev(f1s) * 100).toFixed(1)}`,
  );
  console.log(`  per-run f1 ${f1s.map(pct).join(", ")}`);

  if (failuresByCase.size > 0) {
    console.log("\n  unstable cases:");
    for (const [file, count] of [...failuresByCase].sort(
      (a, b) => b[1] - a[1],
    )) {
      console.log(`    ${file}  failed ${count}/${runs}`);
    }
  }
}

if (errors > 0) {
  console.log(
    `\n  ${errors} review(s) failed to produce output and were scored as finding nothing.`,
  );
}
