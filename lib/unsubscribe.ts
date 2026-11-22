import { createHmac, timingSafeEqual } from 'crypto';
import { getSiteBaseUrl } from '@/lib/email';

function secret(): string | null {
  return process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim() || null;
}

/** Signs an email address so an unsubscribe link cannot be forged for someone else. */
export function unsubscribeToken(email: string): string | null {
  const key = secret();
  if (!key) return null;
  return createHmac('sha256', key).update(email.trim().toLowerCase()).digest('hex');
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = unsubscribeToken(email);
  if (!expected || !/^[0-9a-f]{64}$/i.test(token)) return false;
  return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(token, 'hex'));
}

/** Absolute unsubscribe URL for a subscriber, or null when the site URL or signing secret is not configured. */
export function unsubscribeUrl(email: string): string | null {
  const base = getSiteBaseUrl();
  const token = unsubscribeToken(email);
  if (!base || !token) return null;
  return `${base}/unsubscribe?email=${encodeURIComponent(email.trim().toLowerCase())}&token=${token}`;
}
