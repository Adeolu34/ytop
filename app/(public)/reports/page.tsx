import Link from 'next/link';

export const metadata = {
  title: 'Reports and Publications | YTOP Global',
  description:
    'Annual reports, programme reports, research publications, policy briefs and learning resources from YTOP Global.',
};

// Copy: Master Website Content document, 8.3 and 4.3. Entries must only be added for real,
// approved documents: add { title, period, href } objects to REPORTS when files are published.
const REPORTS: { title: string; period: string; href: string }[] = [];

const RESOURCE_TYPES = [
  'Annual reports.',
  'Programme reports.',
  'Research publications.',
  'Policy briefs.',
  'Learning resources.',
  'Organisational publications.',
];

export default function ReportsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-6">Reports and Resources</h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
        Access selected publications that document our work, share programme findings and provide information about our development priorities. Available resources may include:
      </p>
      <ul className="grid gap-3 md:grid-cols-2 mb-12">
        {RESOURCE_TYPES.map((r) => (
          <li key={r} className="rounded-xl border-l-4 border-primary bg-slate-50 dark:bg-slate-800 p-4 text-slate-700 dark:text-slate-200">{r}</li>
        ))}
      </ul>

      <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">Published documents</h2>
      {REPORTS.length > 0 ? (
        <ul className="space-y-3">
          {REPORTS.map((r) => (
            <li key={r.href}>
              <a href={r.href} className="font-semibold text-primary hover:underline">{r.title}</a>
              <span className="text-slate-500"> ({r.period})</span>
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
  );
}
