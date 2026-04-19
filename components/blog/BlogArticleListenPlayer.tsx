'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Headphones, Pause, Play, Square } from 'lucide-react';

function htmlToPlainText(html: string): string {
  if (typeof window === 'undefined') return '';
  const el = document.createElement('div');
  el.innerHTML = html;
  return (el.textContent || el.innerText || '')
    .replace(/\s+/g, ' ')
    .trim();
}

type ListenState = 'idle' | 'playing' | 'paused';

export default function BlogArticleListenPlayer({
  title,
  htmlContent,
}: {
  title: string;
  htmlContent: string;
}) {
  const [state, setState] = useState<ListenState>('idle');
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(
      typeof window !== 'undefined' && 'speechSynthesis' in window
    );
  }, []);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setState('idle');
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(() => {
    if (!supported || typeof window === 'undefined') return;
    const syn = window.speechSynthesis;

    if (syn.paused) {
      syn.resume();
      setState('playing');
      return;
    }

    const body = htmlToPlainText(htmlContent);
    const text = `${title}. ${body}`.slice(0, 95000);

    syn.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.95;
    u.pitch = 1;
    u.onend = () => {
      utteranceRef.current = null;
      setState('idle');
    };
    u.onerror = () => {
      utteranceRef.current = null;
      setState('idle');
    };

    utteranceRef.current = u;
    syn.speak(u);
    setState('playing');
  }, [htmlContent, title, supported]);

  const pause = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
    setState('paused');
  }, []);

  if (!supported) {
    return (
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Listen mode is not available in this browser.
      </p>
    );
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm dark:border-slate-600/60 dark:bg-slate-900/80"
      role="region"
      aria-label="Listen to article"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ba0013]/15 to-[#1E3A8A]/15 text-[#ba0013] dark:from-red-500/20 dark:to-blue-500/20">
        <Headphones className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Listen
        </p>
        <p className="truncate text-xs text-slate-600 dark:text-slate-300">
          Play this article aloud
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        {state === 'playing' ? (
          <button
            type="button"
            onClick={pause}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-slate-900 px-3 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <Pause className="h-4 w-4" />
            Pause
          </button>
        ) : (
          <button
            type="button"
            onClick={speak}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#ba0013] to-[#e31e24] px-4 text-xs font-bold text-white shadow-md shadow-[#ba0013]/25 transition hover:brightness-110"
          >
            <Play className="h-4 w-4 fill-current" />
            {state === 'paused' ? 'Resume' : 'Play'}
          </button>
        )}
        {(state === 'playing' || state === 'paused') && (
          <button
            type="button"
            onClick={stop}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-label="Stop playback"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
          </button>
        )}
      </div>
    </div>
  );
}
