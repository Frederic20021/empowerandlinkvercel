import 'server-only';
import { NextResponse } from 'next/server';

interface RateLimitConfig {
  interval: number;
  maxRequests: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  interval: 60_000,
  maxRequests: 10,
};

// In-memory fixed window per key. This site has no database, so the counter lives in the server
// instance: on serverless it is best effort (each warm instance counts separately).
const hits = new Map<string, { count: number; resetAt: number }>();
const MAX_KEYS = 5_000;

export async function rateLimit(
  key: string,
  config: Partial<RateLimitConfig> = {},
  now: number = Date.now(),
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const { interval, maxRequests } = { ...DEFAULT_CONFIG, ...config };

  if (hits.size > MAX_KEYS) {
    for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
    if (hits.size > MAX_KEYS) hits.clear();
  }

  let entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + interval };
    hits.set(key, entry);
  }
  entry.count += 1;

  return {
    allowed: entry.count <= maxRequests,
    remaining: Math.max(0, maxRequests - entry.count),
    resetIn: entry.resetAt - now,
  };
}

export function resetRateLimits(): void {
  hits.clear();
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
  return ip;
}

export function rateLimitResponse(resetIn: number): NextResponse {
  return NextResponse.json(
    { error: '試行回数が多すぎます。しばらくしてからもう一度お試しください。' },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil(resetIn / 1000)),
      },
    },
  );
}
