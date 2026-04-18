import { NextResponse } from 'next/server';
import type { Db } from 'mongodb';
import { isMongoConfigured } from '@/lib/mongodb';

const SERVICE_UNAVAILABLE = NextResponse.json(
  {
    error: 'Service unavailable',
    message: 'MongoDB is not configured. Set MONGODB_URI for this API.',
  },
  { status: 503 }
);

export async function getMongoDbOr503(): Promise<
  { ok: true; db: Db } | { ok: false; response: NextResponse }
> {
  if (!isMongoConfigured()) {
    return { ok: false, response: SERVICE_UNAVAILABLE };
  }
  const { getMongoDb } = await import('@/lib/mongodb');
  const db = await getMongoDb();
  return { ok: true, db };
}
