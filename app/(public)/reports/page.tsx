import Link from 'next/link';
import { FileText } from 'lucide-react';
import { getPublicDocuments } from '@/lib/public-documents';
import PageHeader from '@/components/public/PageHeader';

/** CDN ISR: documents published in the admin appear within a minute. */
export const revalidate = 60;

export const metadata = {
  title: 'Reports and Publications | YTOP Global',
  description:
    'Annual reports, programme reports, research publications, policy briefs and learning resources from YTOP Global.',
};

// Copy: Master Website Content document, 8.3 and 4.3. Documents are published in the admin (Documents).
const RESOURCE_TYPES = [
  'Annual reports.',
  'Programme reports.',
  'Research publications.',
  'Policy briefs.',
  'Learning resources.',
  'Organisational publications.',
];

export default async function ReportsPage() {
  const reports = (await getPublicDocuments()).filter((d) => d.category === 'REPORT');

  return (
    <>
      <PageHeader title="Reports and Resources" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
        Access selected publications that document our work, share programme findings and provide information about our development priorities.
      </p>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">Available resources may include:</p>
      <ul className="grid gap-3 md:grid-cols-2 mb-12">
        {RESOURCE_TYPES.map((r) => (
          <li key={r} className="rounded-xl border-l-4 border-primary bg-slate-50 dark:bg-slate-800 p-4 text-slate-700 dark:text-slate-200">{r}</li>
        ))}
      </ul>

      <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">Published documents</h2>
      {reports.length > 0 ? (
        <ul className="space-y-4">
          {reports.map((r) => (
            <li key={r.id} className="flex gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark p-5">
              <FileText className="w-6 h-6 flex-shrink-0 text-primary mt-1" aria-hidden />
              <div>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-900 dark:text-white hover:text-primary hover:underline">
                  {r.title}
                </a>
                {r.period ? <p className="text-sm text-slate-500">{r.period}</p> : null}
                {r.description ? <p className="mt-1 text-slate-600 dark:text-slate-400">{r.description}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-600 dark:text-slate-400">
          No reports have been published here yet. They will appear as they are approved. In the meantime, see our{' '}
          <Link href="/events#previous-events" className="text-primary font-semibold hover:underline">event archive</Link>{' '}
          and <Link href="/impact" className="text-primary font-semibold hover:underline">impact framework</Link>.
        </p>
      )}
      </div>
    </>
  );
}
