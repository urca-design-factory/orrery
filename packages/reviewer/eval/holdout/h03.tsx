// @expect P-05 A-04
export interface PasswordStrengthProps {
  /** Score between 0 and 4 from the strength estimator. */
  score: 0 | 1 | 2 | 3 | 4;
  /** Text explaining how to improve the password. */
  hintText: string;
}

/** Visualises how strong a password is. */
export function PasswordStrength({ score, hintText }: PasswordStrengthProps) {
  const color =
    score >= 3
      ? "bg-success-default"
      : score === 2
        ? "bg-warning-default"
        : "bg-danger-default";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full ${index < score ? color : "bg-bg-raised"}`}
          />
        ))}
      </div>
      <p className="text-xs text-fg-secondary">{hintText}</p>
    </div>
  );
}
