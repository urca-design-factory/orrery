// @expect P-05
import { forwardRef } from "react";

export interface ToastProps extends React.ComponentPropsWithoutRef<"div"> {
  /**
   * The message shown in the toast.
   *
   * Kept as a string rather than `children` because toasts are queued
   * programmatically from a `toast()` function call, where there is no JSX
   * context available at the call site.
   */
  message: string;
  /** How long the toast stays visible, in milliseconds. */
  duration?: number;
}

/** A transient notification shown after a background action completes. */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ message, duration = 4000, className, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      data-duration={duration}
      className={[
        "rounded-md bg-bg-inverse px-4 py-3 text-sm text-fg-inverse",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {message}
    </div>
  ),
);
Toast.displayName = "Toast";
