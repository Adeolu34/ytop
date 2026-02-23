'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Public route error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
        <p className="text-slate-600 mb-4">
          A server-side error occurred. This is often due to a missing or invalid database connection.
        </p>
        {process.env.NODE_ENV === 'development' && error?.message && (
          <pre className="text-left text-sm bg-slate-100 p-4 rounded-lg overflow-auto max-h-40 text-red-700 mb-6">
            {error.message}
          </pre>
        )}
        {error?.digest && (
          <p className="text-xs text-slate-400 mb-4">Digest: {error.digest}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-ytop-blue text-white font-semibold rounded-xl hover:bg-ytop-blue-hover"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200"
          >
            Go home
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          If this keeps happening, check that <code className="bg-slate-100 px-1 rounded">DATABASE_URL</code> is set in <code className="bg-slate-100 px-1 rounded">.env</code> and the database is running.
        </p>
      </div>
    </div>
  );
}
