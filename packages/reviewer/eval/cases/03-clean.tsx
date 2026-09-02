// @expect
import { forwardRef } from "react";

export interface DividerProps extends React.ComponentPropsWithoutRef<"hr"> {
  /** Renders the divider vertically instead of horizontally. */
  vertical?: boolean;
}

/** A thin rule separating content. */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ vertical = false, className, ...props }, ref) => (
    <hr
      ref={ref}
      className={[
        vertical ? "h-full w-px" : "h-px w-full",
        "bg-border-default",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  ),
);

Divider.displayName = "Divider";
