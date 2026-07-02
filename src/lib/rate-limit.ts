/**
 * Simple in-memory rate limiter for API routes.
 *
 * Usage:
 *   const limiter = rateLimit({ interval: 60_000, limit: 10 });
 *
 *   export async function POST(request: NextRequest) {
 *     const ip = request.headers.get("x-forwarded-for") ?? "unknown";
 *     const { success } = limiter.check(ip);
 *     if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 *     ...
 *   }
 *
 * Note: This is per-instance. In serverless (Vercel), each cold start resets.
 * For production, use Redis-based rate limiting (e.g. @upstash/ratelimit).
 */

interface RateLimitOptions {
  /** Time window in milliseconds */
  interval: number;
  /** Max requests per interval per key */
  limit: number;
}

interface TokenBucket {
  count: number;
  lastReset: number;
}

export function rateLimit({ interval, limit }: RateLimitOptions) {
  const buckets = new Map<string, TokenBucket>();

  // Periodically clean up old entries to prevent memory leaks
  const cleanup = () => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (now - bucket.lastReset > interval * 2) {
        buckets.delete(key);
      }
    }
  };

  // Clean up every 5 minutes
  if (typeof setInterval !== "undefined") {
    setInterval(cleanup, 5 * 60 * 1000);
  }

  return {
    check(key: string): { success: boolean; remaining: number; reset: number } {
      const now = Date.now();
      const bucket = buckets.get(key);

      if (!bucket || now - bucket.lastReset >= interval) {
        // New window
        buckets.set(key, { count: 1, lastReset: now });
        return { success: true, remaining: limit - 1, reset: now + interval };
      }

      if (bucket.count >= limit) {
        return { success: false, remaining: 0, reset: bucket.lastReset + interval };
      }

      bucket.count++;
      return { success: true, remaining: limit - bucket.count, reset: bucket.lastReset + interval };
    },
  };
}
