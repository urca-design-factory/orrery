import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names, resolving conflicts so that later classes win.
 * Every component must route its `className` prop through this (see P-07).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
