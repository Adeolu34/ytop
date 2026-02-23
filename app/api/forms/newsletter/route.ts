import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';

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

    // Get IP and User Agent
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Check if email already exists
    const existingSubmission = await prisma.formSubmission.findFirst({
      where: {
        type: 'NEWSLETTER',
        email: data.email,
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter.' },
        { status: 400 }
      );
    }

    // Save to database
    const submission = await prisma.formSubmission.create({
      data: {
        type: 'NEWSLETTER',
        name: data.name || null,
        email: data.email,
        data: {
          subscribedAt: new Date().toISOString(),
        },
        ipAddress,
        userAgent,
      },
    });

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
