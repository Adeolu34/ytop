import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { getSiteContent } from '@/lib/site-content';
import PageHeader from '@/components/public/PageHeader';

/** CDN ISR: figures edited in the admin appear within a minute. */
export const revalidate = 60;

export const metadata = {
  title: 'Our Impact | YTOP Global Youth Development Initiatives',
  description:
    "Explore YTOP Global's documented programme results, beneficiary stories, annual reports and community development activities.",
};

// Copy: Master Website Content document, Part Four (4.1 to 4.4).
const LEVELS = [
  {
    title: 'Outputs',
    intro: 'The direct products of programme activities.',
    examples: ['Number of training sessions delivered.', 'Number of schools visited.', 'Number of participants engaged.', 'Number of mentorship sessions conducted.', 'Number of communities reached.'],
  },
  {
    title: 'Outcomes',
    intro: 'The changes that occur among participants or institutions following programme engagement.',
    examples: ['Improved knowledge.', 'Increased confidence.', 'Improved practical competencies.', 'Increased participation in community activities.', 'Improved access to mentorship and development opportunities.'],
  },
  {
    title: 'Longer-term impact',
    intro: 'The broader changes that sustained interventions may contribute to over time.',
    examples: ['Stronger youth leadership participation.', 'Improved access to development opportunities.', 'Greater community engagement.', 'More inclusive participation in local development.'],
  },
];

const REPORTING = [
  'Activities implemented.',
  'Resources mobilised.',
  'Beneficiaries reached.',
  'Results achieved.',
  'Challenges encountered.',
  'Lessons learned.',
  'Future priorities.',
];

const solidButton =
  'inline-flex items-center justify-center px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-full transition-colors';

export default async function ImpactPage() {
  const { impactFigures: IMPACT_FIGURES } = await getSiteContent();
  return (
    <div>
      {/* 4.1 Introduction */}
      <PageHeader title="Measuring Progress. Documenting Results. Strengthening Accountability.">
        <p>At YTOP Global, we believe that development work should be supported by evidence.</p>
        <p>Our impact is reflected in the opportunities we create, the people we engage, the institutions we work with, and the changes that our programmes seek to achieve.</p>
        <p>We are committed to strengthening our monitoring, evaluation and learning practices to understand what works, identify areas for improvement and communicate our results transparently.</p>
      </PageHeader>

      {IMPACT_FIGURES.length > 0 ? (
        <section className="w-full bg-slate-50 dark:bg-surface-dark text-slate-900 dark:text-white py-16" aria-labelledby="impact-figures-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="impact-figures-heading" className="font-display text-3xl font-bold text-center mb-10">Our Work. Our Reach. Our Results.</h2>
            <dl className="grid grid-cols-2 lg:grid-cols-3 gap-8 text-center">
              {IMPACT_FIGURES.map((f) => (
                <div key={f.label}>
                  <dd className="font-display text-4xl md:text-5xl font-extrabold text-primary">{f.value}</dd>
                  <dt className="mt-2 font-semibold first-letter:uppercase">{f.label}</dt>
                  {f.period || f.source ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{[f.period, f.source].filter(Boolean).join(' · ')}</p> : null}
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {/* 4.2 Impact Framework */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-display text-slate-900 dark:text-white text-3xl font-bold text-center mb-3">How We Measure Our Work</h2>
        <p className="text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto mb-12">We distinguish between three levels of programme results.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LEVELS.map((level) => (
            <div key={level.title} className="bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">{level.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{level.intro}</p>
              <p className="text-sm font-bold text-slate-600 uppercase mb-3">Examples:</p>
              <ul className="flex flex-col gap-3">
                {level.examples.map((e) => (
                  <li key={e} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-slate-600 dark:text-slate-400">We will report these results according to available evidence and appropriate measurement periods.</p>
      </section>

      {/* 4.3 Impact Reporting */}
      <section className="w-full bg-slate-50 dark:bg-surface-dark py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-slate-900 dark:text-white text-3xl font-bold mb-4">Accountability Through Reporting</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            We recognise that beneficiaries, donors, partners and the public have a legitimate interest in understanding our work.
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Our reporting process aims to communicate:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-8">
            {REPORTING.map((r) => (
              <li key={r} className="rounded-xl border-l-4 border-primary bg-white dark:bg-background-dark p-4 text-slate-700 dark:text-slate-200">{r}</li>
            ))}
          </ul>
          <Link href="/reports" className={solidButton}>View Our Reports</Link>
        </div>
      </section>

      {/* 4.4 Beneficiary Stories */}
      <section className="w-full max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-slate-900 dark:text-white text-3xl font-bold mb-4">People Behind the Progress</h2>
        <div className="space-y-4 text-slate-600 dark:text-slate-400 mb-8">
          <p>Every development intervention involves people with different experiences, needs and aspirations.</p>
          <p>We document selected participant experiences to show how learning, mentorship, and participation can influence individual development.</p>
          <p>Each story must be based on an actual participant&apos;s experience and published with informed consent.</p>
        </div>
        <Link href="/impact/stories" className={solidButton}>Read More Stories</Link>
      </section>
    </div>
  );
}
