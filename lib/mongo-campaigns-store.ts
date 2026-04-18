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
