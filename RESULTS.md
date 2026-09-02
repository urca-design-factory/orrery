# Eval history

The reviewer checks React component code against the `[llm]`-tagged rules in
`CONVENTIONS.md`. Scoring is per finding, not per file: a case expecting two
rules and receiving one correct plus one wrong counts as one true positive and
one false positive. Duplicate findings for the same rule collapse to one.

Every row below is one change and its measured effect. Runs 1–8 use the
development set (`eval/cases`, 30 cases). Run 9 is the single run against the
held-out set (`eval/holdout`, 10 cases).

| Run | Set         | Cases | Precision    | Recall       | F1              | Change                                                                                                                                                                                                                                                                                                                                            |
| --- | ----------- | ----- | ------------ | ------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | dev         | 6     | 83.3%        | 29.4%        | 43.5%           | Baseline. Recall is meaningless here — the `@expect` parser used `\s*`, which crossed the newline and read the next line as expected rules.                                                                                                                                                                                                       |
| 2   | dev         | 6     | 83.3%        | 100.0%       | 90.9%           | Parser anchored to `[ \t]*`. Revealed that P-05 had silently dropped out of the rule set through a formatting error in `CONVENTIONS.md`.                                                                                                                                                                                                          |
| 3   | dev         | 6     | 100.0%       | 100.0%       | 100.0%          | Rule id validation added in both the prompt and the code — the model had cited a rule that was not in the list it was given. Case 05 expectation corrected: the model was right, P-05 was a genuine third violation the golden set had missed.                                                                                                    |
| 4   | dev         | 24    | 94.7%        | 90.0%        | 92.3%           | Golden set expanded 6→24: nine clean cases, four multi-violation cases, at least two positives per rule. C-01 missed on both cases where it applied.                                                                                                                                                                                              |
| 5   | dev         | 24    | 100.0%       | 100.0%       | 100.0%          | C-01 rewritten. The old text ("more than three levels of nested configuration") was not measurable and overlapped with P-06; the new text keys on props clustering into named region groups (`header*`, `footer*`). No prompt change was needed — the rule text was the problem.                                                                  |
| 6   | dev         | 30    | 96.3%        | 96.3%        | 96.3%           | Golden set expanded 24→30: long noisy files with a single buried violation, near-miss clean cases, and one case where a prop's TSDoc argues for an exception. Both failures were P-05, in opposite directions — a `label` on a `<label>` element flagged as content, and a `message` prop excused because its TSDoc explained itself.             |
| 7   | dev         | 30    | 97.6% ± 1.7  | 97.5% ± 1.7  | 97.5% ± 0.9     | P-05 rewritten around a measurable test — could the caller have written this as markup — plus an exemption list and an explicit statement that a documented reason is not an exception. Fixed both prior failures; surfaced a new one where a single `icon: ReactNode` prop was flagged, contradicting two clean cases that use the same pattern. |
| 8   | dev         | 30    | 100.0% ± 0.0 | 100.0% ± 0.0 | 100.0% ± 0.0    | P-05 narrowed to exclude secondary `ReactNode` slots (`icon`, `trailing`, `action`) alongside a real `children`.                                                                                                                                                                                                                                  |
| 9   | **holdout** | 10    | 90.6% ± 0.4  | 87.9% ± 4.3  | **89.2% ± 2.4** | First and only run against the held-out set. Not used for tuning; no changes made after seeing it.                                                                                                                                                                                                                                                |

Runs 7 onward are the mean of three runs with standard deviation. Earlier runs
are single measurements.

## What the iteration actually changed

Six of the eight development-set iterations changed a rule's wording rather
than the prompt. The prompt changed twice: once to forbid inventing rule ids,
once to tolerate a prose preamble before the JSON.

This is the project's main finding. An ambiguous rule produces an ambiguous
check, and the fix belongs in the specification rather than in the prompt. C-01
is the clearest case: rewriting "more than three levels of nested
configuration" as "props cluster into named region groups" took the rule from
missed-in-every-applicable-case to caught-in-every-applicable-case, with the
prompt untouched.

## Overfitting

The development set reached 100% after eight iterations of rule and prompt
changes. The held-out set — ten cases written before the final iterations and
never used for tuning — scores 89.2%. The roughly 11 point gap is the cost of
tuning against a set I could see, and it is the number worth quoting.

The three failure modes on the held-out set:

- **`h04`, false positive in 3/3 runs.** A `legend` prop flagged as P-05. The
  rule's exemption list names `<label>` with `htmlFor`, `placeholder`,
  `aria-label` and `alt`; `<legend>` is the same situation and is not listed.
  The rule generalises to the examples it was written against rather than to
  the principle behind them.
- **`h08`, false negative in 2/3 runs.** An N-06 violation sitting under sixty
  lines of positioning logic. The same violation in a short file is caught
  reliably, so this is an attention limit rather than a comprehension one.
- **`h03`, one run in thirty produced no parseable output** despite the
  tolerant JSON extractor. Scored as finding nothing, which counts against
  recall rather than being hidden.

Fixing `h04` would take one clause. It is deliberately left alone: patching a
rule in response to the held-out set would turn it into a second development
set and make the 89.2% unrepeatable.

## Known limits of this measurement

- Thirty development cases and ten held-out cases are small. Differences under
  roughly five points are not meaningful at this size.
- All forty cases were written by one person against one set of rules. A
  second author would produce different boundary cases and probably a lower
  score.
- Cases are single files. The reviewer never sees a diff, a component's usage
  in product code, or the rest of the design system — all of which a human
  reviewer would have.
- Failures that produce no output are scored as clean. This is conservative
  for recall and neutral for precision.
- Only the six `[llm]` rules are measured here. The twenty `[auto]` rules are
  deterministic and covered by the analyzer's own tests.
