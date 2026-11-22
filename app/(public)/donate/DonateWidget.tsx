'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';

type CampaignOption = { id: string; title: string; paymentUrl: string | null };
type GivingLink = { label: string; url: string };

type Props = {
  campaigns: CampaignOption[];
  /** Paystack payment pages for specific programmes or funds (admin: Site content). */
  givingLinks: GivingLink[];
  /** Paystack payment page for monthly giving (admin: Site content). */
  monthlyUrl: string | null;
  /**
   * True only when the server has a Paystack secret key and can start checkouts itself. Most setups
   * use payment links instead, which is the default path below.
   */
  checkoutEnabled: boolean;
};

const PROGRAMMES = [
  'Rise of Warriors',
  'Rise of 100 Leaders',
  'Youth on a Mission',
  'Project 300',
  'Food4All',
  'YTOP Conference',
];

/** The general one-time payment page. It accepts ?amount= in kobo. */
const GENERAL_PAY_URL = 'https://paystack.com/pay/ytopglobalpay/';
const AMOUNTS = [1000, 2500, 5000, 10000];

const field =
  'w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none';

export default function DonateWidget({ campaigns, givingLinks, monthlyUrl, checkoutEnabled }: Props) {
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  const [amount, setAmount] = useState<number | null>(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [target, setTarget] = useState(''); // '' | 'programme:<name>' | 'campaign:<id>' | 'link:<index>'
  const [status, setStatus] = useState<'idle' | 'working' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  // /donate?frequency=monthly#give-once opens the form on monthly giving.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('frequency') === 'monthly') setFrequency('monthly');
  }, []);

  const parsedCustom = Number(customAmount);
  const hasValidCustom = customAmount !== '' && Number.isFinite(parsedCustom) && parsedCustom >= 100;
  const displayAmount = amount ?? (hasValidCustom ? parsedCustom : null);

  // What the donor can choose to support. With payment links, only choices that have a link are offered.
  const linkedCampaigns = campaigns.filter((c) => c.paymentUrl);
  const options = checkoutEnabled
    ? [
        ...PROGRAMMES.map((p) => ({ value: `programme:${p}`, label: p, group: 'Programmes' })),
        ...campaigns.map((c) => ({ value: `campaign:${c.id}`, label: c.title, group: 'Current campaigns' })),
      ]
    : [
        ...givingLinks.map((l, i) => ({ value: `link:${i}`, label: l.label, group: 'Programmes and funds' })),
        ...linkedCampaigns.map((c) => ({ value: `campaign:${c.id}`, label: c.title, group: 'Current campaigns' })),
      ];
  const groups = [...new Set(options.map((o) => o.group))];

  // A payment page chosen for a specific fund (payment-link mode only).
  const chosenLink: string | null = checkoutEnabled
    ? null
    : target.startsWith('link:')
      ? givingLinks[Number(target.slice(5))]?.url ?? null
      : target.startsWith('campaign:')
        ? campaigns.find((c) => c.id === target.slice(9))?.paymentUrl ?? null
        : null;

  const linkMonthly = !checkoutEnabled && frequency === 'monthly';
  const monthlyUnavailable = linkMonthly && !monthlyUrl;
  const ownPage = linkMonthly ? Boolean(monthlyUrl) : Boolean(chosenLink);
  const needsAmount = checkoutEnabled || (!ownPage && !monthlyUnavailable);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    // Payment-link mode: the donor continues on the chosen Paystack payment page.
    if (!checkoutEnabled) {
      if (linkMonthly) {
        if (monthlyUrl) window.location.href = monthlyUrl;
        return;
      }
      if (chosenLink) {
        window.location.href = chosenLink;
        return;
      }
      if (displayAmount === null) {
        setMessage('Choose an amount, or enter a custom amount of at least ₦100.');
        setStatus('error');
        return;
      }
      window.location.href = `${GENERAL_PAY_URL}?amount=${Math.round(displayAmount * 100)}`;
      return;
    }

    // Server-side checkout mode (only when PAYSTACK_SECRET_KEY is set on the server).
    if (displayAmount === null) {
      setMessage('Choose an amount, or enter a custom amount of at least ₦100.');
      setStatus('error');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setMessage('Please enter your email address so we can send your receipt.');
      setStatus('error');
      return;
    }

    setStatus('working');
    try {
      const res = await fetch('/api/donate/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: displayAmount,
          email: email.trim(),
          name: name.trim() || undefined,
          frequency,
          programme: target.startsWith('programme:')
            ? target.slice(10)
            : target.startsWith('campaign:')
              ? campaigns.find((c) => c.id === target.slice(9))?.title
              : undefined,
          campaignId: target.startsWith('campaign:') ? target.slice(9) : undefined,
        }),
      });
      const body = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (res.ok && body?.url) {
        window.location.href = body.url;
        return;
      }
      setMessage(body?.error ?? 'We could not start your payment. Please try again.');
      setStatus('error');
    } catch {
      setMessage('We could not start your payment. Please check your connection and try again.');
      setStatus('error');
    }
  }

  const buttonLabel = linkMonthly
    ? 'Set up monthly giving'
    : ownPage
      ? 'Continue to the payment page'
      : displayAmount !== null
        ? `Donate ₦${displayAmount.toLocaleString()}${frequency === 'monthly' ? ' monthly' : ''} Securely`
        : 'Select an amount';

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 sm:p-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" aria-hidden />
            {frequency === 'monthly' ? 'Give monthly' : 'Give Once'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select the contribution type and amount you wish to give. Your contribution will support the work and programme you select.
          </p>

          <div role="radiogroup" aria-label="Contribution type" className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full sm:w-fit gap-1">
            {(['once', 'monthly'] as const).map((f) => (
              <button
                key={f}
                type="button"
                role="radio"
                aria-checked={frequency === f}
                onClick={() => setFrequency(f)}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  frequency === f ? 'bg-white dark:bg-slate-700 shadow-sm text-primary font-bold border border-slate-200 dark:border-slate-600' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {f === 'once' ? 'Give once' : 'Give monthly'}
              </button>
            ))}
          </div>

          {needsAmount ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => { setAmount(a); setCustomAmount(''); }}
                    aria-pressed={amount === a}
                    className={`border rounded-lg py-3 font-semibold transition-colors ${
                      amount === a ? 'bg-primary/10 border-primary text-primary' : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary'
                    }`}
                  >
                    ₦{a.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="relative">
                <label htmlFor="custom-amount" className="sr-only">Custom amount in Naira</label>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₦</span>
                <input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter custom amount (NGN, minimum 100)"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setAmount(null); }}
                  className={`${field} pl-8`}
                  min={100}
                />
              </div>
            </>
          ) : monthlyUnavailable ? null : (
            <p className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-700 dark:text-slate-300">
              {linkMonthly
                ? 'Monthly giving is set up on our secure Paystack page, where you choose your amount and details.'
                : 'This programme has its own secure Paystack page, where you choose your amount and details.'}
            </p>
          )}

          {options.length > 0 && !linkMonthly ? (
            <div>
              <label htmlFor="donate-target" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">I want to support</label>
              <select id="donate-target" value={target} onChange={(e) => setTarget(e.target.value)} className={field}>
                <option value="">Where it is needed most</option>
                {groups.map((g) => (
                  <optgroup key={g} label={g}>
                    {options.filter((o) => o.group === g).map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          ) : null}

          {checkoutEnabled ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="donor-name" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Your name (optional)</label>
                <input id="donor-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={field} />
              </div>
              <div>
                <label htmlFor="donor-email" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Email for your receipt *</label>
                <input id="donor-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex-1 lg:max-w-md flex flex-col gap-6 lg:border-l lg:border-slate-200 dark:border-slate-700 lg:pl-10">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Complete Your Donation</h3>

          {monthlyUnavailable ? (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
              To give monthly, please{' '}
              <Link href="/contact?subject=Monthly%20giving" className="font-semibold underline">contact our team</Link>{' '}
              and we will arrange your monthly gift.
            </div>
          ) : (
            <>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {ownPage
                  ? 'You will be taken to our payment partner, Paystack, to complete your donation.'
                  : displayAmount !== null
                    ? `You will be redirected to our payment partner, Paystack, to complete your ${frequency === 'monthly' ? 'monthly donation' : 'one-time donation'} of ₦${displayAmount.toLocaleString()}${frequency === 'monthly' ? ' a month' : ''}.`
                    : 'Choose an amount, or enter a custom amount of at least ₦100.'}
              </p>
              <button
                type="submit"
                disabled={status === 'working' || (needsAmount && displayAmount === null)}
                className="w-full py-4 bg-primary hover:bg-primary-hover disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-full shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" aria-hidden />
                {status === 'working' ? 'Starting secure payment...' : buttonLabel}
              </button>
            </>
          )}

          {status === 'working' ? (
            <p role="status" className="text-sm text-slate-700 dark:text-slate-300 bg-amber-50 border border-amber-200 rounded-lg p-3">
              Your payment is being processed. Please do not submit the transaction again while processing continues.
            </p>
          ) : null}
          {message ? (
            <p role="alert" className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg p-3">{message}</p>
          ) : null}

          <p className="text-sm text-center text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" aria-hidden />
            Secure payment processed by Paystack
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Giving from outside Nigeria? See{' '}
            <a href="#international" className="text-primary font-semibold hover:underline">International and Diaspora Donations</a>.
            Prefer a bank transfer?{' '}
            <Link href="/contact?subject=Bank%20transfer%20details" className="text-primary font-semibold hover:underline">Contact us</Link> for the account details.
          </p>
        </div>
      </div>
    </form>
  );
}
