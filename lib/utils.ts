import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GITHUB_TOKEN =
  "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";
