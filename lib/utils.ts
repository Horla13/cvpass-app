import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Verify a URL points to Stripe's checkout domain before redirecting. */
export function isStripeUrl(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith(".stripe.com");
  } catch {
    return false;
  }
}
