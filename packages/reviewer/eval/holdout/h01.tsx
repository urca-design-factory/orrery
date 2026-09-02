// @expect N-06
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const spinner = cva(
  "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      variant: {
        thin: "border",
        thick: "border-4",
        dotted: "border-dotted",
      },
      size: { sm: "size-4", md: "size-6", lg: "size-8" },
    },
    defaultVariants: { variant: "thin", size: "md" },
  },
);

export interface SpinnerProps
  extends React.ComponentPropsWithoutRef<"span">, VariantProps<typeof spinner> {
  /** Accessible description of what is loading. */
  "aria-label": string;
}

/** Indicates that content is loading. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      className={[spinner({ variant, size }), className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  ),
);
Spinner.displayName = "Spinner";
