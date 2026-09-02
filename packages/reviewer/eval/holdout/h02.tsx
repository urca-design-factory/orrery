// @expect
import { forwardRef } from "react";

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  /** Accessible name for the navigation landmark. */
  "aria-label"?: string;
  /** Character rendered between items. */
  separator?: string;
}

/** Shows the path to the current page. */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ separator = "/", className, children, ...props }, ref) => (
    <nav ref={ref} aria-label="Breadcrumb" className={className} {...props}>
      <ol className="flex items-center gap-2 text-sm text-fg-secondary">
        {children}
      </ol>
      <span hidden>{separator}</span>
    </nav>
  ),
);
Breadcrumb.displayName = "Breadcrumb";
