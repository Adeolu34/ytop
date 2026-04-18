import { getMongoDb } from '@/lib/mongodb';

const COLLECTION = 'events';

export type MongoEventDoc = {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  isOnline: boolean;
  registrationUrl: string | null;
  galleryImageIds: string[];
  programId: string | null;
  imageId?: string | null;
  image?: { id: string; url: string; altText: string | null } | null;
  maxParticipants: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function mongoEventsList(options: {
  type: 'upcoming' | 'past';
  limit: number;
}): Promise<MongoEventDoc[]> {
  const db = await getMongoDb();
  const col = db.collection<MongoEventDoc>(COLLECTION);
  const now = new Date();
  const filter =
    options.type === 'upcoming'
      ? { startDate: { $gte: now } }
      : { startDate: { $lt: now } };
  const sort =
    options.type === 'upcoming'
      ? ({ startDate: 1 } as const)
      : ({ startDate: -1 } as const);
  return col.find(filter).sort(sort).limit(options.limit).toArray();
}
