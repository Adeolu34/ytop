import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getMongoDbOr503 } from '@/lib/api-mongo';
import {
  mongoFormSubmissionInsert,
  mongoNewsletterEmailExists,
} from '@/lib/mongo-forms-store';
import { normalizeSubscriberEmail } from '@/lib/newsletter';

export const dynamic = 'force-dynamic';

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

    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (await mongoNewsletterEmailExists(normalizedEmail)) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter.' },
        { status: 400 }
      );
    }

    const submissionId = await mongoFormSubmissionInsert({
      type: 'NEWSLETTER',
      name: data.name || null,
      email: normalizedEmail,
      data: {
        subscribedAt: new Date().toISOString(),
      },
      ipAddress,
      userAgent,
    });

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
