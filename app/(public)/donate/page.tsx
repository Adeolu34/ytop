import Link from 'next/link';
import { Heart, GraduationCap, Repeat, Building2, Globe } from 'lucide-react';
import DonateWidget from './DonateWidget';

export const metadata = {
  title: 'Donate to YTOP Global | Support Youth Development in Nigeria',
  description:
    "Support YTOP Global's youth leadership, education, mentorship and community development initiatives through one-time or recurring donations.",
};

// Copy: Master Website Content document, Part Six. No impact figures, unit costs or fund
// allocations are stated: they must be verified against approved budgets before publication.
const SUPPORT_AREAS = [
  'Extend educational and leadership outreach to schools.',
  'Provide learning materials and programme resources.',
  'Expand access to mentorship.',
  'Support youth development activities.',
  'Mobilise volunteers and facilitators.',
  'Implement community-based initiatives.',
  'Strengthen monitoring and reporting.',
];

const WAYS = [
  {
    icon: GraduationCap,
    title: 'Sponsor a Young Leader',
    body: 'Contribute towards the cost of participation in structured leadership and personal development programmes. Your sponsorship can help cover approved programme expenses, including learning materials, facilitation, mentorship activities and participant support.',
    cta: 'Sponsor a Young Leader Today',
    href: '/contact?subject=Sponsor%20a%20Young%20Leader',
  },
  {
    icon: Repeat,
    title: 'Monthly Giving',
    body: 'Consistent support helps organisations plan, implement and improve their programmes. A recurring contribution provides a more predictable funding base for programme implementation and organisational planning.',
    cta: 'Become a Monthly Supporter',
    href: '/contact?subject=Monthly%20giving',
  },
  {
    icon: Building2,
    title: 'Corporate Sponsorship',
    body: 'Put your organisation’s commitment to youth development into action by sponsoring specific programmes, supporting school outreach, funding leadership development or contributing technical expertise.',
    cta: 'Discuss Corporate Sponsorship',
    href: '/get-involved/sponsor',
  },
  {
    icon: Globe,
    title: 'International and Diaspora Giving',
    body: 'We welcome support from Nigerians in the diaspora, international individuals, foundations and organisations. We aim to make international giving straightforward, secure and transparent.',
    cta: 'Donate Internationally',
    href: '/contact?subject=International%20donation',
  },
];

export default function DonatePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1e] via-[#1a1040] to-[#2d0a0e] py-24 md:py-32">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#ba0013]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[#3b1fff]/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
            Your Support Helps Create Opportunities for Young People.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/85 sm:text-xl">
            Many young people have the potential to lead, innovate and contribute to social and economic development. Your contribution helps us expand access to the learning, mentorship, resources and platforms that support their growth.
          </p>
          <a
            href="#donate-widget"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ba0013] px-8 py-4 font-bold text-white shadow-lg shadow-[#ba0013]/40 transition-all hover:scale-105 hover:bg-[#93000d]"
          >
            <Heart className="h-5 w-5" />
            Give Once
          </a>
        </div>
      </section>

      {/* Donate widget */}
      <section
        id="donate-widget"
        className="relative bg-gradient-to-b from-slate-50 to-white py-16 dark:from-slate-900 dark:to-slate-800"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
              Choose Your Contribution
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Every contribution matters because it supports a defined part of the work required to deliver our programmes. Amounts are in Nigerian Naira (₦).
            </p>
          </div>
          <DonateWidget />
        </div>
      </section>

      {/* Why your support matters */}
      <section className="bg-white py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center font-display text-3xl font-bold text-slate-900 dark:text-white">
            Why Your Support Matters
          </h2>
          <p className="mt-4 text-center text-slate-600 dark:text-slate-400">Your contribution can help YTOP:</p>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {SUPPORT_AREAS.map((item) => (
              <li key={item} className="rounded-xl border-l-4 border-primary bg-slate-50 p-4 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-slate-600 dark:text-slate-400">
            We are committed to communicating how contributions support our activities and documenting the results of funded interventions.
          </p>
        </div>
      </section>

      {/* Ways to give */}
      <section className="bg-slate-50 py-20 dark:bg-background-dark">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-slate-900 dark:text-white">
            Other Ways to Give
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {WAYS.map(({ icon: Icon, title, body, cta, href }) => (
              <div key={title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-surface-dark">
                <Icon className="mb-4 h-8 w-8 text-primary" aria-hidden />
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-3 flex-1 text-slate-600 dark:text-slate-400">{body}</p>
                <Link href={href} className="mt-6 inline-flex font-semibold text-primary hover:underline">
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accountability */}
      <section className="bg-white py-16 dark:bg-slate-900">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-lg text-slate-600 dark:text-slate-400">
            YTOP Global is registered with the Corporate Affairs Commission (RC179444). We are committed to responsible resource management and transparent reporting.
          </p>
          <p className="mt-6 text-sm text-slate-500">
            Prefer to give via bank transfer?{' '}
            <Link href="/contact" className="font-semibold text-[#ba0013] hover:underline">
              Contact us
            </Link>{' '}
            for account details.
          </p>
        </div>
      </section>
    </div>
  );
}
