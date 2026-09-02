// @expect
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const field = cva("flex flex-col gap-1.5", {
  variants: {
    variant: {
      default: "",
      inline: "flex-row items-center gap-3",
    },
    size: { sm: "text-sm", md: "text-base" },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export interface FormFieldProps
  extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof field> {
  /** Text of the field's visible label element. */
  label: string;
  /** Associates the label with the control it describes. */
  htmlFor: string;
  /** Message shown below the control when validation fails. */
  errorMessage?: string;
  /** Marks the control as mandatory. */
  required?: boolean;
}

/** Pairs a label and validation message with a form control. */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      className,
      variant,
      size,
      label,
      htmlFor,
      errorMessage,
      required = false,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={[field({ variant, size }), className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <label htmlFor={htmlFor} className="text-sm text-fg-secondary">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {errorMessage ? (
        <p role="alert" className="text-xs text-danger-default">
          ⚠ {errorMessage}
        </p>
      ) : null}
    </div>
  ),
);
FormField.displayName = "FormField";
