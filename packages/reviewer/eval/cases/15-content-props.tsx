// @expect P-05
export interface EmptyStateProps {
  /** Heading shown above the description. */
  heading: string;
  /** Explanatory text below the heading. */
  description: string;
  /** Text of the primary action button. */
  actionLabel?: string;
}

/** Shown when a collection has no items yet. */
export function EmptyState({
  heading,
  description,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-8 text-center">
      <p className="text-lg font-medium text-fg-primary">{heading}</p>
      <p className="text-sm text-fg-secondary">{description}</p>
      {actionLabel ? <button type="button">{actionLabel}</button> : null}
    </div>
  );
}
