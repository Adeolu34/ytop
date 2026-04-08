import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@/app/generated/prisma';
import { z } from 'zod';
import { getPrismaOr503 } from '@/lib/api-prisma';
import { normalizeSubscriberEmail } from '@/lib/newsletter';

export const dynamic = 'force-dynamic';

// Validation schema
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
    const pg = await getPrismaOr503();
    if (!pg.ok) {
      return pg.response;
    }
    const prisma = pg.prisma;

    const body = await request.json();

    // Validate input
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

    // Get IP and User Agent
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    let submission;

    try {
      submission = await prisma.formSubmission.create({
        data: {
          type: 'NEWSLETTER',
          name: data.name || null,
          email: normalizedEmail,
          data: {
            subscribedAt: new Date().toISOString(),
          },
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter.' },
          { status: 400 }
        );
      }

      throw error;
    }

    // TODO: Add to MailChimp
    // await addToMailChimp(data.email, data.name);

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! Please check your email to confirm your subscription.',
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
