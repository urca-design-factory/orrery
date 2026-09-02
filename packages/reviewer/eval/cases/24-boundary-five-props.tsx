// @expect
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const banner = cva("flex items-center gap-3 px-4 py-3", {
  variants: {
    variant: {
      info: "bg-accent-subtle text-accent-active",
      warning: "bg-warning-subtle text-fg-primary",
    },
    size: { sm: "text-sm", md: "text-base" },
    position: { inline: "rounded-md", top: "rounded-none" },
  },
  defaultVariants: { variant: "info", size: "md", position: "inline" },
});

export interface BannerProps
  extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof banner> {
  /** Element rendered before the message. */
  icon?: React.ReactNode;
}

/** A persistent message about system state. */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  ({ className, variant, size, position, icon, children, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={[banner({ variant, size, position }), className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon}
      {children}
    </div>
  ),
);
Banner.displayName = "Banner";
