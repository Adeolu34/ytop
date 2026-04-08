/**
 * Public blog reads from MongoDB when PUBLIC_BLOG_SOURCE=mongodb and MONGODB_URI is set.
 * Admin continues to use PostgreSQL (Prisma); saving a post syncs published content to Mongo.
 */
import type { Prisma } from '@/app/generated/prisma';
import { isDatabaseConfigured } from '@/lib/db-config';
import prisma, { getPrisma } from '@/lib/db';
import { getMongoDb, isMongoConfigured } from '@/lib/mongodb';

const COLLECTION = 'blog_posts';

export function useMongoForPublicBlog(): boolean {
  return (
    process.env.PUBLIC_BLOG_SOURCE?.toLowerCase().trim() === 'mongodb' &&
    isMongoConfigured()
  );
}

export type MongoBlogAuthor = {
  name: string | null;
  image: string | null;
  bio: string | null;
  email: string | null;
};

export type MongoBlogCategory = {
  id: string;
  name: string;
  slug: string;
};

export type MongoBlogTag = {
  id: string;
  name: string;
  slug: string;
};

export type MongoBlogFeaturedImage = {
  url: string;
  altText: string | null;
  caption: string | null;
} | null;

export type MongoBlogDocument = {
  sourcePostId: string;
  /** Prisma User id — used for API shape parity */
  authorId: string;
  featuredImageId: string | null;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  status: string;
  publishedAt: Date | null;
  viewCount: number;
  author: MongoBlogAuthor;
  categories: MongoBlogCategory[];
  tags: MongoBlogTag[];
  featuredImage: MongoBlogFeaturedImage;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: Date;
};

const syncInclude = {
  author: {
    select: { name: true, image: true, bio: true, email: true },
  },
  categories: { select: { id: true, name: true, slug: true } },
  tags: { select: { id: true, name: true, slug: true } },
  featuredImage: { select: { url: true, altText: true, caption: true } },
} as const;

type PostForSync = Prisma.PostGetPayload<{ include: typeof syncInclude }>;

export async function syncPostToMongoById(postId: string): Promise<void> {
  if (!useMongoForPublicBlog()) return;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: syncInclude,
  });

  if (!post) return;

  const db = await getMongoDb();
  const col = db.collection<MongoBlogDocument>(COLLECTION);

  if (post.status !== 'PUBLISHED') {
    await col.deleteOne({ sourcePostId: post.id });
    return;
  }

  const doc: MongoBlogDocument = {
    sourcePostId: post.id,
    authorId: post.authorId,
    featuredImageId: post.featuredImageId,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    status: post.status,
    publishedAt: post.publishedAt,
    viewCount: post.viewCount,
    author: {
      name: post.author?.name ?? null,
      image: post.author?.image ?? null,
      bio: post.author?.bio ?? null,
      email: post.author?.email ?? null,
    },
    categories: post.categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    })),
    tags: post.tags.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
    })),
    featuredImage: post.featuredImage
      ? {
          url: post.featuredImage.url,
          altText: post.featuredImage.altText,
          caption: post.featuredImage.caption,
        }
      : null,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    updatedAt: new Date(),
  };

  await col.updateOne(
    { sourcePostId: post.id },
    { $set: doc },
    { upsert: true }
  );
}

export async function removeBlogPostFromMongo(sourcePostId: string): Promise<void> {
  if (!useMongoForPublicBlog()) return;
  const db = await getMongoDb();
  await db.collection(COLLECTION).deleteOne({ sourcePostId });
}

function buildPublishedPostsFilter(options: {
  categorySlug?: string;
  tagSlug?: string;
  searchQuery?: string;
}): Record<string, unknown> {
  const { categorySlug, tagSlug, searchQuery } = options;
  const filter: Record<string, unknown> = { status: 'PUBLISHED' };
  if (categorySlug) {
    filter.categories = { $elemMatch: { slug: categorySlug } };
  }
  if (tagSlug) {
    filter.tags = { $elemMatch: { slug: tagSlug } };
  }
  const q = searchQuery?.trim();
  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: regex }, { content: regex }, { excerpt: regex }];
  }
  return filter;
}

/** Full documents for /api/posts (same filters as listing). */
export async function mongoListPublishedPostDocuments(options: {
  page: number;
  limit: number;
  categorySlug?: string;
  tagSlug?: string;
  searchQuery?: string;
}): Promise<{ documents: MongoBlogDocument[]; total: number }> {
  const { page, limit, categorySlug, tagSlug, searchQuery } = options;
  const filter = buildPublishedPostsFilter({
    categorySlug,
    tagSlug,
    searchQuery,
  });
  const db = await getMongoDb();
  const col = db.collection<MongoBlogDocument>(COLLECTION);
  const [total, documents] = await Promise.all([
    col.countDocuments(filter),
    col
      .find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
  ]);
  return { documents, total };
}

