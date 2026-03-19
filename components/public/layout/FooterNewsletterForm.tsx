'use client';

import { useState, type FormEvent } from 'react';

type SubmissionState =
  | { type: 'idle'; message: null }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };

const INITIAL_STATE: SubmissionState = {
  type: 'idle',
  message: null,
};

export default function FooterNewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>(INITIAL_STATE);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setSubmissionState({
        type: 'error',
        message: 'Enter your email address before subscribing.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionState(INITIAL_STATE);

    try {
      const response = await fetch('/api/forms/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null;

      if (!response.ok) {
        setSubmissionState({
          type: 'error',
          message:
            payload?.error || 'We could not subscribe you right now. Please try again.',
        });
        return;
      }

      setEmail('');
      setSubmissionState({
        type: 'success',
        message:
          payload?.message ||
          'Thanks for subscribing. Please check your email for confirmation.',
      });
    } catch {
      setSubmissionState({
        type: 'error',
        message: 'We could not subscribe you right now. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email"
          className="flex-1 px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm placeholder:text-gray-400 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-200"
          required
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all duration-200 text-sm font-semibold cursor-pointer transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Saving...' : 'Subscribe'}
        </button>
      </form>

      {submissionState.message ? (
        <p
          className={`mt-3 text-xs ${
            submissionState.type === 'success'
              ? 'text-emerald-300'
              : 'text-[#ffb4ab]'
          }`}
        >
          {submissionState.message}
        </p>
      ) : null}
    </div>
  );
}
