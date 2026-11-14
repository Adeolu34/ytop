import Link from 'next/link';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Governance and Accountability | YTOP Global',
  description:
    'How YTOP Global approaches responsible leadership, transparent governance and accountability to beneficiaries, donors and partners.',
};

// Copy: Master Website Content document, 10.3. Document links must only be added for approved,
// current public versions. Until then the documents are listed without links.
const DOCUMENTS = [
  'Organisational Constitution',
  'Governance Framework',
  'Code of Conduct',
  'Safeguarding Policy',
  'Conflict of Interest Policy',
  'Financial Accountability Policy',
  'Privacy and Data Protection Policy',
];

export default function GovernancePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-6">
        Responsible Leadership. Transparent Governance.
      </h1>
      <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>Strong governance supports organisational accountability, responsible decision-making and public confidence.</p>
        <p>YTOP Global recognises the importance of clear leadership responsibilities, institutional oversight and ethical conduct.</p>
        <p>Our governance arrangements provide the framework through which the organisation establishes priorities, supervises its activities and maintains accountability to relevant stakeholders.</p>
        <p>We are committed to strengthening governance practices in line with our constitution, applicable regulations and organisational policies.</p>
      </div>
      <p className="mt-8 text-slate-700 dark:text-slate-200">
        Registration: Corporate Affairs Commission, Nigeria, <strong>RC179444</strong>.
      </p>

      <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-4">Public documents</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Approved, current versions will be published here as they are finalised.
      </p>
      <ul className="grid gap-3 md:grid-cols-2">
        {DOCUMENTS.map((d) => (
          <li key={d} className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark p-4 text-slate-700 dark:text-slate-200">
            <FileText className="w-5 h-5 text-primary flex-shrink-0" aria-hidden />
            {d}
          </li>
        ))}
      </ul>
      <p className="mt-10 text-slate-600 dark:text-slate-400">
        Questions about our governance? <Link href="/contact" className="text-primary font-semibold hover:underline">Contact us</Link>.
      </p>
    </div>
  );
}
