import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseConventions } from "./conventions.js";
import { reviewFile, type ReviewFinding } from "./review.js";
import { changedFiles } from "./changed-files.js";

const here = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(here, "../../..");

const PRODUCER_PREFIX = "packages/ui/src/";

interface FileReview {
  file: string;
  findings: ReviewFinding[];
  error: string | null;
}

function renderMarkdown(reviews: FileReview[]): string {
  const withFindings = reviews.filter((r) => r.findings.length > 0);
  const withErrors = reviews.filter((r) => r.error !== null);
  const total = withFindings.reduce((sum, r) => sum + r.findings.length, 0);

  if (total === 0 && withErrors.length === 0) {
    return [
      "### Convention review",
      "",
      `Checked ${reviews.length} changed file(s) against the \`[llm]\` rules in \`CONVENTIONS.md\`. No violations found.`,
    ].join("\n");
  }

  const lines = [
    "### Convention review",
    "",
    `${total} possible violation(s) across ${withFindings.length} file(s).`,
    "",
  ];

  for (const review of withFindings) {
    lines.push(`**\`${review.file}\`**`, "");
    for (const finding of review.findings) {
      const where = finding.line ? `line ${finding.line}` : "file";
      lines.push(`- \`${finding.rule}\` (${where}) — ${finding.message}`);
    }
    lines.push("");
  }

  if (withErrors.length > 0) {
    lines.push(
      "<details><summary>Files that could not be reviewed</summary>",
      "",
    );
    for (const review of withErrors) {
      lines.push(`- \`${review.file}\`: ${review.error}`);
    }
    lines.push("", "</details>", "");
  }

  lines.push(
    "---",
    "",
    "These rules require judgement, so this review can be wrong. It is advisory —",
    "the deterministic `[auto]` rules are enforced separately by the analyzer.",
  );

  return lines.join("\n");
}

const baseRef = process.env.BASE_REF ?? "origin/main";
const rules = parseConventions(resolve(workspaceRoot, "CONVENTIONS.md"));
const llmRules = rules.filter((r) => r.tag === "llm");

const files = changedFiles(baseRef).filter((f) =>
  f.startsWith(PRODUCER_PREFIX),
);

if (files.length === 0) {
  console.log("### Convention review\n\nNo design system files changed.");
  process.exit(0);
}

const reviews: FileReview[] = [];

for (const file of files) {
  const absolute = resolve(workspaceRoot, file);
  if (!existsSync(absolute)) continue;

  const source = readFileSync(absolute, "utf8");

  try {
    const findings = await reviewFile(source, file, llmRules);
    reviews.push({ file, findings, error: null });
  } catch (error) {
    const summary = (error as Error).message.split("\n")[0] ?? "Unknown error";
    reviews.push({ file, findings: [], error: summary });
  }
}

console.log(renderMarkdown(reviews));
