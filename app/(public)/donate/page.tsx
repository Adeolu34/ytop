import Link from 'next/link';
import { Heart } from 'lucide-react';
import DonateWidget from './DonateWidget';
import { isPaystackConfigured } from '@/lib/paystack';
import { getSiteContent } from '@/lib/site-content';
import { loadWithDatabaseFallback } from '@/lib/public-db';
import { mongoCampaignsListActive, type MongoCampaignDoc } from '@/lib/mongo-campaigns-store';

/**
 * Rendered on every request, not pre-built: whether online checkout is available depends on the
 * PAYSTACK_SECRET_KEY set on the server right now, and campaign totals should never be stale.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Donate to YTOP Global | Support Youth Development in Nigeria',
  description:
    "Support YTOP Global's youth leadership, education, mentorship and community development initiatives through one-time or recurring donations.",
};

// Copy: Master Website Content document, Part Six (6.1 to 6.6). No impact figures, unit costs or fund
// allocations are stated: the document says they must be verified against approved budgets first.
const SUPPORT_AREAS = [
  'Extend educational and leadership outreach to schools.',
  'Provide learning materials and programme resources.',
  'Expand access to mentorship.',
  'Support youth development activities.',
  'Mobilise volunteers and facilitators.',
  'Implement community-based initiatives.',
  'Strengthen monitoring and reporting.',
];

const YOUNG_LEADER_COVERS = [
  'Programme participation.',
  'Learning materials.',
  'Mentorship engagement.',
  'Practical development activities.',
  'Programme monitoring.',
];

const CORPORATE_INTERESTS = [
  'Sponsoring specific programmes.',
  'Supporting school outreach.',
  'Funding leadership development.',
  'Providing learning resources.',
  'Supporting community interventions.',
  'Contributing technical expertise.',
];

function formatMoney(currency: string, amount: number): string {
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

const solid =
  'inline-flex items-center justify-center px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-full transition-colors';
const outline =
  'inline-flex items-center justify-center px-8 py-3 border-2 border-secondary text-secondary dark:border-white dark:text-white font-bold rounded-full hover:bg-secondary hover:text-white transition-colors';

export default async function DonatePage() {
  const { givingLinks, monthlyGivingUrl } = await getSiteContent();
  const monthlyOnline = isPaystackConfigured() || Boolean(monthlyGivingUrl);
  const campaigns: MongoCampaignDoc[] = await loadWithDatabaseFallback({
    load: async () => mongoCampaignsListActive(),
    fallback: [],
    onError(error) {
      console.error('Donate page campaigns unavailable:', error);
    },
  });

  return (
    <div className="min-h-screen">
      {/* 6.1 Main Donation Page */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1e] via-[#1a1040] to-[#2d0a0e] py-20 md:py-28">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#ba0013]/20 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
            Your Support Helps Create Opportunities for Young People.
          </h1>
          <div className="mx-auto mt-8 max-w-2xl space-y-4 text-lg leading-relaxed text-white/90">
            <p>Across communities, many young people have the potential to lead, innovate, and contribute to social and economic development.</p>
            <p>However, access to learning opportunities, mentorship, resources, and platforms that support their development remains limited.</p>
            <p>YTOP Global works to address these gaps through leadership development, capacity building, education, mentorship, and community-based initiatives.</p>
            <p>Your contribution helps us expand these opportunities and reach more young people.</p>
            <p>Every contribution matters because it supports a defined part of the work required to deliver our programmes.</p>
            <p>Whether you give once, contribute monthly or sponsor an entire programme, you become part of a collective effort to strengthen youth development.</p>
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#give-once" className="inline-flex items-center gap-2 rounded-full bg-[#ba0013] px-8 py-4 font-bold text-white shadow-lg shadow-[#ba0013]/40 transition-all hover:bg-[#93000d]">
              <Heart className="h-5 w-5" aria-hidden /> Give Once
            </a>
            <a href="#monthly-giving" className="inline-flex items-center rounded-full border-2 border-white px-8 py-4 font-bold text-white transition-all hover:bg-white hover:text-[#1a1040]">
              Give monthly
            </a>
            <Link href="/get-involved/sponsor" className="inline-flex items-center rounded-full border-2 border-white px-8 py-4 font-bold text-white transition-all hover:bg-white hover:text-[#1a1040]">
              Sponsor a Programme
            </Link>
          </div>
        </div>
      </section>

      {/* Give once: donation form */}
      <section id="give-once" className="relative scroll-mt-20 bg-gradient-to-b from-slate-50 to-white py-16 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Choose Your Contribution</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Amounts are in Nigerian Naira (₦).</p>
          </div>
          <DonateWidget
            campaigns={campaigns
              .filter((c) => c.currency === 'NGN')
              .map((c) => ({ id: c.id, title: c.title, paymentUrl: c.paymentUrl ?? null }))}
            givingLinks={givingLinks}
            monthlyUrl={monthlyGivingUrl}
            checkoutEnabled={isPaystackConfigured()}
          />
        </div>
      </section>

      {/* Active campaigns: managed in the admin under Campaigns */}
      {campaigns.length > 0 ? (
        <section className="bg-white py-16 dark:bg-slate-900" aria-labelledby="campaigns-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 id="campaigns-heading" className="mb-8 text-center font-display text-3xl font-bold text-slate-900 dark:text-white">Current Campaigns</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {campaigns.map((c) => {
                const pct = c.goalAmount > 0 ? Math.min(100, Math.round((c.raisedAmount / c.goalAmount) * 100)) : 0;
                return (
                  <article key={c.id} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-surface-dark">
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{c.title}</h3>
                    <p className="mt-2 flex-1 text-slate-600 dark:text-slate-400">{c.description}</p>
                    <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${c.title} progress`}>
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      <strong className="text-slate-900 dark:text-white">{formatMoney(c.currency, c.raisedAmount)}</strong> raised of {formatMoney(c.currency, c.goalAmount)} ({pct}%)
                    </p>
                    <a href="#give-once" className="mt-4 inline-flex font-semibold text-primary hover:underline">Give towards this campaign</a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* 6.2 Why Your Support Matters */}
      <section className="bg-white py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center font-display text-3xl font-bold text-slate-900 dark:text-white">Why Your Support Matters</h2>
          <p className="mt-4 text-center text-slate-600 dark:text-slate-400">Your contribution can help YTOP:</p>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {SUPPORT_AREAS.map((item) => (
              <li key={item} className="rounded-xl border-l-4 border-primary bg-slate-50 p-4 text-slate-700 dark:bg-slate-800 dark:text-slate-200">{item}</li>
            ))}
          </ul>
          <p className="mt-8 text-center text-slate-600 dark:text-slate-400">
            We are committed to communicating how contributions support our activities and documenting the results of funded interventions.
          </p>
        </div>
      </section>

      {/* 6.3 Sponsor a Young Leader */}
      <section id="sponsor-a-young-leader" className="scroll-mt-20 bg-slate-50 py-20 dark:bg-background-dark">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Sponsor a Young Leader</h2>
          <p className="mt-2 text-xl font-semibold text-primary">Help a Young Person Access Opportunities for Growth.</p>
          <div className="mt-6 space-y-4 text-lg text-slate-600 dark:text-slate-300">
            <p>Talent and ambition are important, but development also requires access to opportunities.</p>
            <p>Through Sponsor a Young Leader, supporters can contribute towards the cost of participation in structured leadership and personal development programmes.</p>
            <p>Your sponsorship can help cover approved programme expenses, including learning materials, facilitation, mentorship activities and participant support.</p>
          </div>
          <h3 className="mt-8 font-bold text-slate-900 dark:text-white">What your support can cover</h3>
          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {YOUNG_LEADER_COVERS.map((c) => (
              <li key={c} className="rounded-xl bg-white p-4 text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200">{c}</li>
            ))}
          </ul>
          <Link href="/contact?subject=Sponsor%20a%20Young%20Leader" className={`mt-8 ${solid}`}>Sponsor a Young Leader Today</Link>
        </div>
      </section>

      {/* 6.4 Monthly Giving */}
      <section id="monthly-giving" className="scroll-mt-20 bg-white py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Monthly Giving</h2>
          <p className="mt-2 text-xl font-semibold text-primary">Make Your Support Count Throughout the Year.</p>
          <div className="mt-6 space-y-4 text-lg text-slate-600 dark:text-slate-300">
            <p>Consistent support helps organisations plan, implement and improve their programmes.</p>
            <p>Through monthly giving, you can make a recurring contribution towards YTOP&apos;s youth development initiatives.</p>
            <p>Your contribution helps provide a more predictable funding base for programme implementation and organisational planning.</p>
            <p>Choose an amount that works for you and become part of our community of regular supporters.</p>
            {monthlyOnline ? null : (
              <p className="text-base text-slate-600 dark:text-slate-400">Our team arranges monthly gifts directly and will confirm your amount and payment method.</p>
            )}
          </div>
          <Link href={monthlyOnline ? '/donate?frequency=monthly#give-once' : '/contact?subject=Monthly%20giving'} className={`mt-8 ${solid}`}>Become a Monthly Supporter</Link>
        </div>
      </section>

      {/* 6.5 Corporate Sponsorship */}
      <section className="bg-slate-50 py-20 dark:bg-background-dark">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Corporate Sponsorship</h2>
          <p className="mt-2 text-xl font-semibold text-primary">Put Your Organisation&apos;s Commitment to Youth Development into Action.</p>
          <div className="mt-6 space-y-4 text-lg text-slate-600 dark:text-slate-300">
            <p>Corporate organisations play an important role in expanding opportunities for young people.</p>
            <p>Through corporate sponsorship, your organisation can support programmes that strengthen leadership, education, skills development and community participation.</p>
            <p>We welcome discussions with organisations interested in:</p>
          </div>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {CORPORATE_INTERESTS.map((c) => (
              <li key={c} className="rounded-xl bg-white p-4 text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200">{c}</li>
            ))}
          </ul>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
            YTOP works with sponsors to define programme objectives, implementation responsibilities, reporting arrangements, and appropriate recognition.
          </p>
          <Link href="/get-involved/sponsor" className={`mt-8 ${solid}`}>Discuss Corporate Sponsorship</Link>
        </div>
      </section>

      {/* 6.6 International and Diaspora Donations */}
      <section id="international" className="scroll-mt-20 bg-white py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">International and Diaspora Donations</h2>
          <p className="mt-2 text-xl font-semibold text-primary">Support Youth Development, Wherever You Are.</p>
          <div className="mt-6 space-y-4 text-lg text-slate-600 dark:text-slate-300">
            <p>Our commitment to youth development extends beyond geographical boundaries.</p>
            <p>We welcome support from Nigerians in the diaspora, international individuals, foundations and organisations interested in contributing to youth and community development.</p>
            <p>Whether you support a specific programme or contribute to our wider mission, your contribution can help expand access to development opportunities.</p>
            <p>We aim to make international giving straightforward, secure and transparent.</p>
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Link href="/contact?subject=International%20donation" className={solid}>Donate Internationally</Link>
            <Link href="/contact?subject=Support%20a%20specific%20programme" className={outline}>Support a Specific Programme</Link>
            <Link href="/get-involved/partner" className={outline}>Discuss an institutional partnership</Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 dark:bg-background-dark">
        <p className="mx-auto max-w-3xl px-4 text-center text-sm text-slate-600 dark:text-slate-400">
          YTOP Global is registered with the Corporate Affairs Commission (RC179444).
        </p>
      </section>
    </div>
  );
}
