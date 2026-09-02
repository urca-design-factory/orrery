import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const notice = cva("flex items-start gap-3 rounded-lg border p-4", {
  variants: {
    variant: {
      blue: "border-border-default bg-accent-subtle text-accent-active",
      yellow: "border-border-default bg-warning-subtle text-fg-primary",
      red: "border-border-default bg-danger-subtle text-danger-active",
    },
  },
  defaultVariants: {
    variant: "blue",
  },
});

export interface NoticeProps
  extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof notice> {
  /** Heading shown at the top of the notice. */
  headingText: string;
  /** Explanatory text below the heading. */
  bodyText: string;
}

/** A block-level message about the state of the page. */
export const Notice = forwardRef<HTMLDivElement, NoticeProps>(
  ({ className, variant, headingText, bodyText, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(notice({ variant }), className)}
      {...props}
    >
      <div className="flex flex-col gap-1">
        <p className="font-medium">{headingText}</p>
        <p className="text-sm">{bodyText}</p>
      </div>
    </div>
  ),
);

Notice.displayName = "Notice";
