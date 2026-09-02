// @expect C-03
/**
 * A text field with a leading search icon.
 *
 * The design system already exports Input, which extends native input props
 * and accepts a `type` of "search".
 */
export interface SearchInputProps extends React.ComponentPropsWithoutRef<"input"> {
  /** Icon rendered before the field. */
  icon?: React.ReactNode;
}

export function SearchInput({ icon, className, ...props }: SearchInputProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border-default px-3">
      {icon}
      <input
        type="search"
        className={["h-10 flex-1 bg-transparent outline-none", className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    </div>
  );
}
