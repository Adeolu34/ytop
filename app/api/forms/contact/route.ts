import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getMongoDbOr503 } from '@/lib/api-mongo';
import { mongoFormSubmissionInsert } from '@/lib/mongo-forms-store';
import { isEmailSendingConfigured, sendTransactionalEmail } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

const RATE_LIMIT = { limit: 5, windowMs: 60_000 }; // 5 submissions per minute per IP

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

/**
 * POST /api/forms/contact
 *
 * Submit a contact form
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

    const validationResult = contactFormSchema.safeParse(body);

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
      type: 'CONTACT',
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      data: {
        subject: data.subject,
        message: data.message,
      },
      ipAddress: ip,
      userAgent,
    });

    if (isEmailSendingConfigured()) {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER;
      const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL || adminEmail;

      const adminHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${data.name} &lt;${data.email}&gt;</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left:4px solid #ccc;padding:0 12px;color:#555">
          ${data.message.replace(/\n/g, '<br>')}
        </blockquote>
        <p style="color:#888;font-size:12px">Submission ID: ${submissionId}</p>
      `;

      const confirmHtml = `
        <p>Hi ${data.name},</p>
        <p>Thank you for reaching out to YTOP Global. We have received your message and will get back to you within 2–3 business days.</p>
        <p><strong>Your message:</strong></p>
        <blockquote style="border-left:4px solid #ccc;padding:0 12px;color:#555">
          ${data.message.replace(/\n/g, '<br>')}
        </blockquote>
        <p>Warm regards,<br>The YTOP Global Team</p>
      `;

      await Promise.allSettled([
        notifyEmail
          ? sendTransactionalEmail({ to: notifyEmail, subject: `[Contact] ${data.subject}`, html: adminHtml })
          : Promise.resolve(),
        sendTransactionalEmail({ to: data.email, subject: 'We received your message — YTOP Global', html: confirmHtml }),
      ]);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      submissionId,
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again later.' },
      { status: 500 }
    );
  }
}
