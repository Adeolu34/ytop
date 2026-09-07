import Link from 'next/link';
import { Heart, Users, BookOpen, Globe } from 'lucide-react';
import DonateWidget from './DonateWidget';

export const metadata = {
  title: 'Donate - YTOP Global',
  description: 'Your contribution fuels the future of youth. Support YTOP Global programs through a secure donation.',
};

const IMPACT_STATS = [
  { icon: Users, value: '5,000+', label: 'Young people reached' },
  { icon: BookOpen, value: '12+', label: 'Programs running' },
  { icon: Globe, value: '6', label: 'States across Nigeria' },
  { icon: Heart, value: '100%', label: 'Goes to youth programs' },
];

export default function DonatePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1e] via-[#1a1040] to-[#2d0a0e] py-24 md:py-32">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#ba0013]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[#3b1fff]/20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ba0013]/10 blur-2xl" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            Make a Difference
          </span>
          <h1 className="mt-4 font-display text-4xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
            Empower a{' '}
            <span className="text-transparent [-webkit-text-stroke:2px_#ba0013] [text-stroke:2px_#ba0013] md:text-white md:[text-shadow:0_0_40px_#ba0013]">
              Dream
            </span>{' '}
            Today
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/80 sm:text-xl">
            Your contribution fuels the future of African youth. Join us in
            making a lasting impact through education, leadership, and community
            building.
          </p>
          <a
            href="#donate-widget"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ba0013] px-8 py-4 font-bold text-white shadow-lg shadow-[#ba0013]/40 transition-all hover:scale-105 hover:bg-[#93000d] hover:shadow-[#ba0013]/60"
          >
            <Heart className="h-5 w-5" />
            Donate Now
          </a>
        </div>

        {/* Impact stats bar */}
        <div className="relative z-10 mx-auto mt-16 max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm md:grid-cols-4">
            {IMPACT_STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 px-6 py-6 text-center">
                <Icon className="h-5 w-5 text-[#ba0013]" />
                <p className="font-display text-2xl font-black text-white md:text-3xl">{value}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-white/60">{label}</p>
              </div>
            ))}
          </div>
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
              All amounts are in Nigerian Naira (₦). Secure payment via Paystack.
            </p>
          </div>
          <DonateWidget />
        </div>
      </section>

      {/* Why Donate */}
      <section className="bg-white py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
            Why Donate to YTOP?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Every naira supports mentorship sessions, leadership bootcamps, and
            community outreach. We are a registered nonprofit (RC179444) — your
            gift creates measurable, transparent impact in Nigerian youth
            communities.
          </p>
          <p className="mt-8 text-sm text-slate-500 dark:text-slate-500">
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
