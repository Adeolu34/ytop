import { randomUUID } from 'crypto';
import { getMongoDb } from '@/lib/mongodb';
import { mongoMediaFindById } from '@/lib/mongo-media';

const COLLECTION = 'team_members';

export type MongoTeamMemberDoc = {
  id: string;
  name: string;
  slug: string;
  position: string;
  bio: string | null;
  teamSection: string;
  order: number;
  isActive: boolean;
  photoId: string | null;
  photo: { id: string | null; url: string; altText: string | null } | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
  createdAt: Date;
  updatedAt: Date;
};

async function resolvePhoto(
  photoId: string | null
): Promise<MongoTeamMemberDoc['photo']> {
  if (!photoId) return null;
  const m = await mongoMediaFindById(photoId);
  if (!m) return null;
  return { id: m.id, url: m.url, altText: m.altText };
}

export async function mongoTeamSlugTaken(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const db = await getMongoDb();
  const q: Record<string, unknown> = { slug };
  if (excludeId) q.id = { $ne: excludeId };
  return (await db.collection(COLLECTION).countDocuments(q)) > 0;
}

export async function mongoTeamUniqueSlug(
  base: string,
  excludeId?: string
): Promise<string> {
  let slug = base || 'member';
  let n = 0;
  while (await mongoTeamSlugTaken(slug, excludeId)) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

export async function mongoTeamFindById(
  id: string
): Promise<MongoTeamMemberDoc | null> {
  const db = await getMongoDb();
  return db.collection<MongoTeamMemberDoc>(COLLECTION).findOne({ id });
}

export async function mongoTeamListForAdmin(): Promise<MongoTeamMemberDoc[]> {
  const db = await getMongoDb();
  return db
    .collection<MongoTeamMemberDoc>(COLLECTION)
    .find({})
    .sort({ teamSection: 1, order: 1, name: 1 })
    .toArray();
}

export async function mongoTeamUpsert(input: {
  id?: string;
  name: string;
  slug: string;
  position: string;
  teamSection: string;
  bio: string | null;
  photoId: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
  order: number;
  isActive: boolean;
}): Promise<void> {
  const now = new Date();
  const photo = await resolvePhoto(input.photoId);
  const id = input.id ?? randomUUID();
  const db = await getMongoDb();
  const col = db.collection<MongoTeamMemberDoc>(COLLECTION);

  const doc: MongoTeamMemberDoc = {
    id,
    name: input.name,
    slug: input.slug,
    position: input.position,
    bio: input.bio,
    teamSection: input.teamSection,
    order: input.order,
    isActive: input.isActive,
    photoId: input.photoId,
    photo,
    email: input.email,
    phone: input.phone,
    linkedin: input.linkedin,
    twitter: input.twitter,
    facebook: input.facebook,
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

export async function mongoTeamDelete(id: string): Promise<void> {
  const db = await getMongoDb();
  await db.collection(COLLECTION).deleteOne({ id });
}
