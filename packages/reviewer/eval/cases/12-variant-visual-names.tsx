// @expect N-06
import { cva } from "class-variance-authority";

const chip = cva("inline-flex items-center rounded-full px-3 py-1 text-sm", {
  variants: {
    variant: {
      outlined: "border border-border-default text-fg-primary",
      filled: "bg-accent-default text-fg-on-accent",
      small: "px-2 py-0.5 text-xs",
      rounded: "rounded-md",
    },
  },
  defaultVariants: { variant: "outlined" },
});

export interface ChipProps {
  /** Visual treatment of the chip. */
  variant?: "outlined" | "filled" | "small" | "rounded";
  children: React.ReactNode;
}

/** A compact removable tag. */
export function Chip({ variant, children }: ChipProps) {
  return <span className={chip({ variant })}>{children}</span>;
}
