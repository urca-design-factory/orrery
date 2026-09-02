// @expect A-04
import { forwardRef } from "react";

export interface PriceChangeProps extends React.ComponentPropsWithoutRef<"span"> {
  /** Percentage change since the previous period. */
  change: number;
}

/** Shows how a value moved since the last period. */
export const PriceChange = forwardRef<HTMLSpanElement, PriceChangeProps>(
  ({ change, className, ...props }, ref) => (
    <span
      ref={ref}
      className={[
        change >= 0 ? "text-success-default" : "text-danger-default",
        "text-sm font-medium",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {Math.abs(change).toFixed(2)}%
    </span>
  ),
);
PriceChange.displayName = "PriceChange";
