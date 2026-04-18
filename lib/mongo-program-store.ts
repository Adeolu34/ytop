import { randomUUID } from 'crypto';
import { getMongoDb } from '@/lib/mongodb';
import { mongoMediaFindById } from '@/lib/mongo-media';

const COLLECTION = 'programs';

export type MongoProgramDoc = {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  imageId: string | null;
  image: { id: string | null; url: string; altText: string | null } | null;
  sdgGoals: string[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

async function resolveImage(imageId: string | null): Promise<MongoProgramDoc['image']> {
  if (!imageId) return null;
  const m = await mongoMediaFindById(imageId);
  if (!m) return null;
  return { id: m.id, url: m.url, altText: m.altText };
}

export async function mongoProgramSlugTaken(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const db = await getMongoDb();
  const q: Record<string, unknown> = { slug };
  if (excludeId) q.id = { $ne: excludeId };
  return (await db.collection(COLLECTION).countDocuments(q)) > 0;
}

export async function mongoProgramUniqueSlug(
  base: string,
  excludeId?: string
): Promise<string> {
  let slug = base || 'program';
  let n = 0;
  while (await mongoProgramSlugTaken(slug, excludeId)) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

export async function mongoProgramFindById(
  id: string
): Promise<MongoProgramDoc | null> {
  const db = await getMongoDb();
  return db.collection<MongoProgramDoc>(COLLECTION).findOne({ id });
}

export async function mongoProgramListForAdmin(): Promise<MongoProgramDoc[]> {
  const db = await getMongoDb();
  return db
    .collection<MongoProgramDoc>(COLLECTION)
    .find({})
    .sort({ order: 1, title: 1 })
    .toArray();
}

export async function mongoProgramUpsert(input: {
  id?: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  imageId: string | null;
  sdgGoals: string[];
  order: number;
  isActive: boolean;
}): Promise<void> {
  const now = new Date();
  const image = await resolveImage(input.imageId);
  const id = input.id ?? randomUUID();
  const db = await getMongoDb();
  const col = db.collection<MongoProgramDoc>(COLLECTION);

  const doc: MongoProgramDoc = {
    id,
    title: input.title,
    slug: input.slug,
    description: input.description,
    shortDesc: input.shortDesc,
    imageId: input.imageId,
    image,
    sdgGoals: input.sdgGoals,
    order: input.order,
    isActive: input.isActive,
    createdAt: now,
    updatedAt: now,
  };

  if (input.id) {
    const existing = await col.findOne({ id: input.id });
    await col.updateOne(
      { id: input.id },
      {
        $set: {
          ...doc,
          createdAt: existing?.createdAt ?? now,
        },
      }
    );
  } else {
    await col.insertOne(doc);
  }
}

export async function mongoProgramDelete(id: string): Promise<void> {
  const db = await getMongoDb();
  await db.collection(COLLECTION).deleteOne({ id });
}