/** List published posts for /blog listing (shape aligned with Prisma-powered UI). */
export async function mongoListPublishedPosts(options: {
  page: number;
  limit: number;
  categorySlug?: string;
  tagSlug?: string;
  searchQuery?: string;
}): Promise<{
  posts: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    publishedAt: Date | null;
    author: { name: string | null; image: string | null };
    categories: { name: string; slug: string }[];
    featuredImage: {
      id: string;
      url: string;
      altText: string | null;
    } | null;
  }>;
  total: number;
  totalPublished: number;
}> {
  const { page, limit, categorySlug, tagSlug, searchQuery } = options;
  const db = await getMongoDb();
  const col = db.collection<MongoBlogDocument>(COLLECTION);

  const baseFilter = buildPublishedPostsFilter({
    categorySlug,
    tagSlug,
    searchQuery,
  });

  const [total, totalPublished, items] = await Promise.all([
    col.countDocuments(baseFilter),
    col.countDocuments({ status: 'PUBLISHED' }),
    col
      .find(baseFilter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
  ]);

  const posts = items.map((p) => ({
    id: p.sourcePostId,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    author: {
      name: p.author.name,
      image: p.author.image,
    },
    categories: p.categories.map((c) => ({ name: c.name, slug: c.slug })),
    featuredImage: p.featuredImage
      ? {
          id: p.featuredImageId ?? p.sourcePostId,
          url: p.featuredImage.url,
          altText: p.featuredImage.altText,
        }
      : null,
  }));

  return { posts, total, totalPublished };
}

export async function mongoAggregateCategories(): Promise<
  Array<{
    id: string;
    name: string;
    slug: string;
    description: null;
    createdAt: Date;
    updatedAt: Date;
    _count: { posts: number };
  }>
> {
  const db = await getMongoDb();
  const col = db.collection<MongoBlogDocument>(COLLECTION);
  const rows = await col
    .aggregate([
      { $match: { status: 'PUBLISHED' } },
      { $unwind: '$categories' },
      {
        $group: {
          _id: '$categories.slug',
          name: { $first: '$categories.name' },
          count: { $sum: 1 },
        },
      },
      { $sort: { name: 1 } },
    ])
    .toArray();

  const now = new Date();
  return rows.map((r) => ({
    id: r._id as string,
    name: r.name as string,
    slug: r._id as string,
    description: null,
    createdAt: now,
    updatedAt: now,
    _count: { posts: r.count as number },
  }));
}

export async function mongoFindPostBySlug(
  slug: string
): Promise<MongoBlogDocument | null> {
  const db = await getMongoDb();
  const col = db.collection<MongoBlogDocument>(COLLECTION);
  const doc = await col.findOne({ slug, status: 'PUBLISHED' });
  return doc;
}

export async function mongoIncrementViewCount(slug: string): Promise<void> {
  const db = await getMongoDb();
  await db
    .collection(COLLECTION)
    .updateOne({ slug, status: 'PUBLISHED' }, { $inc: { viewCount: 1 } });
}

export async function mongoFindRelatedPosts(
  excludeSourcePostId: string,
  categorySlugs: string[],
  take: number
): Promise<
  Array<{
    id: string;
    slug: string;
    title: string;
    categories: { name: string; slug: string }[];
    featuredImage: { url: string; altText: string | null } | null;
  }>
> {
  const db = await getMongoDb();
  const col = db.collection<MongoBlogDocument>(COLLECTION);

  const filter: Record<string, unknown> = {
    status: 'PUBLISHED',
    sourcePostId: { $ne: excludeSourcePostId },
  };
  if (categorySlugs.length > 0) {
    filter['categories.slug'] = { $in: categorySlugs };
  }

  const items = await col
    .find(filter)
    .sort({ publishedAt: -1 })
    .limit(take)
    .toArray();

  return items.map((p) => ({
    id: p.sourcePostId,
    slug: p.slug,
    title: p.title,
    categories: p.categories.map((c) => ({ name: c.name, slug: c.slug })),
    featuredImage: p.featuredImage
      ? { url: p.featuredImage.url, altText: p.featuredImage.altText }
      : null,
  }));
}

export async function mongoListAllPublishedSlugs(): Promise<string[]> {
  const db = await getMongoDb();
  const col = db.collection<MongoBlogDocument>(COLLECTION);
  const rows = await col
    .find({ status: 'PUBLISHED' }, { projection: { slug: 1 } })
    .toArray();
  return rows.map((r) => r.slug);
}

export async function mongoListPostsForSitemap(): Promise<
  Array<{ slug: string; updatedAt: Date }>
> {
  const db = await getMongoDb();
  const col = db.collection<MongoBlogDocument>(COLLECTION);
  const rows = await col
    .find(
      { status: 'PUBLISHED' },
      { projection: { slug: 1, updatedAt: 1 } }
    )
    .toArray();
  return rows.map((r) => ({
    slug: r.slug,
    updatedAt: r.updatedAt ?? new Date(),
  }));
}

export async function mongoSearchPosts(
  query: string,
  limit: number
): Promise<
  Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    publishedAt: Date | null;
    featuredImage: { url: string; altText: string | null } | null;
  }>
