import { randomUUID } from 'crypto';
import { getMongoDb } from '@/lib/mongodb';

const COLLECTION = 'blog_comments';

export type MongoCommentDoc = {
  id: string;
  postId: string;
  postSlug: string;
  content: string;
  authorId: string | null;
  authorName: string | null;
  authorEmail: string | null;
  parentId: string | null;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type AuthorLite = { name: string | null; image: string | null };

async function resolveAuthor(
  authorId: string | null
): Promise<AuthorLite | null> {
  if (!authorId) return null;
  const db = await getMongoDb();
  const u = await db
    .collection<{ name?: string | null; image?: string | null }>('users')
    .findOne({ id: authorId }, { projection: { name: 1, image: 1 } });
  if (!u) return null;
  return { name: u.name ?? null, image: u.image ?? null };
}

/** Shape expected by BlogPostArticle / CommentSection */
export type CommentWithReplies = {
  id: string;
  content: string;
  authorName: string | null;
  createdAt: Date;
  author: AuthorLite | null;
  replies: Array<{
    id: string;
    content: string;
    authorName: string | null;
    createdAt: Date;
    author: AuthorLite | null;
  }>;
};

export async function mongoListApprovedCommentsForPost(
  postId: string
): Promise<CommentWithReplies[]> {
  const db = await getMongoDb();
  const col = db.collection<MongoCommentDoc>(COLLECTION);
  const roots = await col
    .find({ postId, parentId: null, isApproved: true })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  const out: CommentWithReplies[] = [];
  for (const root of roots) {
    const replies = await col
      .find({
        postId,
        parentId: root.id,
        isApproved: true,
      })
      .sort({ createdAt: 1 })
      .toArray();

    const [rootAuthor, replyAuthors] = await Promise.all([
      resolveAuthor(root.authorId),
      Promise.all(replies.map((r) => resolveAuthor(r.authorId))),
    ]);

    out.push({
      id: root.id,
      content: root.content,
      authorName: root.authorName,
      createdAt: root.createdAt,
      author: rootAuthor,
      replies: replies.map((r, i) => ({
        id: r.id,
        content: r.content,
        authorName: r.authorName,
        createdAt: r.createdAt,
        author: replyAuthors[i],
      })),
    });
  }
  return out;
}

export async function mongoCommentFindById(
  id: string
): Promise<MongoCommentDoc | null> {
  const db = await getMongoDb();
  return db.collection<MongoCommentDoc>(COLLECTION).findOne({ id });
}

export async function mongoCommentApprove(id: string): Promise<void> {
  const db = await getMongoDb();
  await db
    .collection(COLLECTION)
    .updateOne({ id }, { $set: { isApproved: true, updatedAt: new Date() } });
}

export async function mongoCommentDelete(id: string): Promise<void> {
  const db = await getMongoDb();
  const col = db.collection<MongoCommentDoc>(COLLECTION);
  await col.deleteMany({ $or: [{ id }, { parentId: id }] });
}

export async function mongoCommentInsert(doc: {
  postId: string;
  postSlug: string;
  content: string;
  authorId?: string | null;
  authorName?: string | null;
  authorEmail?: string | null;
  parentId?: string | null;
  isApproved?: boolean;
}): Promise<string> {
  const id = randomUUID();
  const now = new Date();
  const db = await getMongoDb();
  await db.collection(COLLECTION).insertOne({
    id,
    postId: doc.postId,
    postSlug: doc.postSlug,
    content: doc.content,
    authorId: doc.authorId ?? null,
    authorName: doc.authorName ?? null,
    authorEmail: doc.authorEmail ?? null,
    parentId: doc.parentId ?? null,
    isApproved: doc.isApproved ?? false,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function mongoCommentCountsForPost(postId: string): Promise<{
  total: number;
  pending: number;
}> {
  const db = await getMongoDb();
  const col = db.collection<MongoCommentDoc>(COLLECTION);
  const [total, pending] = await Promise.all([
    col.countDocuments({ postId }),
    col.countDocuments({ postId, isApproved: false }),
  ]);
  return { total, pending };
}

export async function mongoCommentsEnsureIndexes(): Promise<void> {
  const db = await getMongoDb();
  const col = db.collection(COLLECTION);
  await col.createIndex({ id: 1 }, { unique: true });
  await col.createIndex({ postId: 1, parentId: 1 });
  await col.createIndex({ postSlug: 1 });
}
