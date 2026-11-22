'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';

type FormType = 'CONTACT' | 'VOLUNTEER' | 'PARTNERSHIP';

type Props = {
  formType?: FormType;
  /** Text shown above the fields (master copy form introductions). */
  intro?: string;
  /** Message shown after a successful submission (master copy). */
  confirmation: string;
  submitLabel?: string;
  /** Subject used when none is supplied through ?subject= in the URL. */
  defaultSubject?: string;
};

const fieldClass =
  'w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-primary';

export default function EnquiryForm({
  formType = 'CONTACT',
  intro,
  confirmation,
  submitLabel = 'Submit Enquiry',
  defaultSubject = '',
}: Props) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    organisation: '',
    subject: defaultSubject,
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Links such as /contact?subject=Monthly%20giving pre-fill the subject line.
  useEffect(() => {
    const subject = new URLSearchParams(window.location.search).get('subject');
    if (subject) {
      setValues((prev) => ({ ...prev, subject: subject.slice(0, 150) }));
    }
  }, []);

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (values.name.trim().length < 2) e.name = 'Please enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) e.email = 'Please enter a valid email address.';
    if (values.subject.trim().length < 5) e.subject = 'Please enter a subject of at least 5 characters.';
    if (values.message.trim().length < 10) e.message = 'Please write a message of at least 10 characters.';
    return e;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    setServerError(null);
    if (Object.keys(found).length > 0) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          organisation: values.organisation.trim() || undefined,
          subject: values.subject.trim(),
          message: values.message.trim(),
          formType,
        }),
      });
      if (response.ok) {
        setStatus('success');
        setValues({ name: '', email: '', organisation: '', subject: defaultSubject, message: '' });
      } else {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setServerError(payload?.error ?? null);
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  function set<K extends keyof typeof values>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  if (status === 'success') {
    return (
      <div role="status" className="p-6 bg-green-50 border border-green-200 text-green-800 rounded-xl">
        <p className="font-bold mb-1">Submitted</p>
        <p className="text-sm">{confirmation}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {intro ? <p className="text-slate-700">{intro}</p> : null}

      <div>
        <label htmlFor="enq-name" className="block text-sm font-bold text-slate-900 mb-2">Full name *</label>
        <input id="enq-name" type="text" autoComplete="name" value={values.name} onChange={(e) => set('name', e.target.value)} className={fieldClass} required />
        {errors.name ? <p className="text-primary text-sm mt-2 font-medium">{errors.name}</p> : null}
      </div>

      <div>
        <label htmlFor="enq-email" className="block text-sm font-bold text-slate-900 mb-2">Email address *</label>
        <input id="enq-email" type="email" autoComplete="email" value={values.email} onChange={(e) => set('email', e.target.value)} className={fieldClass} required />
        {errors.email ? <p className="text-primary text-sm mt-2 font-medium">{errors.email}</p> : null}
      </div>

      <div>
        <label htmlFor="enq-org" className="block text-sm font-bold text-slate-900 mb-2">Organisation, if applicable</label>
        <input id="enq-org" type="text" autoComplete="organization" value={values.organisation} onChange={(e) => set('organisation', e.target.value)} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="enq-subject" className="block text-sm font-bold text-slate-900 mb-2">Subject *</label>
        <input id="enq-subject" type="text" value={values.subject} onChange={(e) => set('subject', e.target.value)} className={fieldClass} required />
        {errors.subject ? <p className="text-primary text-sm mt-2 font-medium">{errors.subject}</p> : null}
      </div>

      <div>
        <label htmlFor="enq-message" className="block text-sm font-bold text-slate-900 mb-2">Message *</label>
        <textarea id="enq-message" rows={6} value={values.message} onChange={(e) => set('message', e.target.value)} className={`${fieldClass} resize-none`} required />
        {errors.message ? <p className="text-primary text-sm mt-2 font-medium">{errors.message}</p> : null}
      </div>

      {status === 'error' ? (
        <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm">
          {serverError ?? 'Something went wrong. Please try again, or email info@ytopglobal.org.'}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="group w-full px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary-hover hover:shadow-xl transition-all duration-300 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Sending...' : submitLabel}
        <Send className="w-5 h-5" aria-hidden />
      </button>
    </form>
  );
}
