import Link from 'next/link';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/public/PageHeader';

export const metadata = {
  title: 'Thank You for Supporting YTOP Global',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

type VerifyResult = 'success' | 'failed' | 'unverified';

/**
 * Confirms the payment with Paystack before showing the thank-you message (master copy 6.7:
 * "only display after the payment provider confirms successful payment").
 * Requires PAYSTACK_SECRET_KEY, and the payment page's callback URL set to /donate/thank-you in the
 * Paystack dashboard. Without either, the page never claims a payment succeeded.
 */
async function verifyPayment(reference: string | null): Promise<VerifyResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!reference || !/^[A-Za-z0-9._=-]{6,100}$/.test(reference) || !secret) return 'unverified';
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: 'no-store',
    });
    if (!res.ok) return 'failed';
    const body = (await res.json()) as { status?: boolean; data?: { status?: string } };
    return body.status && body.data?.status === 'success' ? 'success' : 'failed';
  } catch {
    return 'unverified';
  }
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params.reference ?? params.trxref;
  const reference = Array.isArray(raw) ? raw[0] : raw ?? null;
  const result = await verifyPayment(reference);

  if (result === 'success') {
    return (
      <>
      <PageHeader title="Thank You for Supporting YTOP Global." />
      <div className="max-w-2xl mx-auto px-4 py-14 text-center">
        <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-6" aria-hidden />
        <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
          <p className="font-semibold">Your contribution has been received.</p>
          <p>Thank you for supporting our work to expand opportunities for young people and strengthen communities.</p>
          <p>Your generosity contributes to programmes that promote leadership, education, mentorship, and meaningful community participation.</p>
          <p>We value your support and remain committed to responsible resource management and transparent reporting.</p>
          <p>You will receive your transaction confirmation and donation receipt through the email address provided.</p>
        </div>
        <Link href="/impact" className="mt-8 inline-flex px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition">
          Explore Our Impact
        </Link>
      </div>
      </>
    );
  }

  return (
    <>
    <PageHeader title={result === 'failed' ? 'We could not confirm your payment.' : 'We are confirming your payment.'} />
    <div className="max-w-2xl mx-auto px-4 py-14 text-center">
      <AlertCircle className="w-14 h-14 text-amber-600 mx-auto mb-6" aria-hidden />
      <p className="text-lg text-slate-600 dark:text-slate-300">
        {result === 'failed'
          ? 'We could not confirm your payment. Please check your payment method or try again. Contact our support team if the issue continues.'
          : 'We could not yet confirm your payment. Please do not submit the transaction again while processing continues. If you were charged, contact our support team and quote your payment reference.'}
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/donate" className="inline-flex justify-center px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition">Try again</Link>
        <Link href="/contact?subject=Donation%20support" className="inline-flex justify-center px-8 py-3 border-2 border-secondary text-secondary font-bold rounded-full hover:bg-secondary hover:text-white transition">Contact our support team</Link>
      </div>
    </div>
    </>
  );
}
