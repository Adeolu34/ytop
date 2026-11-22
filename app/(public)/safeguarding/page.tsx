import Link from 'next/link';
import { getPublicDocuments, governanceUrl } from '@/lib/public-documents';
import PageHeader from '@/components/public/PageHeader';

/** CDN ISR: the policy link appears within a minute of publishing it in the admin. */
export const revalidate = 60;

export const metadata = {
  title: 'Safeguarding | YTOP Global',
  description: 'How YTOP Global approaches the safeguarding of young people, beneficiaries, volunteers and staff.',
};

// The master copy references safeguarding arrangements (7.3) and lists a Safeguarding Policy among the
// public governance documents (10.3), but supplies no policy text. This page states only that, and
// points to the policy once it is approved. Add the approved policy link in app/(public)/governance.
export default async function SafeguardingPage() {
  const policyUrl = governanceUrl(await getPublicDocuments(), 'Safeguarding Policy');
  return (
    <>
      <PageHeader title="Safeguarding" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
        <p>Our mentorship engagement follows clear expectations, appropriate safeguarding arrangements and defined participation guidelines.</p>
        {policyUrl ? (
          <p>
            Read our <a href={policyUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">Safeguarding Policy</a>, and our other{' '}
            <Link href="/governance" className="text-primary font-semibold hover:underline">governance documents</Link>.
          </p>
        ) : (
          <p>YTOP Global&apos;s Safeguarding Policy is listed among our public governance documents and will be published on our <Link href="/governance" className="text-primary font-semibold hover:underline">Governance page</Link> once the approved, current version is ready.</p>
        )}
        <p>If you have a safeguarding concern, please contact us immediately at <a href="mailto:info@ytopglobal.org" className="text-primary font-semibold hover:underline">info@ytopglobal.org</a>.</p>
      </div>
      </div>
    </>
  );
}
