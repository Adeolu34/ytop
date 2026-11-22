import { randomUUID } from 'crypto';
import { getMongoDb } from '@/lib/mongodb';

const COLLECTION = 'donations';

export type MongoDonation = {
  id: string;
  /** Paystack transaction reference. Unique: a webhook retry must not record a gift twice. */
  reference: string;
  email: string | null;
  name: string | null;
  /** Amount in major units (naira, dollars). */
  amount: number;
  currency: string;
  frequency: 'once' | 'monthly';
  programme: string | null;
  campaignId: string | null;
  paidAt: Date;
  createdAt: Date;
};

export async function mongoDonationRecord(
  input: Omit<MongoDonation, 'id' | 'createdAt'>
): Promise<'created' | 'duplicate'> {
  const db = await getMongoDb();
  const res = await db.collection(COLLECTION).updateOne(
    { reference: input.reference },
    { $setOnInsert: { id: randomUUID(), createdAt: new Date(), ...input } },
    { upsert: true }
  );
  return res.upsertedCount > 0 ? 'created' : 'duplicate';
}

export async function mongoDonationsList(limit = 100): Promise<MongoDonation[]> {
  const db = await getMongoDb();
  return db
    .collection<MongoDonation>(COLLECTION)
    .find({}, { projection: { _id: 0 } })
    .sort({ paidAt: -1 })
    .limit(limit)
    .toArray();
}

export async function mongoDonationTotals(): Promise<Array<{ currency: string; total: number; count: number }>> {
  const db = await getMongoDb();
  const rows = await db
    .collection(COLLECTION)
    .aggregate<{ _id: string; total: number; count: number }>([
      { $group: { _id: '$currency', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ])
    .toArray();
  return rows.map((r) => ({ currency: r._id, total: r.total, count: r.count }));
}
