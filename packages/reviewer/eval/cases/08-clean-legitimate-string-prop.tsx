// @expect
import { forwardRef } from "react";

export interface SearchFieldProps extends React.ComponentPropsWithoutRef<"input"> {
  /** Text shown when the field is empty. */
  placeholder?: string;
  /** Accessible name for the field, used when no visible label is present. */
  "aria-label"?: string;
}

/** A text field for filtering a list. */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="search"
      className={[
        "h-10 w-full rounded-md border border-border-default px-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  ),
);
SearchField.displayName = "SearchField";
