// @expect N-06
import { cva } from "class-variance-authority";

const alert = cva("rounded p-3", {
  variants: {
    variant: {
      blue: "bg-accent-subtle text-accent-active",
      red: "bg-danger-subtle text-danger-active",
      big: "p-5 text-lg",
    },
  },
  defaultVariants: { variant: "blue" },
});

export interface AlertProps {
  variant?: "blue" | "red" | "big";
  children: React.ReactNode;
}

export function Alert({ variant, children }: AlertProps) {
  return <div className={alert({ variant })}>{children}</div>;
}
