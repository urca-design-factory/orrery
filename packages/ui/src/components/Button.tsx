import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent-default text-fg-on-accent hover:bg-accent-hover active:bg-accent-active",
        secondary:
          "bg-bg-raised text-fg-primary hover:bg-bg-canvas border border-border-default",
        ghost: "bg-transparent text-fg-primary hover:bg-bg-raised",
        danger:
          "bg-danger-default text-fg-on-accent hover:bg-danger-hover active:bg-danger-active",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof button> {
  /** Renders the child element as the button instead of a `<button>` tag. */
  asChild?: boolean;
  /** Disables interaction and shows a pending state. */
  loading?: boolean;
}

/**
 * The primary action trigger. Use `variant` to express intent, not appearance.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(button({ variant, size }), className)}
        disabled={disabled || loading}
        data-loading={loading || undefined}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
