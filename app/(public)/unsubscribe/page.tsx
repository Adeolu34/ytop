import Link from 'next/link';
import UnsubscribeForm from './UnsubscribeForm';
import { verifyUnsubscribeToken } from '@/lib/unsubscribe';

export const metadata = {
  title: 'Unsubscribe | YTOP Global',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const email = typeof params.email === 'string' ? params.email : '';
  const token = typeof params.token === 'string' ? params.token : '';
  const valid = email.length > 0 && token.length > 0 && verifyUnsubscribeToken(email, token);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="mb-6 font-display text-3xl font-bold text-slate-900">Unsubscribe from YTOP Global updates</h1>
      {valid ? (
        <UnsubscribeForm email={email} token={token} />
      ) : (
        <div className="space-y-4 text-lg text-slate-600">
          <p>This unsubscribe link is not valid or has expired.</p>
          <p>
            To stop receiving updates, email <a href="mailto:info@ytopglobal.org" className="font-semibold text-primary hover:underline">info@ytopglobal.org</a> and we will remove you.
          </p>
          <Link href="/" className="inline-block font-semibold text-primary hover:underline">Back to the homepage</Link>
        </div>
      )}
    </div>
  );
}
