import { randomUUID } from 'crypto';
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
  /** Speakers and facilitators (free text), shown on the public Events page. */
  speakers?: string | null;
  /** Relevant programme name (free text), shown on the public Events page. */
  programmeName?: string | null;
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

export async function mongoEventsListAll(): Promise<MongoEventDoc[]> {
  const db = await getMongoDb();
  return db
    .collection<MongoEventDoc>(COLLECTION)
    .find({}, { projection: { _id: 0 } })
    .sort({ startDate: -1 })
    .limit(200)
    .toArray();
}

export async function mongoEventFindById(id: string): Promise<MongoEventDoc | null> {
  const db = await getMongoDb();
  return db
    .collection<MongoEventDoc>(COLLECTION)
    .findOne({ id }, { projection: { _id: 0 } });
}

export type MongoEventInput = {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  isOnline: boolean;
  registrationUrl: string | null;
  imageUrl: string | null;
  maxParticipants: number | null;
  speakers: string | null;
  programmeName: string | null;
};

function buildEventImage(input: MongoEventInput): MongoEventDoc['image'] {
  return input.imageUrl ? { id: '', url: input.imageUrl, altText: input.title } : null;
}

export async function mongoEventUpsert(id: string | null, input: MongoEventInput): Promise<string> {
  const db = await getMongoDb();
  const col = db.collection(COLLECTION);
  const now = new Date();
  const fields = {
    title: input.title,
    description: input.description,
    startDate: input.startDate,
    endDate: input.endDate,
    location: input.location,
    isOnline: input.isOnline,
    registrationUrl: input.registrationUrl,
    maxParticipants: input.maxParticipants,
    speakers: input.speakers,
    programmeName: input.programmeName,
    image: buildEventImage(input),
    updatedAt: now,
  };
  if (id) {
    await col.updateOne({ id }, { $set: fields });
    return id;
  }
  const newId = randomUUID();
  const slug = `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'event'}-${newId.slice(0, 6)}`;
  await col.insertOne({
    id: newId,
    slug,
    galleryImageIds: [],
    programId: null,
    imageId: null,
    createdAt: now,
    ...fields,
  });
  return newId;
}

export async function mongoEventDelete(id: string): Promise<void> {
  const db = await getMongoDb();
  await db.collection(COLLECTION).deleteOne({ id });
}
