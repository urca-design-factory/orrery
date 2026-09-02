// @expect
import { forwardRef } from "react";

export interface DateRangeProps extends React.ComponentPropsWithoutRef<"div"> {
  /** ISO date string for the start of the range. */
  from: string;
  /** ISO date string for the end of the range. */
  to: string;
  /** BCP 47 locale used to format the dates. */
  locale?: string;
  /** Intl date style applied to both endpoints. */
  dateStyle?: "short" | "medium" | "long";
  /** Separator rendered between the two dates. */
  separator?: string;
}

/** Renders a formatted date range. */
export const DateRange = forwardRef<HTMLDivElement, DateRangeProps>(
  (
    {
      from,
      to,
      locale = "en-US",
      dateStyle = "medium",
      separator = "–",
      className,
      ...props
    },
    ref,
  ) => {
    const formatter = new Intl.DateTimeFormat(locale, { dateStyle });
    return (
      <div ref={ref} className={className} {...props}>
        <time dateTime={from}>{formatter.format(new Date(from))}</time>
        <span aria-hidden="true"> {separator} </span>
        <time dateTime={to}>{formatter.format(new Date(to))}</time>
      </div>
    );
  },
);
DateRange.displayName = "DateRange";
