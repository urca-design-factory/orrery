// @expect
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const stat = cva("flex flex-col gap-1", {
  variants: {
    variant: {
      default: "",
      emphasis: "rounded-lg bg-bg-raised p-4",
    },
    size: { sm: "text-sm", md: "text-base" },
    align: { start: "items-start", center: "items-center" },
  },
  defaultVariants: { variant: "default", size: "md", align: "start" },
});

export interface StatProps
  extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof stat> {
  /** Short name of the measured quantity. */
  label: string;
  /** Element rendered after the value, such as a trend indicator. */
  trailing?: React.ReactNode;
}

/** Displays a single numeric metric with its name. */
export const Stat = forwardRef<HTMLDivElement, StatProps>(
  (
    { className, variant, size, align, label, trailing, children, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      className={[stat({ variant, size, align }), className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="text-sm text-fg-secondary">{label}</span>
      <span className="flex items-center gap-2 text-2xl font-medium text-fg-primary">
        {children}
        {trailing}
      </span>
    </div>
  ),
);
Stat.displayName = "Stat";
