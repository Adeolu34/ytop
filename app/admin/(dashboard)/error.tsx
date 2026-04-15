'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-24 pt-10 sm:px-8 lg:pt-16">
      <div className="admin-surface-card rounded-2xl border border-[#ffdad6] bg-[#fff8f7] p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-full bg-[#ffdad6] p-2 text-[#93000d]">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h1 className="admin-font-display text-2xl font-extrabold tracking-tight text-[#1b1c1c]">
            Admin page unavailable
          </h1>
        </div>

        <p className="text-sm leading-6 text-[#5d3f3c]">
          This admin section failed to load on the server. We are migrating the
          admin data layer to MongoDB and some modules may still rely on legacy
          database queries.
        </p>

        {error?.digest ? (
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#93000d]">
            Error digest: {error.digest}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-md bg-[#ba0013] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#93000d]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/yadmin"
            className="inline-flex items-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-[#1b1c1c] ring-1 ring-[#e7bdb8]/50 transition-colors hover:bg-[#f5f3f3]"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

