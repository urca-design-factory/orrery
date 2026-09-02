// @expect N-06
import { cva } from "class-variance-authority";

const tag = cva("rounded px-2 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      gray: "bg-bg-raised text-fg-secondary",
      blue: "bg-accent-subtle text-accent-active",
      red: "bg-danger-subtle text-danger-active",
    },
  },
  defaultVariants: { variant: "gray" },
});

export interface TagProps {
  /** Color of the tag. */
  variant?: "gray" | "blue" | "red";
  children: React.ReactNode;
}

/** A label attached to a resource. */
export function Tag({ variant, children }: TagProps) {
  return <span className={tag({ variant })}>{children}</span>;
}
