import { randomUUID } from 'crypto';
import { getMongoDb } from '@/lib/mongodb';

const COLLECTION = 'cms_pages';

export type MongoPageDoc = {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: string;
  authorId: string;
  metaTitle: string | null;
  metaDescription: string | null;
  parentId: string | null;
  order: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type MongoPageWithRelations = MongoPageDoc & {
  author: { id: string; name: string | null; email: string | null } | null;
  parent: { id: string; title: string; slug: string } | null;
  children: Array<{ id: string; title: string; slug: string; order: number }>;
};

export async function mongoPageFindPublishedBySlug(
  slug: string
): Promise<MongoPageWithRelations | null> {
  const db = await getMongoDb();
  const col = db.collection<MongoPageDoc>(COLLECTION);
  const page = await col.findOne({ slug, status: 'PUBLISHED' });
  if (!page) return null;

  const users = db.collection<{
    id: string;
    name?: string | null;
    email?: string | null;
  }>('users');
  const author = await users.findOne(
    { id: page.authorId },
    { projection: { id: 1, name: 1, email: 1 } }
  );

  let parent: { id: string; title: string; slug: string } | null = null;
  if (page.parentId) {
    const p = await col.findOne(
      { id: page.parentId },
      { projection: { id: 1, title: 1, slug: 1 } }
    );
    if (p) parent = { id: p.id, title: p.title, slug: p.slug };
  }

  const childDocs = await col
    .find(
      { parentId: page.id, status: 'PUBLISHED' },
      { projection: { id: 1, title: 1, slug: 1, order: 1 } }
    )
    .sort({ order: 1 })
    .toArray();

  return {
    ...page,
    author: author
      ? {
          id: author.id,
          name: author.name ?? null,
          email: author.email ?? null,
        }
      : null,
    parent,
    children: childDocs.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      order: c.order,
    })),
  };
}

export async function mongoPageSearchPublished(
  query: string,
  limit: number
): Promise<
  Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
  }>
> {
  const q = query.trim();
  if (!q) return [];
  const db = await getMongoDb();
  const col = db.collection<MongoPageDoc>(COLLECTION);
  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const rows = await col
    .find({
      status: 'PUBLISHED',
      $or: [{ title: regex }, { content: regex }],
    })
    .limit(limit)
    .toArray();
  return rows.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.metaDescription ?? p.content.replace(/<[^>]+>/g, '').slice(0, 200),
  }));
}

export async function mongoPageInsert(doc: Omit<MongoPageDoc, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<string> {
  const id = doc.id ?? randomUUID();
  const now = new Date();
  const db = await getMongoDb();
  await db.collection(COLLECTION).insertOne({
    ...doc,
    id,
    createdAt: now,
    updatedAt: now,
  } as MongoPageDoc);
  return id;
}
