import { createHmac, timingSafeEqual } from 'crypto';

const API = 'https://api.paystack.co';

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY?.trim());
}

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!key) throw new Error('PAYSTACK_SECRET_KEY is not set.');
  return key;
}

/** Paystack amounts are in the currency's smallest unit (kobo for NGN, cents for USD). */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

export function fromMinorUnits(minor: number): number {
  return minor / 100;
}

/**
 * Checks the x-paystack-signature header: an HMAC-SHA512 of the raw request body, keyed with the
 * secret key. Must be given the exact raw body text, not re-serialised JSON.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null, key = secretKey()): boolean {
  if (!signature || !/^[0-9a-f]{128}$/i.test(signature)) return false;
  const expected = createHmac('sha512', key).update(rawBody).digest('hex');
  return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
}

type PaystackEnvelope<T> = { status: boolean; message: string; data: T };

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });
  const body = (await res.json().catch(() => null)) as PaystackEnvelope<T> | null;
  if (!res.ok || !body?.status) {
    throw new Error(body?.message || `Paystack request failed (${res.status}).`);
  }
  return body.data;
}

export type InitializedTransaction = { authorization_url: string; access_code: string; reference: string };

export async function initializeTransaction(input: {
  email: string;
  amountMinor: number;
  currency: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  planCode?: string;
}): Promise<InitializedTransaction> {
  return call<InitializedTransaction>('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email: input.email,
      amount: input.amountMinor,
      currency: input.currency,
      ...(input.callbackUrl ? { callback_url: input.callbackUrl } : {}),
      ...(input.metadata ? { metadata: input.metadata } : {}),
      ...(input.planCode ? { plan: input.planCode } : {}),
    }),
  });
}

type Plan = { name: string; plan_code: string; amount: number; interval: string };

/** Finds the monthly plan for this exact amount, creating it the first time that amount is used. */
export async function getOrCreateMonthlyPlan(amountMinor: number, currency: string): Promise<string> {
  const name = `YTOP monthly ${currency} ${fromMinorUnits(amountMinor)}`;
  const existing = await call<Plan[]>(
    `/plan?interval=monthly&amount=${amountMinor}&currency=${encodeURIComponent(currency)}&perPage=50`
  );
  const found = existing.find((p) => p.name === name && p.amount === amountMinor && p.interval === 'monthly');
  if (found) return found.plan_code;
  const created = await call<Plan>('/plan', {
    method: 'POST',
    body: JSON.stringify({ name, amount: amountMinor, interval: 'monthly', currency }),
  });
  return created.plan_code;
}
