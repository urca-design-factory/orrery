// @expect C-03
import { cva } from "class-variance-authority";

const dangerButton = cva(
  "inline-flex h-10 items-center justify-center rounded-md bg-danger-default px-4 font-medium text-fg-on-accent hover:bg-danger-hover",
);

export interface DangerButtonProps extends React.ComponentPropsWithoutRef<"button"> {}

/**
 * A button for destructive actions.
 *
 * Note: the design system already exports Button with a `danger` variant.
 */
export function DangerButton({ className, ...props }: DangerButtonProps) {
  return (
    <button
      className={[dangerButton(), className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
