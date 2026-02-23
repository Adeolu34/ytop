import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';

// Validation schema
const partnershipSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required').max(200),
  contactName: z.string().min(2, 'Contact name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  website: z.string().url('Invalid website URL').optional(),
  organizationType: z.enum(['ngo', 'corporate', 'educational', 'government', 'other']),
  partnershipType: z.enum(['funding', 'collaboration', 'sponsorship', 'volunteer', 'other']),
  message: z.string().min(50, 'Please provide more details about the partnership (at least 50 characters)'),
});

/**
 * POST /api/forms/partnership
 *
 * Submit a partnership inquiry
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = partnershipSchema.safeParse(body);

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
        type: 'PARTNERSHIP',
        name: data.contactName,
        email: data.email,
        phone: data.phone,
        data: {
          organizationName: data.organizationName,
          website: data.website,
          organizationType: data.organizationType,
          partnershipType: data.partnershipType,
          message: data.message,
        },
        ipAddress,
        userAgent,
      },
    });

    // TODO: Send email notification to admin
    // await sendPartnershipInquiryEmail(data);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest in partnering with us! We will review your inquiry and contact you soon.',
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('Error submitting partnership form:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again later.' },
      { status: 500 }
    );
  }
}
