// @expect
import { forwardRef } from "react";

export interface FigureProps extends React.ComponentPropsWithoutRef<"figure"> {
  /** Short caption rendered below the image. */
  caption?: string;
  /** Image source. */
  src: string;
  /** Accessible description of the image. */
  alt: string;
}

/** An image with an optional caption. */
export const Figure = forwardRef<HTMLElement, FigureProps>(
  ({ caption, src, alt, className, ...props }, ref) => (
    <figure ref={ref} className={className} {...props}>
      <img src={src} alt={alt} />
      {caption ? (
        <figcaption className="text-sm text-fg-secondary">{caption}</figcaption>
      ) : null}
    </figure>
  ),
);
Figure.displayName = "Figure";
