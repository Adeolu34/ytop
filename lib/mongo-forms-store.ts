import { randomUUID } from 'crypto';
import { getMongoDb } from '@/lib/mongodb';

const COLLECTION = 'form_submissions';

export type FormType =
  | 'CONTACT'
  | 'VOLUNTEER'
  | 'NEWSLETTER'
  | 'DONATION'
  | 'PARTNERSHIP'
  | 'OTHER';

export type MongoFormSubmission = {
  id: string;
  type: FormType;
  name: string | null;
  email: string | null;
  phone: string | null;
  data: Record<string, unknown>;
  isRead: boolean;
  isProcessed: boolean;
  notes: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function mongoFormSubmissionInsert(input: {
  type: FormType;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  data: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<string> {
  const now = new Date();
  const id = randomUUID();
  const db = await getMongoDb();
  await db.collection(COLLECTION).insertOne({
    id,
    type: input.type,
    name: input.name ?? null,
    email: input.email?.trim().toLowerCase() ?? null,
    phone: input.phone ?? null,
    data: input.data,
    isRead: false,
    isProcessed: false,
    notes: null,
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function mongoNewsletterEmailExists(email: string): Promise<boolean> {
  const db = await getMongoDb();
  const n = await db.collection(COLLECTION).countDocuments({
    type: 'NEWSLETTER',
    email: email.trim().toLowerCase(),
  });
  return n > 0;
}

/**
 * Upsert a newsletter subscription atomically to avoid race-condition duplicates.
 * Returns 'created' if new, 'exists' if already subscribed.
 */
export async function mongoNewsletterUpsert(input: {
  email: string;
  name?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<{ status: 'created' | 'exists'; id: string }> {
  const now = new Date();
  const normalizedEmail = input.email.trim().toLowerCase();
  const newId = randomUUID();
  const db = await getMongoDb();

  const result = await db.collection(COLLECTION).updateOne(
    { type: 'NEWSLETTER', email: normalizedEmail },
    {
      $setOnInsert: {
        id: newId,
        type: 'NEWSLETTER' as FormType,
        name: input.name ?? null,
        email: normalizedEmail,
        phone: null,
        data: { subscribedAt: now.toISOString() },
        isRead: false,
        isProcessed: false,
        notes: null,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true }
  );

  if (result.upsertedCount > 0) {
    return { status: 'created', id: newId };
  }
  // Already existed — fetch its id for the response
  const existing = await db
    .collection<MongoFormSubmission>(COLLECTION)
    .findOne({ type: 'NEWSLETTER', email: normalizedEmail }, { projection: { id: 1 } });
  return { status: 'exists', id: existing?.id ?? '' };
}

export async function mongoNewsletterSubscriberEmails(): Promise<string[]> {
  const db = await getMongoDb();
  const rows = await db
    .collection<MongoFormSubmission>(COLLECTION)
    .find({ type: 'NEWSLETTER', email: { $ne: null } })
    .project({ email: 1 })
    .toArray();
  const set = new Set<string>();
  for (const r of rows) {
    const e = r.email?.trim().toLowerCase();
    if (e) set.add(e);
  }
  return [...set];
}
