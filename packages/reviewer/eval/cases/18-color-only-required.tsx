// @expect A-04
import { forwardRef } from "react";

export interface FieldLabelProps extends React.ComponentPropsWithoutRef<"label"> {
  /** Marks the associated field as mandatory. */
  required?: boolean;
}

/** The visible name of a form field. */
export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ required = false, className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={[
        required ? "text-danger-default" : "text-fg-secondary",
        "text-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </label>
  ),
);
FieldLabel.displayName = "FieldLabel";
