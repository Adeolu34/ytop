import { NextRequest, NextResponse } from 'next/server';
import { isEmailSendingConfigured, sendTransactionalEmail } from '@/lib/email';
import { mongoCampaignAddRaised } from '@/lib/mongo-campaigns-store';
import { mongoDonationRecord } from '@/lib/mongo-donations-store';
import { fromMinorUnits, isPaystackConfigured, verifyWebhookSignature } from '@/lib/paystack';

export const dynamic = 'force-dynamic';

type ChargeEvent = {
  event?: string;
  data?: {
    reference?: string;
    amount?: number;
    currency?: string;
    paid_at?: string;
    status?: string;
    customer?: { email?: string; first_name?: string | null; last_name?: string | null };
    metadata?: {
      frequency?: string;
      programme?: string | null;
      campaignId?: string | null;
      donorName?: string | null;
    } | null;
  };
};

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * POST /api/paystack/webhook
 *
 * Paystack calls this when a payment succeeds. Set the webhook URL to
 * https://<your-site>/api/paystack/webhook in the Paystack dashboard.
 * Every request is verified against the HMAC signature before anything is recorded.
 */
export async function POST(request: NextRequest) {
  if (!isPaystackConfigured()) {
    return NextResponse.json({ error: 'Not configured.' }, { status: 503 });
  }

  const raw = await request.text();
  if (!verifyWebhookSignature(raw, request.headers.get('x-paystack-signature'))) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
  }

  let payload: ChargeEvent;
  try {
    payload = JSON.parse(raw) as ChargeEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }

  // Other event types are acknowledged and ignored.
  if (payload.event !== 'charge.success' || !payload.data) {
    return NextResponse.json({ received: true });
  }

  const d = payload.data;
  if (d.status !== 'success' || !d.reference || typeof d.amount !== 'number' || !d.currency) {
    return NextResponse.json({ received: true });
  }

  const amount = fromMinorUnits(d.amount);
  const email = d.customer?.email?.trim().toLowerCase() || null;
  const meta = d.metadata ?? {};
  const name =
    meta.donorName || [d.customer?.first_name, d.customer?.last_name].filter(Boolean).join(' ') || null;

  try {
    const result = await mongoDonationRecord({
      reference: d.reference,
      email,
      name,
      amount,
      currency: d.currency,
      frequency: meta.frequency === 'monthly' ? 'monthly' : 'once',
      programme: meta.programme || null,
      campaignId: meta.campaignId || null,
      paidAt: d.paid_at ? new Date(d.paid_at) : new Date(),
    });

    // Only the first delivery of an event changes totals or sends email; Paystack retries are no-ops.
    if (result === 'created') {
      if (meta.campaignId) {
        await mongoCampaignAddRaised(meta.campaignId, amount, d.currency);
      }
      if (email && isEmailSendingConfigured()) {
        const money = `${d.currency} ${amount.toLocaleString()}`;
        const html = `
          <p>Hi ${escapeHtml(name || 'there')},</p>
          <p>Thank you for supporting YTOP Global. We have received your ${meta.frequency === 'monthly' ? 'monthly ' : ''}donation of <strong>${escapeHtml(money)}</strong>${meta.programme ? ` towards ${escapeHtml(meta.programme)}` : ''}.</p>
          <p>Your generosity contributes to programmes that promote leadership, education, mentorship, and meaningful community participation. We remain committed to responsible resource management and transparent reporting.</p>
          <p>Transaction reference: ${escapeHtml(d.reference)}</p>
          <p>Warm regards,<br>The YTOP Global Team</p>`;
        await sendTransactionalEmail({ to: email, subject: 'Thank you for supporting YTOP Global', html }).catch((e) =>
          console.error('Donation receipt email failed:', e)
        );
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    // A 500 makes Paystack retry later, so a temporary database outage does not lose a gift.
    console.error('Paystack webhook processing failed:', error);
    return NextResponse.json({ error: 'Processing failed.' }, { status: 500 });
  }
}
