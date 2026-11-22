import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import { requireAdmin } from '@/lib/auth-utils';
import { isMongoConfigured } from '@/lib/mongodb';
import {
  mongoDonationsList,
  mongoDonationTotals,
  type MongoDonation,
} from '@/lib/mongo-donations-store';
import { isPaystackConfigured } from '@/lib/paystack';

function money(currency: string, amount: number): string {
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export default async function AdminDonationsPage() {
  await requireAdmin();

  let donations: MongoDonation[] = [];
  let totals: Awaited<ReturnType<typeof mongoDonationTotals>> = [];
  let loadError: string | null = null;
  if (!isMongoConfigured()) {
    loadError = 'MongoDB is not configured for this deployment. Set MONGODB_URI, then redeploy.';
  } else {
    try {
      [donations, totals] = await Promise.all([mongoDonationsList(100), mongoDonationTotals()]);
    } catch (e) {
      loadError = e instanceof Error ? e.message : 'Could not load donations.';
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section>
        <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
          Fundraising
        </span>
        <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
          Donations
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
          Gifts confirmed through the website&apos;s own checkout (needs a Paystack secret key). Gifts made
          through Paystack payment links or by bank transfer are not listed here.
        </p>
      </section>

      {loadError ? <AdminFlashBanner type="error" message={loadError} /> : null}
      {!isPaystackConfigured() ? (
        <AdminFlashBanner
          type="notice"
          message="This list fills in only when the site has a Paystack secret key. You are using payment links, so see your gifts in the Paystack dashboard (Transactions). To update a campaign's total, edit it on the Campaigns screen."
        />
      ) : null}

      {totals.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {totals.map((t) => (
            <div key={t.currency} className="rounded-2xl border border-[#e4beb9]/50 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#5d3f3c]">Total {t.currency}</p>
              <p className="admin-font-display mt-1 text-2xl font-extrabold text-[#1b1c1c]">{money(t.currency, t.total)}</p>
              <p className="text-xs text-[#5d3f3c]">{t.count} gift{t.count === 1 ? '' : 's'}</p>
            </div>
          ))}
        </div>
      ) : null}

      <ul className="flex flex-col gap-3">
        {donations.length === 0 && !loadError ? <li className="text-sm text-[#5d3f3c]">No confirmed donations yet.</li> : null}
        {donations.map((d) => (
          <li key={d.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4beb9]/40 bg-white p-4">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[#1b1c1c]">
                {money(d.currency, d.amount)} <span className="font-normal text-[#5d3f3c]">· {d.frequency === 'monthly' ? 'monthly' : 'one-time'}</span>
              </p>
              <p className="text-xs text-[#5d3f3c]">
                {d.name || 'Anonymous'}{d.email ? ` · ${d.email}` : ''}{d.programme ? ` · for ${d.programme}` : ''}
              </p>
            </div>
            <p className="text-xs text-[#5d3f3c]">
              {new Date(d.paidAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })} UTC
            </p>
            <code className="text-[0.7rem] text-[#5d3f3c]">{d.reference}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
