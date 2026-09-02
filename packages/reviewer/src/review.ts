import Anthropic from "@anthropic-ai/sdk";
import type { ConventionRule } from "./conventions.js";
import { formatRules } from "./conventions.js";

export interface ReviewFinding {
  rule: string;
  line: number | null;
  message: string;
}

const workspaceId = "wrkspc_01BHnnaggm56qitLMv28PZ1b";

const client = new Anthropic({
  defaultHeaders: workspaceId ? { "anthropic-workspace-id": workspaceId } : {},
});

const PREFILL = '{"findings":';

const SYSTEM = `You review React component code against a design system's written conventions.

You will be given the rules and one source file. Report only violations of the
rules you are given. Do not report style preferences, performance concerns, or
anything the rules do not cover.

The "rule" field must be one of the rule ids listed below. Never invent a rule
id, and never cite a rule that is not in the list — if something looks wrong but
no listed rule covers it, say nothing.

These rules require judgement, so being conservative matters: report a
violation only when you can point to the specific code that breaks it. When a
file is clean, return an empty list — that is a normal and expected outcome.

Respond with a single JSON object and nothing else. No reasoning, no prose, no
markdown fences, no text before or after:
{"findings":[{"rule":"N-06","line":12,"message":"..."}]}

Each message must be one sentence naming what is wrong and what to do instead.`;

/**
 * Pulls the JSON object out of a response, tolerating a prose preamble or
 * markdown fences. Scans for the findings key first so trailing output wins
 * over any braces that appeared in reasoning above it.
 */
function extractJson(text: string): string | null {
  const fenced = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/.exec(text);
  if (fenced) return fenced[1]!;

  const keyed = text.lastIndexOf('{"findings"');
  if (keyed !== -1) return text.slice(keyed);

  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last > first) return text.slice(first, last + 1);

  return null;
}

export async function reviewFile(
  source: string,
  fileName: string,
  rules: ConventionRule[],
  model = "claude-sonnet-4-6",
): Promise<ReviewFinding[]> {
  const response = await client.messages.create({
    model,
    max_tokens: 2000,
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `## Rules\n\n${formatRules(rules)}\n\n## File: ${fileName}\n\n\`\`\`tsx\n${source}\n\`\`\``,
      },
    ],
  });

  const raw = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  const json = extractJson(raw);

  if (json === null) {
    throw new Error(`No JSON object found in model output:\n${raw}`);
  }

  let parsed: { findings?: ReviewFinding[] };
  try {
    parsed = JSON.parse(json) as { findings?: ReviewFinding[] };
  } catch {
    throw new Error(`Model did not return valid JSON:\n${json}`);
  }

  const valid = new Set(rules.map((r) => r.id));
  return (parsed.findings ?? []).filter((f) => valid.has(f.rule));
}
