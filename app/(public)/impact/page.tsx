import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Our Impact | YTOP Global Youth Development Initiatives',
  description:
    "Explore YTOP Global's documented programme results, beneficiary stories, annual reports and community development activities.",
};

// Copy: Master Website Content document, Part Four. Every figure below is documented on the Events
// page. Organisation-wide totals (people reached, institutions, countries, volunteers) are not shown
// until verified against records, with a reporting period and source.
const HIGHLIGHTS = [
  { value: '2,000+', label: 'participants in the ten-day development webinar', detail: 'April–May 2020, virtual' },
  { value: '800+', label: 'students at one Talent Discovery school visit', detail: 'Urban Day Secondary School, Ibadan, 2020' },
  { value: '300+', label: 'changemakers at YTOP Conference 2.0', detail: '2024, from 32 universities' },
  { value: '5', label: 'countries represented at Conference 2.0', detail: 'Nigeria, Namibia, Zimbabwe, Zambia and Ghana' },
];

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

export default function ImpactPage() {
  return (
    <div>
      <section className="w-full px-4 py-12 md:py-20 lg:py-24 bg-white dark:bg-background-dark relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" aria-hidden />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center relative z-10">
          <div className="flex-1 flex flex-col gap-6 text-center md:text-left">
            <span className="inline-flex items-center justify-center md:justify-start gap-2 text-primary font-bold uppercase tracking-wider text-xs">
              Our Impact
            </span>
            <h1 className="font-display text-slate-900 dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Measuring Progress. Documenting Results. <span className="text-primary">Strengthening Accountability.</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl mx-auto md:mx-0">
              At YTOP Global, we believe that development work should be supported by evidence. We are committed to strengthening our monitoring, evaluation and learning practices to understand what works, identify areas for improvement and communicate our results transparently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <a href="#highlights" className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-all shadow-lg shadow-primary/20">
                See Documented Results <ArrowDown className="w-5 h-5" />
              </a>
              <Link href="/about" className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium transition-all">
                Learn about us
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800">
              <Image src="/media/2025/10/DSC0289.jpg" alt="YTOP Global conference participants" fill className="object-cover" sizes="500px" />
            </div>
          </div>
        </div>
      </section>

      <section id="highlights" className="w-full bg-secondary text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-center mb-2">Documented Programme Results</h2>
          <p className="text-center text-white/80 mb-10">Figures from specific programme editions, as recorded on our events page.</p>
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {HIGHLIGHTS.map((h) => (
              <div key={h.label}>
                <dd className="font-display text-4xl md:text-5xl font-extrabold text-primary">{h.value}</dd>
                <dt className="mt-2 text-sm text-white/90">{h.label}</dt>
                <p className="mt-1 text-xs text-white/60">{h.detail}</p>
              </div>
            ))}
          </dl>
          <div className="mt-10 text-center">
            <Link href="/events#previous-events" className="inline-flex items-center font-semibold underline underline-offset-4 hover:text-primary">
              See the full event record <ArrowRight className="ml-1 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-display text-slate-900 dark:text-white text-3xl font-bold text-center mb-3">How We Measure Our Work</h2>
        <p className="text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto mb-12">
          We distinguish between three levels of programme results, and report them according to available evidence and appropriate measurement periods.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LEVELS.map((level) => (
            <div key={level.title} className="bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">{level.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{level.intro}</p>
              <p className="text-xs font-bold text-slate-400 uppercase mb-3">Examples</p>
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
      </section>

      <section className="w-full bg-slate-50 dark:bg-surface-dark py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-slate-900 dark:text-white text-3xl font-bold mb-4">Accountability Through Reporting</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Beneficiaries, donors, partners and the public have a legitimate interest in understanding our work. Our reporting process aims to communicate:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-8">
            {REPORTING.map((r) => (
              <li key={r} className="rounded-xl border-l-4 border-primary bg-white dark:bg-background-dark p-4 text-slate-700 dark:text-slate-200">{r}</li>
            ))}
          </ul>
          <Link href="/reports" className="inline-flex items-center font-semibold text-primary">
            View Our Reports <ArrowRight className="ml-1 w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="w-full max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-slate-900 dark:text-white text-3xl font-bold mb-4">People Behind the Progress</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          We document selected participant experiences to demonstrate how opportunities for learning, mentorship and participation can influence individual development. Each story is based on an actual participant&apos;s experience and published with informed consent.
        </p>
        <Link href="/impact/stories" className="inline-flex items-center font-semibold text-primary">
          Read Their Stories <ArrowRight className="ml-1 w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
