// @expect
import { forwardRef } from "react";

export interface CheckboxProps extends Omit<
  React.ComponentPropsWithoutRef<"input">,
  "type"
> {
  /** Renders the mixed state used when only some children are selected. */
  indeterminate?: boolean;
}

/** A binary selection control. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate = false, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      aria-checked={indeterminate ? "mixed" : undefined}
      className={["size-4 rounded-sm border border-border-default", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  ),
);
Checkbox.displayName = "Checkbox";
