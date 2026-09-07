'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

type ImportResult = {
  message: string;
  inserted: number;
  updated: number;
  total: number;
  error?: string;
};

export default function WpImportButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<ImportResult | null>(null);

  async function handleImport() {
    if (!confirm('Pull posts from ytopglobal.org WordPress site? Existing posts (matched by slug) will be updated.')) return;
    setStatus('loading');
    setResult(null);
    try {
      const res = await fetch('/api/admin/import-wp', { method: 'POST' });
      const data = await res.json() as ImportResult;
      if (res.ok) {
        setStatus('done');
        setResult(data);
      } else {
        setStatus('error');
        setResult(data);
      }
    } catch {
      setStatus('error');
      setResult({ message: 'Network error', inserted: 0, updated: 0, total: 0 });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleImport}
        disabled={status === 'loading'}
        className="inline-flex items-center gap-2 rounded-md border border-[#e7bdb8]/40 bg-white px-4 py-2.5 text-sm font-semibold text-[#1b1c1c] transition-colors hover:bg-[#efeded] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'loading'
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <Download className="h-4 w-4" />}
        {status === 'loading' ? 'Importing…' : 'Import from ytopglobal.org'}
      </button>

      {result ? (
        <p className={`text-sm font-medium ${status === 'error' ? 'text-[#93000d]' : 'text-emerald-700'}`}>
          {result.message}
        </p>
      ) : null}
    </div>
  );
}
