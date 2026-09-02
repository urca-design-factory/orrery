// @expect
import { forwardRef } from "react";

/** A grouped content container. */
export const Card = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border border-border-default bg-bg-surface ${className ?? ""}`}
    {...props}
  />
));
Card.displayName = "Card";

/** The heading area of a Card. */
export const CardHeader = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`border-b border-border-default p-4 ${className ?? ""}`}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/** The main content area of a Card. */
export const CardBody = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-4 ${className ?? ""}`} {...props} />
));
CardBody.displayName = "CardBody";
