// @expect P-05
export interface TooltipProps {
  /** Text shown inside the tooltip bubble. */
  content: string;
  children: React.ReactNode;
}

/** Reveals a short hint on hover. */
export function Tooltip({ content, children }: TooltipProps) {
  return (
    <span className="relative inline-block group">
      {children}
      <span
        role="tooltip"
        className="absolute hidden rounded bg-bg-inverse px-2 py-1 text-xs text-fg-inverse group-hover:block"
      >
        {content}
      </span>
    </span>
  );
}
