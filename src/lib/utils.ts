import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Shared class-name composition for shadcn-compatible components. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
