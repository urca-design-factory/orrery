export interface CaseResult {
  file: string;
  expected: string[];
  actual: string[];
}

export interface Metrics {
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  f1: number;
}

/**
 * Scored per finding, not per file: a case expecting two rules and receiving
 * one correct plus one wrong counts as one TP and one FP.
 */
export function score(results: CaseResult[]): Metrics {
  let tp = 0;
  let fp = 0;
  let fn = 0;

  for (const result of results) {
    const expected = new Set(result.expected);
    const actual = new Set(result.actual);

    for (const rule of actual) {
      if (expected.has(rule)) tp++;
      else fp++;
    }
    for (const rule of expected) {
      if (!actual.has(rule)) fn++;
    }
  }

  const precision = tp + fp === 0 ? 1 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 1 : tp / (tp + fn);
  const f1 =
    precision + recall === 0
      ? 0
      : (2 * precision * recall) / (precision + recall);

  return {
    truePositives: tp,
    falsePositives: fp,
    falseNegatives: fn,
    precision,
    recall,
    f1,
  };
}

export function formatMetrics(m: Metrics): string {
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
  return [
    `  true positives   ${m.truePositives}`,
    `  false positives  ${m.falsePositives}`,
    `  false negatives  ${m.falseNegatives}`,
    `  precision        ${pct(m.precision)}`,
    `  recall           ${pct(m.recall)}`,
    `  f1               ${pct(m.f1)}`,
  ].join("\n");
}
