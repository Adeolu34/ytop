import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getMongoDbOr503 } from '@/lib/api-mongo';
import { mongoFormSubmissionInsert } from '@/lib/mongo-forms-store';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

const RATE_LIMIT = { limit: 3, windowMs: 60_000 };

const volunteerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  age: z.number().min(13, 'You must be at least 13 years old').max(100).optional(),
  location: z.string().min(2, 'Location is required').max(200),
  interests: z.array(z.string()).min(1, 'Please select at least one area of interest'),
  availability: z.string().min(5, 'Please describe your availability'),
  experience: z.string().optional(),
  why: z.string().min(20, 'Please tell us why you want to volunteer (at least 20 characters)'),
});

/**
 * POST /api/forms/volunteer
 *
 * Submit a volunteer application
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

    const validationResult = volunteerFormSchema.safeParse(body);

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
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const submissionId = await mongoFormSubmissionInsert({
      type: 'VOLUNTEER',
      name: data.name,
      email: data.email,
      phone: data.phone,
      data: {
        age: data.age,
        location: data.location,
        interests: data.interests,
        availability: data.availability,
        experience: data.experience,
        why: data.why,
      },
      ipAddress: ip,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message:
        'Thank you for your interest in volunteering! We will review your application and contact you soon.',
      submissionId,
    });
  } catch (error) {
    console.error('Error submitting volunteer form:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again later.' },
      { status: 500 }
    );
  }
}
