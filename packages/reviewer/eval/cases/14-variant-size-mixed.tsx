// @expect N-06
import { cva } from "class-variance-authority";

const avatar = cva("inline-block overflow-hidden rounded-full bg-bg-raised", {
  variants: {
    variant: {
      circle: "rounded-full",
      square: "rounded-md",
      large: "size-12",
      compact: "size-6",
    },
  },
  defaultVariants: { variant: "circle" },
});

export interface AvatarProps {
  /** Shape and scale of the avatar. */
  variant?: "circle" | "square" | "large" | "compact";
  /** Image source for the avatar. */
  src: string;
  /** Accessible description of the person. */
  alt: string;
}

/** A person's profile image. */
export function Avatar({ variant, src, alt }: AvatarProps) {
  return <img className={avatar({ variant })} src={src} alt={alt} />;
}
