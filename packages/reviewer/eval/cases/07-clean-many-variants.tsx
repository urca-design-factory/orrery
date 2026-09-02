// @expect
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const alert = cva("flex gap-3 rounded-lg border p-4", {
  variants: {
    variant: {
      info: "border-border-default bg-bg-raised text-fg-primary",
      success: "border-border-default bg-success-subtle text-fg-primary",
      warning: "border-border-default bg-warning-subtle text-fg-primary",
      danger: "border-border-default bg-danger-subtle text-danger-active",
    },
    size: { sm: "text-sm", md: "text-base" },
  },
  defaultVariants: { variant: "info", size: "md" },
});

export interface AlertProps
  extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof alert> {
  /** Icon rendered before the message. */
  icon?: React.ReactNode;
  /** Hides the alert when dismissed. */
  dismissible?: boolean;
}

/** A banner communicating the outcome of an action. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    { className, variant, size, icon, dismissible = false, children, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      role="status"
      className={[alert({ variant, size }), className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon}
      <div className="flex-1">{children}</div>
      {dismissible ? (
        <button type="button" aria-label="Dismiss">
          ×
        </button>
      ) : null}
    </div>
  ),
);
Alert.displayName = "Alert";
