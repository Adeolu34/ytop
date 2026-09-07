'use client';

import { useState } from 'react';
import { Check, Link as LinkIcon, Loader2, Users } from 'lucide-react';

export default function TeamAdminActions() {
  const [seedStatus, setSeedStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [seedMessage, setSeedMessage] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleSeed() {
    if (!confirm('Seed all hardcoded team members into the database? Existing names are skipped.')) return;
    setSeedStatus('loading');
    setSeedMessage('');
    try {
      const res = await fetch('/api/admin/seed-team', { method: 'POST' });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) {
        setSeedStatus('done');
        setSeedMessage(data.message ?? 'Done');
      } else {
        setSeedStatus('error');
        setSeedMessage(data.error ?? 'Seed failed');
      }
    } catch {
      setSeedStatus('error');
      setSeedMessage('Network error — check console');
    }
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/team/profile`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleSeed}
        disabled={seedStatus === 'loading'}
        className="inline-flex items-center gap-2 rounded-lg border border-[#e7d6d4] bg-white px-4 py-2.5 text-sm font-semibold text-[#1b1c1c] transition-colors hover:bg-[#efeded] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {seedStatus === 'loading'
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <Users className="h-4 w-4" />}
        Seed team members
      </button>

      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 rounded-lg border border-[#e7d6d4] bg-white px-4 py-2.5 text-sm font-semibold text-[#1b1c1c] transition-colors hover:bg-[#efeded]"
      >
        {copied
          ? <Check className="h-4 w-4 text-emerald-600" />
          : <LinkIcon className="h-4 w-4" />}
        {copied ? 'Link copied!' : 'Copy profile form link'}
      </button>

      {seedMessage ? (
        <p className={`text-sm font-medium ${seedStatus === 'error' ? 'text-[#93000d]' : 'text-emerald-700'}`}>
          {seedMessage}
        </p>
      ) : null}
    </div>
  );
}
