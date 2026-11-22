'use client';

import { useState } from 'react';

export default function UnsubscribeForm({ email, token }: { email: string; token: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function confirm() {
    setState('loading');
    try {
      const res = await fetch('/api/forms/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      });
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      if (res.ok) {
        setState('done');
      } else {
        setMessage(body?.error ?? 'We could not update your subscription. Please try again.');
        setState('error');
      }
    } catch {
      setMessage('We could not update your subscription. Please try again.');
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-800">
        You have been unsubscribed. You will no longer receive updates from YTOP Global at {email}.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-6 text-lg text-slate-600">
        Stop sending YTOP Global updates to <strong>{email}</strong>?
      </p>
      <button
        type="button"
        onClick={confirm}
        disabled={state === 'loading'}
        className="rounded-full bg-primary px-8 py-3 font-bold text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {state === 'loading' ? 'Updating...' : 'Unsubscribe'}
      </button>
      {state === 'error' ? (
        <p role="alert" className="mt-4 text-sm text-red-700">{message}</p>
      ) : null}
    </div>
  );
}
