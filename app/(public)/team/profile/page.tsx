'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Upload, Loader2, ArrowLeft } from 'lucide-react';

const SECTIONS = [
  { value: 'core', label: 'Core Team' },
  { value: 'faculty', label: 'Faculty & Mentor' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'community', label: 'Community Member' },
];

export default function TeamProfilePage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Photo must be under 5 MB.');
      return;
    }
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch('/api/forms/team-profile', { method: 'POST', body: data });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="size-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Profile Submitted!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Thank you! Your profile has been received and will appear on the team page once reviewed by our admin team.
          </p>
          <Link
            href="/team"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition"
          >
            <ArrowLeft className="w-4 h-4" />
            View Team Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            YTOP Global Team
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Submit Your Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Fill in your details and upload a photo. Your profile will be reviewed and added to the team page.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6"
        >
          {/* Photo upload */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative size-28 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 overflow-hidden cursor-pointer hover:border-primary transition"
              onClick={() => fileRef.current?.click()}
            >
              {photoPreview ? (
                <Image src={photoPreview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Photo</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              name="photo"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-sm text-primary font-semibold hover:underline"
            >
              {photoPreview ? 'Change photo' : 'Upload a photo'}
            </button>
            <p className="text-xs text-slate-400">JPG, PNG or WebP · max 5 MB</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name <span className="text-primary">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Ekundayo Oluwadamilare"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Role / Position <span className="text-primary">*</span>
            </label>
            <input
              name="position"
              type="text"
              required
              placeholder="e.g. Program Director"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          {/* Team Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Team Section <span className="text-primary">*</span>
            </label>
            <select
              name="teamSection"
              defaultValue="core"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            >
              {SECTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Short Bio
            </label>
            <textarea
              name="bio"
              rows={4}
              placeholder="Tell us a little about yourself, your background and what you do at YTOP..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          {/* Socials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                LinkedIn URL
              </label>
              <input
                name="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Twitter / X Handle
              </label>
              <input
                name="twitter"
                type="text"
                placeholder="@yourhandle"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Error */}
          {errorMsg && (
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              {errorMsg}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-4 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-bold rounded-full shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
          >
            {status === 'submitting' ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</>
            ) : (
              'Submit My Profile'
            )}
          </button>

          <p className="text-xs text-center text-slate-400">
            Your profile will be reviewed before appearing on the team page.
          </p>
        </form>
      </div>
    </div>
  );
}
