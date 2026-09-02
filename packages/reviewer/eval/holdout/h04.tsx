// @expect
import { forwardRef, useId } from "react";

export interface RadioGroupProps extends React.ComponentPropsWithoutRef<"fieldset"> {
  /** Visible legend describing the choice being made. */
  legend: string;
  /** Name shared by every radio in the group. */
  name: string;
  /** Disables every option in the group. */
  disabled?: boolean;
}

/** A set of mutually exclusive options. */
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({ legend, name, disabled = false, className, children, ...props }, ref) => {
    const id = useId();
    return (
      <fieldset
        ref={ref}
        name={name}
        disabled={disabled}
        aria-describedby={id}
        className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}
        {...props}
      >
        <legend className="text-sm font-medium text-fg-primary">
          {legend}
        </legend>
        {children}
      </fieldset>
    );
  },
);
RadioGroup.displayName = "RadioGroup";
