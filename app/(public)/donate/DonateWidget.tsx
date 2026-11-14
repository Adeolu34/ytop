'use client';

import { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';

/**
 * One-time donations only. The Paystack payment link accepts an amount but does not create a
 * subscription, so recurring giving is offered as an enquiry until a Paystack plan is configured.
 */
export default function DonateWidget() {
  const [amount, setAmount] = useState<number | null>(5000);
  const [customAmount, setCustomAmount] = useState('');

  const parsedCustom = Number(customAmount);
  const hasValidCustom = customAmount !== '' && Number.isFinite(parsedCustom) && parsedCustom >= 100;
  const displayAmount = amount ?? (hasValidCustom ? parsedCustom : null);
  // Paystack expects amount in kobo (NGN x 100)
  const paystackUrl =
    displayAmount !== null
      ? `https://paystack.com/pay/ytopglobalpay/?amount=${Math.round(displayAmount * 100)}`
      : null;
  const amounts = [1000, 2500, 5000, 10000];

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 sm:p-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Give Once
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select the amount you wish to give. Your contribution will support the work of YTOP Global.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {amounts.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => { setAmount(a); setCustomAmount(''); }}
                className={`border rounded-lg py-3 font-semibold transition-colors ${
                  amount === a
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary'
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
              className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              min={100}
            />
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-600 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white">Prefer to give monthly, or from outside Nigeria?</strong>{' '}
            Recurring and international giving are arranged directly for now.{' '}
            <Link href="/contact" className="text-primary font-semibold hover:underline">Contact us</Link> and we will set it up with you.
          </div>
        </div>
        <div className="flex-1 lg:max-w-md flex flex-col gap-6 lg:border-l lg:border-slate-200 dark:border-slate-700 lg:pl-10">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Complete Your Donation</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {displayAmount !== null
              ? `You will be redirected to our payment partner, Paystack, to complete your one-time donation of ₦${displayAmount.toLocaleString()}.`
              : 'Choose an amount, or enter a custom amount of at least ₦100.'}
          </p>
          {paystackUrl ? (
            <a
              href={paystackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Donate ₦{displayAmount!.toLocaleString()} Securely
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-4 bg-slate-300 text-slate-600 font-bold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              Select an amount
            </button>
          )}
          <p className="text-xs text-center text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Secure payment processed by Paystack
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Or <Link href="/contact" className="text-primary font-semibold hover:underline">contact us</Link> for bank transfer details.
          </p>
        </div>
      </div>
    </div>
  );
}
