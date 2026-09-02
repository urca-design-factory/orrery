// @expect A-04
export interface DiffLineProps {
  /** Whether the line was added or removed. */
  change: "added" | "removed";
  children: React.ReactNode;
}

/** A single line in a code diff. */
export function DiffLine({ change, children }: DiffLineProps) {
  return (
    <div
      className={change === "added" ? "bg-success-subtle" : "bg-danger-subtle"}
    >
      <code className="font-mono text-sm">{children}</code>
    </div>
  );
}
