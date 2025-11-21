import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn() = clsx() + tailwind-merge
 * 
 * - clsx: handles conditional classes
 * - tailwind-merge: resolves conflicting Tailwind classes
 *
 * Example:
 *   cn("px-2 py-1", condition && "bg-red-500", "px-4")
 * Result:
 *   "py-1 bg-red-500 px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
