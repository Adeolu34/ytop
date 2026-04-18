import { randomUUID } from 'crypto';
import { getMongoDb } from '@/lib/mongodb';
import type { UserRoleValue } from '@/lib/admin-crud';
import { BLOG_POSTS_COLLECTION } from '@/lib/mongo-posts-store';
export type MongoUserDoc = {
  id: string;
  email: string;
  name: string | null;
  hashedPassword: string | null;
  role: string;
  image: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function mongoUsersListAuthorsForPosts(): Promise<
  Array<{ id: string; name: string | null; email: string; role: string }>
> {
  const db = await getMongoDb();
  const rows = await db
    .collection<MongoUserDoc>('users')
    .find({ role: { $in: ['ADMIN', 'EDITOR', 'AUTHOR'] } })
    .sort({ role: 1, name: 1 })
    .project({ id: 1, name: 1, email: 1, role: 1 })
    .toArray();
  return rows as Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
  }>;
}

export async function mongoUsersListForAdmin(): Promise<MongoUserDoc[]> {
  const db = await getMongoDb();
  return db
    .collection<MongoUserDoc>('users')
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

export async function mongoUserFindById(
  id: string
): Promise<MongoUserDoc | null> {
  const db = await getMongoDb();
  return db.collection<MongoUserDoc>('users').findOne({ id });
}

export async function mongoUserFindByEmail(
  email: string
): Promise<MongoUserDoc | null> {
  const db = await getMongoDb();
  return db
    .collection<MongoUserDoc>('users')
    .findOne({ email: email.trim().toLowerCase() });
}

export async function mongoUserUpdate(
  id: string,
  patch: Partial<
    Pick<
      MongoUserDoc,
      'name' | 'email' | 'role' | 'bio' | 'image' | 'hashedPassword'
    >
  >
): Promise<void> {
  const db = await getMongoDb();
  await db
    .collection('users')
    .updateOne({ id }, { $set: { ...patch, updatedAt: new Date() } });
}

export async function mongoUserInsert(input: {
  name: string | null;
  email: string;
  role: UserRoleValue;
  bio: string | null;
  image: string | null;
  hashedPassword: string | null;
}): Promise<string> {
  const id = randomUUID();
  const now = new Date();
  const db = await getMongoDb();
  await db.collection('users').insertOne({
    id,
    email: input.email.trim().toLowerCase(),
    name: input.name,
    role: input.role,
    bio: input.bio,
    image: input.image,
    hashedPassword: input.hashedPassword,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function mongoUserDelete(id: string): Promise<void> {
  const db = await getMongoDb();
  await db.collection('users').deleteOne({ id });
}

export async function mongoUserContentCounts(userId: string): Promise<{
  posts: number;
  pages: number;
  comments: number;
  mediaUploads: number;
}> {
  const db = await getMongoDb();
  const [posts, pages, comments, mediaUploads] = await Promise.all([
    db.collection(BLOG_POSTS_COLLECTION).countDocuments({ authorId: userId }),
    db.collection('cms_pages').countDocuments({ authorId: userId }),
    db.collection('blog_comments').countDocuments({ authorId: userId }),
    db.collection('cms_media').countDocuments({ uploadedById: userId }),
  ]);
  return { posts, pages, comments, mediaUploads };
}
