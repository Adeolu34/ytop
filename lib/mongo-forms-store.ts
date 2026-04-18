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
