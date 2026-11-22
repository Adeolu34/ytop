import { randomUUID } from 'crypto';
import { getMongoDb } from '@/lib/mongodb';

const COLLECTION = 'testimonials';

export type MongoTestimonialDoc = {
  id: string;
  name: string;
  position: string | null;
  company: string | null;
  content: string;
  photo: { id: string; url: string; altText: string | null } | null;
  rating: number | null;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function mongoTestimonialsList(options: {
  featuredOnly: boolean;
  limit: number;
}): Promise<MongoTestimonialDoc[]> {
  const db = await getMongoDb();
  const filter: Record<string, unknown> = {};
  if (options.featuredOnly) filter.isFeatured = true;
  return db
    .collection<MongoTestimonialDoc>(COLLECTION)
    .find(filter)
    .sort({ order: 1 })
    .limit(options.limit)
    .toArray();
}

export async function mongoTestimonialsListAll(): Promise<MongoTestimonialDoc[]> {
  const db = await getMongoDb();
  return db
    .collection<MongoTestimonialDoc>(COLLECTION)
    .find({}, { projection: { _id: 0 } })
    .sort({ order: 1, createdAt: -1 })
    .limit(200)
    .toArray();
}

export async function mongoTestimonialFindById(id: string): Promise<MongoTestimonialDoc | null> {
  const db = await getMongoDb();
  return db
    .collection<MongoTestimonialDoc>(COLLECTION)
    .findOne({ id }, { projection: { _id: 0 } });
}

export type MongoTestimonialInput = {
  name: string;
  position: string | null;
  company: string | null;
  content: string;
  photoUrl: string | null;
  isFeatured: boolean;
  order: number;
};

export async function mongoTestimonialUpsert(
  id: string | null,
  input: MongoTestimonialInput
): Promise<string> {
  const db = await getMongoDb();
  const col = db.collection(COLLECTION);
  const now = new Date();
  const fields = {
    name: input.name,
    position: input.position,
    company: input.company,
    content: input.content,
    photo: input.photoUrl ? { id: '', url: input.photoUrl, altText: input.name } : null,
    isFeatured: input.isFeatured,
    order: input.order,
    updatedAt: now,
  };
  if (id) {
    await col.updateOne({ id }, { $set: fields });
    return id;
  }
  const newId = randomUUID();
  await col.insertOne({ id: newId, rating: null, createdAt: now, ...fields });
  return newId;
}

export async function mongoTestimonialDelete(id: string): Promise<void> {
  const db = await getMongoDb();
  await db.collection(COLLECTION).deleteOne({ id });
}
