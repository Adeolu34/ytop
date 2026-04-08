import { NextResponse } from 'next/server';
import type { PrismaClient } from '@/app/generated/prisma';
import { getPostgresConnectionString } from '@/lib/db-config';

const SERVICE_UNAVAILABLE = NextResponse.json(
  {
    error: 'Service unavailable',
    message:
      'PostgreSQL is not configured. Set DATABASE_URL or NETLIFY_DATABASE_URL for this API.',
  },
  { status: 503 }
);

/**
 * Loads Prisma only when `DATABASE_URL` / `NETLIFY_DATABASE_URL` is set.
 * Avoids throwing from `lib/db` during Netlify/serverless cold starts when Postgres is omitted.
 */
export async function getPrismaOr503(): Promise<
  | { ok: true; prisma: PrismaClient }
  | { ok: false; response: NextResponse }
> {
  if (!getPostgresConnectionString()) {
    return { ok: false, response: SERVICE_UNAVAILABLE };
  }
  const { default: prisma } = await import('@/lib/db');
  return { ok: true, prisma };
}
