// @expect
import { forwardRef } from "react";

/** A vertical list of related rows. */
export const List = forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={["divide-y divide-border-default", className]
      .filter(Boolean)
      .join(" ")}
    {...props}
  />
));
List.displayName = "List";

export interface ListItemProps extends React.ComponentPropsWithoutRef<"li"> {
  /** Content aligned to the end of the row. */
  trailing?: React.ReactNode;
}

/** A single row within a List. */
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, trailing, children, ...props }, ref) => (
    <li
      ref={ref}
      className={["flex items-center justify-between py-3", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <div>{children}</div>
      {trailing}
    </li>
  ),
);
ListItem.displayName = "ListItem";
