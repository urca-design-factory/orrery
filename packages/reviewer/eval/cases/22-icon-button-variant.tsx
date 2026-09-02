// @expect C-03
/**
 * A square button containing only an icon.
 *
 * The design system already exports Button, which accepts children and a
 * `size` prop.
 */
export interface IconButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  /** Accessible name for the action. */
  "aria-label": string;
  /** The icon element. */
  icon: React.ReactNode;
}

export function IconButton({ icon, className, ...props }: IconButtonProps) {
  return (
    <button
      className={[
        "inline-flex size-10 items-center justify-center rounded-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon}
    </button>
  );
}
