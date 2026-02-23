import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';

// Validation schema
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
  try {
    const body = await request.json();

    // Validate input
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

    // Get IP and User Agent
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Save to database
    const submission = await prisma.formSubmission.create({
      data: {
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
        ipAddress,
        userAgent,
      },
    });

    // TODO: Send email notification to admin
    // await sendVolunteerApplicationEmail(data);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest in volunteering! We will review your application and contact you soon.',
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('Error submitting volunteer form:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again later.' },
      { status: 500 }
    );
  }
}