> {
  const db = await getMongoDb();
  const col = db.collection<MongoBlogDocument>(COLLECTION);
  const q = query.trim();
  if (!q) return [];

  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const items = await col
    .find({
      status: 'PUBLISHED',
      $or: [{ title: regex }, { content: regex }, { excerpt: regex }],
    })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .toArray();

  return items.map((p) => ({
    id: p.sourcePostId,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    featuredImage: p.featuredImage
      ? { url: p.featuredImage.url, altText: p.featuredImage.altText }
      : null,
  }));
}

/** Map Mongo blog document to the shape returned by GET /api/posts (Prisma parity). */
export function mongoBlogDocumentToApiListPost(doc: MongoBlogDocument) {
  return {
    id: doc.sourcePostId,
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    content: doc.content,
    publishedAt: doc.publishedAt,
    viewCount: doc.viewCount,
    author: {
      id: doc.authorId,
      name: doc.author.name,
      email: doc.author.email,
      image: doc.author.image,
    },
    categories: doc.categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    })),
    tags: doc.tags.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
    })),
    featuredImage: doc.featuredImage
      ? {
          id: doc.featuredImageId ?? '',
          url: doc.featuredImage.url,
          altText: doc.featuredImage.altText,
          width: null,
          height: null,
        }
      : null,
  };
}

/** Same comment tree as Prisma `postInclude.comments` for /blog/[slug]. */
async function loadApprovedCommentsForPost(postId: string) {
  if (!isDatabaseConfigured()) {
    return [];
  }
  return getPrisma().comment.findMany({
    where: {
      postId,
      isApproved: true,
      parentId: null,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      replies: {
        where: {
          isApproved: true,
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });
}

/**
 * Published post body from Mongo + comments from PostgreSQL + related from Mongo.
 * Increments view count on Mongo (best-effort).
 */
export async function loadMongoBlogPostWithRelations(slug: string): Promise<{
  post: {
    id: string;
    authorId: string;
    featuredImageId: string | null;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    publishedAt: Date | null;
    viewCount: number;
    author: MongoBlogAuthor;
    categories: MongoBlogCategory[];
    tags: MongoBlogTag[];
    featuredImage: MongoBlogFeaturedImage;
    metaTitle: string | null;
    metaDescription: string | null;
    comments: Awaited<ReturnType<typeof loadApprovedCommentsForPost>>;
  };
  relatedPosts: Awaited<ReturnType<typeof mongoFindRelatedPosts>>;
} | null> {
  const doc = await mongoFindPostBySlug(slug);
  if (!doc) return null;

  const [comments, relatedPosts] = await Promise.all([
    loadApprovedCommentsForPost(doc.sourcePostId),
    mongoFindRelatedPosts(
      doc.sourcePostId,
      doc.categories.map((c) => c.slug),
      3
    ),
  ]);

  void mongoIncrementViewCount(slug).catch(() => {});

  return {
    post: {
      id: doc.sourcePostId,
      authorId: doc.authorId,
      featuredImageId: doc.featuredImageId,
      slug: doc.slug,
      title: doc.title,
      excerpt: doc.excerpt,
      content: doc.content,
      publishedAt: doc.publishedAt,
      viewCount: doc.viewCount,
      author: doc.author,
      categories: doc.categories,
      tags: doc.tags,
      featuredImage: doc.featuredImage,
      metaTitle: doc.metaTitle,
      metaDescription: doc.metaDescription,
      comments,
    },
    relatedPosts,
  };
}

/** Initial bulk sync: all published posts from Prisma → Mongo. */
export async function syncAllPublishedPostsToMongo(): Promise<number> {
  if (!useMongoForPublicBlog()) {
    throw new Error('Set PUBLIC_BLOG_SOURCE=mongodb and MONGODB_URI first.');
  }
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true },
  });
  for (const p of posts) {
    await syncPostToMongoById(p.id);
  }
  return posts.length;
}
