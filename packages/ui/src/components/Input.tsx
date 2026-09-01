import { forwardRef } from "react";
import { cn } from "../lib/cn";

export interface InputProps extends Omit<
  React.ComponentPropsWithoutRef<"input">,
  "disabled"
> {
  isDisabled?: boolean;
  hasError?: boolean;
}

/**
 * A single-line text field.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, isDisabled = false, hasError = false, ...props }, ref) => (
    <input
      ref={ref}
      disabled={isDisabled}
      aria-invalid={hasError || undefined}
      className={cn(
        "w-full min-h-[38px] rounded-md border bg-bg-surface px-3 text-base text-fg-primary",
        "placeholder:text-fg-muted outline-none",
        "focus-visible:ring-2 focus-visible:ring-border-focus",
        "disabled:opacity-50 disabled:pointer-events-none",
        hasError ? "border-danger-default" : "border-border-default",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
