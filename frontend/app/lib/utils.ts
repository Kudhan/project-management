import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges class names, resolves Tailwind conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
