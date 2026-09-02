// @expect
export interface BuildStatusProps {
  /** Outcome of the most recent build. */
  status: "passing" | "failing" | "pending";
}

/** Shows the result of a CI run. */
export function BuildStatus({ status }: BuildStatusProps) {
  const config = {
    passing: { className: "text-success-default", glyph: "✓", text: "Passing" },
    failing: { className: "text-danger-default", glyph: "✕", text: "Failing" },
    pending: { className: "text-fg-muted", glyph: "•", text: "Pending" },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1 text-sm ${config.className}`}
    >
      <span aria-hidden="true">{config.glyph}</span>
      {config.text}
    </span>
  );
}
