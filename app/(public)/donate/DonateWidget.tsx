'use client';

import { useState } from 'react';
import { CreditCard, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DonateWidget() {
  const [frequency, setFrequency] = useState<'one-time' | 'monthly' | 'yearly'>('one-time');
  const [amount, setAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('');

  const displayAmount = amount ?? (customAmount ? Number(customAmount) : 50);
  const amounts = [10, 25, 50, 100];

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 sm:p-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Make a Custom Donation
          </h3>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full sm:w-fit gap-1">
            {(['one-time', 'monthly', 'yearly'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                  frequency === f
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-primary font-bold border border-slate-200 dark:border-slate-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
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
                ${a}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
            <input
              type="number"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setAmount(null); }}
              className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              min={1}
            />
          </div>
        </div>
        <div className="flex-1 lg:max-w-md flex flex-col gap-6 lg:border-l lg:border-slate-200 dark:border-slate-700 lg:pl-10">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Complete Your Donation</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            You will be redirected to our secure payment partner to complete your donation of ${displayAmount} ({frequency.replace('-', ' ')}).
          </p>
          <a
            href="https://paystack.com/pay/ytopglobalpay/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Donate ${displayAmount} Securely
          </a>
          <p className="text-xs text-center text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            256-bit SSL Encrypted Payment
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Or <Link href="/contact" className="text-primary font-semibold hover:underline">contact us</Link> for bank transfer details.
          </p>
        </div>
      </div>
    </div>
  );
}
