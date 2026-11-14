import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { SPONSORSHIP_PACKAGES } from '@/lib/org';

export const metadata = {
  title: 'Corporate Sponsorship | YTOP Global',
  description:
    'Put your organisation’s commitment to youth development into action by sponsoring YTOP Global programmes that strengthen leadership, education, skills and community participation.',
};

// Copy: Master Website Content document, 6.5. Sponsorship packages and prices are intentionally
// not shown: they must be defined from approved programme budgets before publication.
const INTERESTS = [
  'Sponsoring specific programmes.',
  'Supporting school outreach.',
  'Funding leadership development.',
  'Providing learning resources.',
  'Supporting community interventions.',
  'Contributing technical expertise.',
];

export default function SponsorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <Link href="/get-involved" className="inline-flex items-center text-primary font-medium hover:underline">
          ← Get Involved
        </Link>
      </div>
      <div className="flex items-start gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Heart className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Put Your Organisation&apos;s Commitment to Youth Development into Action.
        </h1>
      </div>
      <div className="space-y-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>Corporate organisations have an important role to play in expanding opportunities for young people.</p>
        <p>Through corporate sponsorship, your organisation can support programmes that strengthen leadership, education, skills development and community participation.</p>
        <p>We welcome discussions with organisations interested in:</p>
      </div>
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {INTERESTS.map((i) => (
          <li key={i} className="rounded-xl border-l-4 border-primary bg-slate-50 dark:bg-slate-800 p-4 text-slate-700 dark:text-slate-200">{i}</li>
        ))}
      </ul>
      <p className="mt-8 text-lg text-slate-600 dark:text-slate-400">
        YTOP works with sponsors to define programme objectives, implementation responsibilities, reporting arrangements and appropriate recognition.
      </p>
      {SPONSORSHIP_PACKAGES.length > 0 ? (
        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">Sponsorship packages</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {SPONSORSHIP_PACKAGES.map((p) => (
              <div key={p.name} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark p-6 shadow-sm">
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{p.name}</h3>
                <p className="text-primary font-bold text-lg mt-1">{p.amount}</p>
                <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-400 text-sm list-disc list-inside">
                  {p.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/contact?subject=Corporate%20sponsorship"
          className="inline-flex items-center px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/30 transition"
        >
          Discuss Corporate Sponsorship <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
        <Link
          href="/donate"
          className="inline-flex items-center px-6 py-3 border-2 border-secondary text-secondary dark:border-gray-500 dark:text-white font-bold rounded-full hover:bg-secondary hover:text-white transition"
        >
          Make a Donation
        </Link>
      </div>
    </div>
  );
}
