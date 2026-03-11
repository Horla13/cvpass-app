import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let _ratelimit: Ratelimit | null = null;

export function getRateLimit(): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!_ratelimit) {
    _ratelimit = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      }),
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: false,
    });
  }
  return _ratelimit;
}

export async function checkRateLimit(identifier: string): Promise<{ allowed: boolean }> {
  const rl = getRateLimit();
  if (!rl) return { allowed: true }; // degrade gracefully if not configured
  const { success } = await rl.limit(identifier);
  return { allowed: success };
}
