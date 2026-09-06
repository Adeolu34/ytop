import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getMongoDbOr503 } from '@/lib/api-mongo';
import { mongoNewsletterUpsert } from '@/lib/mongo-forms-store';
import { normalizeSubscriberEmail } from '@/lib/newsletter';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

const RATE_LIMIT = { limit: 3, windowMs: 60_000 }; // 3 signups per minute per IP

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
});

/**
 * POST /api/forms/newsletter
 *
 * Subscribe to newsletter
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rl = checkRateLimit(ip, RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before submitting again.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const gate = await getMongoDbOr503();
    if (!gate.ok) {
      return gate.response;
    }

    const body = await request.json();

    const validationResult = newsletterSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const normalizedEmail = normalizeSubscriberEmail(data.email);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const { status, id: submissionId } = await mongoNewsletterUpsert({
      email: normalizedEmail,
      name: data.name,
      ipAddress: ip,
      userAgent,
    });

    if (status === 'exists') {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        'Thank you for subscribing! Please check your email to confirm your subscription.',
      submissionId,
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
