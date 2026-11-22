import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSiteBaseUrl } from '@/lib/email';
import {
  getOrCreateMonthlyPlan,
  initializeTransaction,
  isPaystackConfigured,
  toMinorUnits,
} from '@/lib/paystack';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

const MIN_AMOUNT = 100; // NGN
const MAX_AMOUNT = 50_000_000; // NGN

const schema = z.object({
  amount: z.number().finite().min(MIN_AMOUNT).max(MAX_AMOUNT),
  email: z.string().email().max(200),
  name: z.string().max(120).optional(),
  frequency: z.enum(['once', 'monthly']),
  /** Free-text programme label chosen on the form, or empty for "where it is needed most". */
  programme: z.string().max(120).optional(),
  /** Id of an active campaign to credit, when the gift is for one. */
  campaignId: z.string().max(80).optional(),
});

/**
 * POST /api/donate/initialize
 *
 * Starts a Paystack checkout (one-time, or a monthly subscription) and returns the hosted payment URL.
 * Returns 503 with { fallback: true } when Paystack is not configured so the form can use the plain
 * payment link instead.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rl = checkRateLimit(`donate:${ip}`, { limit: 6, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many attempts. Please wait a moment and try again.' }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: `Please enter an email address and an amount between ₦${MIN_AMOUNT.toLocaleString()} and ₦${MAX_AMOUNT.toLocaleString()}.` },
      { status: 400 }
    );
  }

  if (!isPaystackConfigured()) {
    return NextResponse.json(
      { error: 'Online checkout is not set up yet.', fallback: true },
      { status: 503 }
    );
  }

  const data = parsed.data;
  const currency = 'NGN';
  const amountMinor = toMinorUnits(data.amount);

  try {
    const planCode = data.frequency === 'monthly' ? await getOrCreateMonthlyPlan(amountMinor, currency) : undefined;
    const base = getSiteBaseUrl();
    const tx = await initializeTransaction({
      email: data.email,
      amountMinor,
      currency,
      callbackUrl: base ? `${base}/donate/thank-you` : undefined,
      planCode,
      metadata: {
        frequency: data.frequency,
        programme: data.programme || null,
        campaignId: data.campaignId || null,
        donorName: data.name || null,
      },
    });
    return NextResponse.json({ url: tx.authorization_url });
  } catch (error) {
    console.error('Donation initialisation failed:', error);
    return NextResponse.json(
      { error: 'We could not start your payment. Please try again, or contact us for another way to give.' },
      { status: 502 }
    );
  }
}
