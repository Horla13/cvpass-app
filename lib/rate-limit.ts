import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const _limiters = new Map<string, Ratelimit>();

function getLimiter(requests: number, window: Duration): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn("[CVPass] Rate limiting DISABLED — UPSTASH_REDIS_REST_URL or TOKEN missing");
    return null;
  }
  const key = `${requests}:${window}`;
  if (!_limiters.has(key)) {
    _limiters.set(
      key,
      new Ratelimit({
        redis: new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(requests, window),
        analytics: false,
      })
    );
  }
  return _limiters.get(key)!;
}

// Default: 10 req/h — used by /api/analyze (all users, including beta & premium)
export async function checkRateLimit(identifier: string): Promise<{ allowed: boolean }> {
  return checkRateLimitWith(identifier, 10, "1 h");
}

// Configurable rate limit for any route
export async function checkRateLimitWith(
  identifier: string,
  requests: number,
  window: Duration
): Promise<{ allowed: boolean }> {
  const rl = getLimiter(requests, window);
  if (!rl) return { allowed: true }; // degrade gracefully if not configured
  const { success } = await rl.limit(identifier);
  return { allowed: success };
}
