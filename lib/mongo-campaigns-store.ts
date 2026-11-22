import { randomUUID } from 'crypto';
import { getMongoDb } from '@/lib/mongodb';

const COLLECTION = 'campaigns';

export type MongoCampaignDoc = {
  id: string;
  title: string;
  slug: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  imageId: string | null;
  image: { id: string; url: string; altText: string | null } | null;
  /** Optional Paystack payment page for this campaign. */
  paymentUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function mongoCampaignsListActive(): Promise<MongoCampaignDoc[]> {
  const db = await getMongoDb();
  const now = new Date();
  return db
    .collection<MongoCampaignDoc>(COLLECTION)
    .find({
      isActive: true,
      endDate: { $gte: now },
    })
    .sort({ endDate: 1 })
    .toArray();
}

export async function mongoCampaignsListAll(): Promise<MongoCampaignDoc[]> {
  const db = await getMongoDb();
  return db
    .collection<MongoCampaignDoc>(COLLECTION)
    .find({}, { projection: { _id: 0 } })
    .sort({ endDate: -1 })
    .limit(200)
    .toArray();
}

export async function mongoCampaignFindById(id: string): Promise<MongoCampaignDoc | null> {
  const db = await getMongoDb();
  return db
    .collection<MongoCampaignDoc>(COLLECTION)
    .findOne({ id }, { projection: { _id: 0 } });
}

export type MongoCampaignInput = {
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  imageUrl: string | null;
  paymentUrl: string | null;
};

export async function mongoCampaignUpsert(
  id: string | null,
  input: MongoCampaignInput
): Promise<string> {
  const db = await getMongoDb();
  const col = db.collection(COLLECTION);
  const now = new Date();
  const fields = {
    title: input.title,
    description: input.description,
    goalAmount: input.goalAmount,
    raisedAmount: input.raisedAmount,
    currency: input.currency,
    startDate: input.startDate,
    endDate: input.endDate,
    isActive: input.isActive,
    paymentUrl: input.paymentUrl,
    image: input.imageUrl ? { id: '', url: input.imageUrl, altText: input.title } : null,
    updatedAt: now,
  };
  if (id) {
    await col.updateOne({ id }, { $set: fields });
    return id;
  }
  const newId = randomUUID();
  const slug = `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'campaign'}-${newId.slice(0, 6)}`;
  await col.insertOne({ id: newId, slug, imageId: null, createdAt: now, ...fields });
  return newId;
}

export async function mongoCampaignDelete(id: string): Promise<void> {
  const db = await getMongoDb();
  await db.collection(COLLECTION).deleteOne({ id });
}

/**
 * Adds a confirmed gift to a campaign's raised amount. Only applies when the gift currency matches
 * the campaign currency, so a dollar gift is never added to a naira total.
 */
export async function mongoCampaignAddRaised(
  campaignId: string,
  amount: number,
  currency: string
): Promise<boolean> {
  const db = await getMongoDb();
  const res = await db
    .collection(COLLECTION)
    .updateOne(
      { id: campaignId, currency },
      { $inc: { raisedAmount: amount }, $set: { updatedAt: new Date() } }
    );
  return res.matchedCount > 0;
}
