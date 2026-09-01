import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const badge = cva(
  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
  {
    variants: {
      kind: {
        neutral: "bg-bg-raised text-fg-secondary",
        info: "bg-accent-subtle text-accent-active",
        success: "bg-success-subtle text-fg-primary",
        warning: "bg-warning-subtle text-fg-primary",
        danger: "bg-danger-subtle text-danger-active",
      },
    },
    defaultVariants: {
      kind: "neutral",
    },
  },
);

export interface BadgeProps
  extends React.ComponentPropsWithoutRef<"span">, VariantProps<typeof badge> {
  /** The text shown inside the badge. */
  label: string;
}

/**
 * A small status indicator.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, kind, label, ...props }, ref) => (
    <span ref={ref} className={cn(badge({ kind }), className)} {...props}>
      {label}
    </span>
  ),
);

Badge.displayName = "Badge";
