'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center px-4 bg-slate-100 font-sans">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Application error</h1>
          <p className="text-slate-600 mb-4">
            A server-side exception has occurred. Check the terminal or server logs for details.
          </p>
          {process.env.NODE_ENV === 'development' && error?.message && (
            <pre className="text-left text-sm bg-red-50 p-4 rounded-lg overflow-auto max-h-48 text-red-800 mb-6 whitespace-pre-wrap">
              {error.message}
            </pre>
          )}
          {error?.digest && (
            <p className="text-xs text-slate-400 mb-4">Digest: {error.digest}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
