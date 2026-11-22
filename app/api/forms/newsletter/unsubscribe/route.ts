import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getMongoDbOr503 } from '@/lib/api-mongo';
import { mongoNewsletterUnsubscribe } from '@/lib/mongo-forms-store';
import { verifyUnsubscribeToken } from '@/lib/unsubscribe';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

const schema = z.object({
  email: z.string().email().max(200),
  token: z.string().length(64),
});

/** POST /api/forms/newsletter/unsubscribe: removes a subscriber who holds a valid signed link. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rl = checkRateLimit(`unsub:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !verifyUnsubscribeToken(parsed.data.email, parsed.data.token)) {
    return NextResponse.json({ error: 'This unsubscribe link is not valid.' }, { status: 400 });
  }

  const gate = await getMongoDbOr503();
  if (!gate.ok) return gate.response;

  try {
    await mongoNewsletterUnsubscribe(parsed.data.email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unsubscribe failed:', error);
    return NextResponse.json({ error: 'We could not update your subscription. Please try again.' }, { status: 500 });
  }
}
