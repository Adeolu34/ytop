/**
 * Simple in-memory rate limiter for API routes.
 * Limits requests per IP address within a sliding window.
 * Resets on server restart — adequate for basic abuse prevention.
 */

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

export function checkRateLimit(
  ip: string,
  opts: { limit: number; windowMs: number }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now >= entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + opts.windowMs });
    return { allowed: true, remaining: opts.limit - 1, resetAt: now + opts.windowMs };
  }

  entry.count += 1;
  const remaining = Math.max(0, opts.limit - entry.count);
  return { allowed: entry.count <= opts.limit, remaining, resetAt: entry.resetAt };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    // Take the last hop added by a trusted proxy, not the first (client-supplied)
    const parts = forwarded.split(',').map((s) => s.trim());
    return parts[parts.length - 1] ?? 'unknown';
  }
  return headers.get('x-real-ip') ?? 'unknown';
}
