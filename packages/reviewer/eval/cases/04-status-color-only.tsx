// @expect A-04
export interface StatusDotProps {
  status: "online" | "away" | "offline";
}

/** Shows a user's presence. */
export function StatusDot({ status }: StatusDotProps) {
  const color =
    status === "online"
      ? "bg-success-default"
      : status === "away"
        ? "bg-warning-default"
        : "bg-fg-muted";

  return <span className={`inline-block size-2 rounded-full ${color}`} />;
}
