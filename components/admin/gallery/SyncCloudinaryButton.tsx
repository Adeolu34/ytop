'use client';

import { useState } from 'react';
import { Cloud, Loader2 } from 'lucide-react';

type SyncResult = { message: string; synced: number; skipped: number; total: number; error?: string };

export default function SyncCloudinaryButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<SyncResult | null>(null);

  async function handleSync() {
    if (!confirm('Sync images from the YTOP Cloudinary folder into the media library? New images will be added; existing ones are skipped.')) return;
    setStatus('loading');
    setResult(null);
    try {
      const res = await fetch('/api/admin/sync-cloudinary', { method: 'POST' });
      const data = await res.json() as SyncResult;
      if (res.ok) {
        setStatus('done');
        setResult(data);
      } else {
        setStatus('error');
        setResult({ message: data.error ?? 'Sync failed', synced: 0, skipped: 0, total: 0 });
      }
    } catch {
      setStatus('error');
      setResult({ message: 'Network error', synced: 0, skipped: 0, total: 0 });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleSync}
        disabled={status === 'loading'}
        className="inline-flex items-center gap-2 rounded-md border border-[#e7bdb8]/40 bg-white px-4 py-2.5 text-sm font-semibold text-[#1b1c1c] transition-colors hover:bg-[#efeded] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'loading'
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <Cloud className="h-4 w-4" />}
        {status === 'loading' ? 'Syncing…' : 'Sync from Cloudinary'}
      </button>
      {result ? (
        <p className={`text-sm font-medium ${status === 'error' ? 'text-[#93000d]' : 'text-emerald-700'}`}>
          {result.message}
        </p>
      ) : null}
    </div>
  );
}
