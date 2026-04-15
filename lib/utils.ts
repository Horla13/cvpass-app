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

/** Validate that a URL is safe to fetch server-side (blocks SSRF attacks). */
export function isSafeUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    const host = url.hostname.toLowerCase();
    // Block localhost, private IPs, and internal domains
    if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") return false;
    if (host.startsWith("10.") || host.startsWith("192.168.") || host.startsWith("172.")) return false;
    if (host.endsWith(".local") || host.endsWith(".internal")) return false;
    if (host === "[::1]") return false;
    // Block metadata endpoints (AWS, GCP)
    if (host === "169.254.169.254" || host === "metadata.google.internal") return false;
    return true;
  } catch {
    return false;
  }
}
