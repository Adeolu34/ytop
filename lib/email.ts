/**
 * Transactional email for admin newsletter broadcasts.
 * Priority: Microsoft 365 / SMTP → Resend → SendGrid.
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

const BATCH_SIZE = 50;
/** Parallel SMTP sends per wave (Microsoft 365 throttles heavy bursts). */
const DEFAULT_SMTP_CONCURRENCY = 8;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export function getSiteBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
  let u = raw.trim();
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) {
    u = `https://${u}`;
  }
  return u.replace(/\/$/, '');
}

function getSmtpFromAddress(): string | null {
  const from = process.env.SMTP_FROM?.trim();
  const user = process.env.SMTP_USER?.trim();
  return from || user || null;
}

function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASSWORD &&
      getSmtpFromAddress()
  );
}

let smtpTransporter: Transporter | null = null;

function getSmtpTransporter(): Transporter | null {
  if (!isSmtpConfigured()) {
    return null;
  }
  if (smtpTransporter) {
    return smtpTransporter;
  }

  const host = process.env.SMTP_HOST!.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER!.trim();
  const pass = process.env.SMTP_PASSWORD!;

  smtpTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls:
      process.env.SMTP_TLS_REJECT_UNAUTHORIZED === 'false'
        ? { rejectUnauthorized: false }
        : undefined,
  });

  return smtpTransporter;
}

async function sendViaSmtp(
  recipients: string[],
  subject: string,
  html: string
): Promise<void> {
  const transporter = getSmtpTransporter();
  const from = getSmtpFromAddress();
  if (!transporter || !from) {
    throw new Error('SMTP is not fully configured.');
  }

  const concurrency = Math.max(
    1,
    Number.parseInt(process.env.SMTP_SEND_CONCURRENCY || '', 10) ||
      DEFAULT_SMTP_CONCURRENCY
  );

  for (let i = 0; i < recipients.length; i += concurrency) {
    const wave = recipients.slice(i, i + concurrency);
    await Promise.all(
      wave.map((to) =>
        transporter.sendMail({
          from,
          to,
          subject,
          html,
        })
      )
    );
  }
}

export function isEmailSendingConfigured(): boolean {
  return Boolean(
    isSmtpConfigured() ||
      (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) ||
      (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL)
  );
}

export async function sendBulkNewsletterEmail(params: {
  recipients: string[];
  subject: string;
  html: string;
}): Promise<void> {
  const { recipients, subject, html } = params;
  if (recipients.length === 0) {
    return;
  }

  if (isSmtpConfigured()) {
    await sendViaSmtp(recipients, subject, html);
    return;
  }

  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM_EMAIL;
  if (resendKey && resendFrom) {
    for (const group of chunk(recipients, BATCH_SIZE)) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: resendFrom,
          to: group,
          subject,
          html,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Resend error (${res.status}): ${text}`);
      }
    }
    return;
  }

  const sgKey = process.env.SENDGRID_API_KEY;
  const sgFrom = process.env.SENDGRID_FROM_EMAIL;
  if (sgKey && sgFrom) {
    for (const group of chunk(recipients, BATCH_SIZE)) {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sgKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: group.map((email) => ({ email })) }],
          from: { email: sgFrom },
          subject,
          content: [{ type: 'text/html', value: html }],
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`SendGrid error (${res.status}): ${text}`);
      }
    }
    return;
  }

  throw new Error(
    'Email is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD (and optionally SMTP_FROM) for Microsoft 365 / SMTP, or use Resend or SendGrid — see .env.example.'
  );
}
