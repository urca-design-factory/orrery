import { resolve } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  createAnalyzerProgram,
  getProjectSourceFiles,
  classifyFile,
} from "./program.js";
import { runConsumerPass } from "./passes/consumer.js";
import type { OrreryIndex } from "./types.js";
import { runProducerPass } from "./passes/producer.js";
import { runRules } from "./rules/index.js";
import { findClusters } from "./cluster.js";
import { loadFixtures, isExempt } from "./fixtures.js";

const tsconfigPath = resolve(process.cwd(), "../../apps/demo/tsconfig.json");
const { program, checker, workspaceRoot } = createAnalyzerProgram(tsconfigPath);
const sourceFiles = getProjectSourceFiles(program);

const components = runProducerPass(
  program,
  checker,
  workspaceRoot,
  sourceFiles,
);
const usages = runConsumerPass(program, checker, workspaceRoot, sourceFiles);
const findings = runRules(sourceFiles, {
  checker,
  root: workspaceRoot,
  components,
  usages,
});

const clusters = findClusters(
  sourceFiles,
  workspaceRoot,
  (f) => classifyFile(f, workspaceRoot) === "consumer",
);

const index: OrreryIndex = {
  version: 1,
  generatedAt: new Date().toISOString(),
  components,
  usages,
  findings: [],
  clusters,
};

const outDir = resolve(process.cwd(), "artifacts");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "index.json"), JSON.stringify(index, null, 2));

console.log(
  `✓ ${components.length} components, ${usages.length} usages, ${findings.length} findings → artifacts/index.json`,
);

for (const f of findings) {
  console.log(
    `  ${f.rule}  ${f.location.file}:${f.location.line}  ${f.message}`,
  );
}

for (const cluster of clusters) {
  console.log(
    `\n  ⧉ ${cluster.shape} repeated ${cluster.occurrences}× — promotion candidate`,
  );
  for (const m of cluster.members) {
    console.log(`      ${m.location.file}:${m.location.line}`);
  }
}

const incomplete = usages.filter((u) => !u.propsComplete);
if (incomplete.length > 0) {
  console.log(
    `  ${incomplete.length} record(s) incomplete due to spread props`,
  );
}

const fixtures = loadFixtures([
  resolve(workspaceRoot, "packages/ui/FIXTURES.md"),
  resolve(workspaceRoot, "apps/demo/FIXTURES.md"),
]);

const blocking = findings.filter(
  (f) => f.severity === "error" && !isExempt(fixtures, f.rule, f.location.file),
);

if (blocking.length > 0) {
  console.error(`\n${blocking.length} blocking finding(s):`);
  for (const f of blocking) {
    console.error(
      `  ${f.rule}  ${f.location.file}:${f.location.line}  ${f.message}`,
    );
  }
  process.exit(1);
}

console.log(
  `\n${findings.length - blocking.length} finding(s) exempted as declared fixtures.`,
);
