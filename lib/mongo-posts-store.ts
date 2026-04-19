import { randomUUID } from 'crypto';
import { getMongoDb } from '@/lib/mongodb';
import { slugifyValue } from '@/lib/admin-crud';
import type { PostDraft } from '@/lib/admin-crud';
import { mongoMediaFindById } from '@/lib/mongo-media';
import type {
  MongoBlogAuthor,
  MongoBlogCategory,
  MongoBlogDocument,
  MongoBlogFeaturedImage,
  MongoBlogTag,
} from '@/lib/mongo-blog';

export const BLOG_POSTS_COLLECTION = 'blog_posts';

/**
 * ID for admin routes and forms (`/posts/[postId]/edit` loads by sourcePostId).
 * Older or imported docs may only have `sourcePostId`; `id` is optional.
 */
export function mongoPostAdminEditorId(doc: {
  id?: string | null;
  sourcePostId?: string | null;
}): string {
  const raw = doc.id ?? doc.sourcePostId ?? '';
  return typeof raw === 'string' ? raw.trim() : '';
}

/**
 * Use in href path segments. IDs like `wp:5160` contain `:` which breaks many
 * CDNs/proxies if left raw; encode so `/posts/wp%3A5160/edit` is reliable.
 */
export function mongoPostIdInAdminPathSegment(id: string): string {
  return encodeURIComponent(id);
}

/** Decode `[postId]` from the URL (Next usually decodes once; this is safe if already decoded). */
export function mongoPostIdFromAdminPathSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

type BlogPostWrite = MongoBlogDocument & {
  id: string;
  emailNotifiedAt?: Date | null;
  metaKeywords?: string | null;
  createdAt?: Date;
};

async function loadAuthorBlock(authorId: string): Promise<MongoBlogAuthor> {
  const db = await getMongoDb();
  const u = await db
    .collection<{
      id: string;
      name?: string | null;
      image?: string | null;
      bio?: string | null;
      email?: string | null;
    }>('users')
    .findOne({ id: authorId });
  if (!u) {
    return {
      name: 'Unknown',
      image: null,
      bio: null,
      email: null,
    };
  }
  return {
    name: u.name ?? null,
    image: u.image ?? null,
    bio: u.bio ?? null,
    email: u.email ?? null,
  };
}

async function resolveFeatured(
  featuredImageId: string | null
): Promise<{
  featuredImageId: string | null;
  featuredImage: MongoBlogFeaturedImage;
}> {
  if (!featuredImageId) {
    return { featuredImageId: null, featuredImage: null };
  }
  const media = await mongoMediaFindById(featuredImageId);
  if (!media) {
    return { featuredImageId: null, featuredImage: null };
  }
  return {
    featuredImageId: media.id,
    featuredImage: {
      url: media.url,
      altText: media.altText,
      caption: media.caption,
    },
  };
}

function taxonomyFromNames(names: string[]): MongoBlogCategory[] {
  return names.map((name) => {
    const trimmed = name.trim();
    return {
      id: randomUUID(),
      name: trimmed,
      slug: slugifyValue(trimmed),
    };
  });
}

function tagsFromNames(names: string[]): MongoBlogTag[] {
  return names.map((name) => {
    const trimmed = name.trim();
    return {
      id: randomUUID(),
      name: trimmed,
      slug: slugifyValue(trimmed),
    };
  });
}

export async function mongoPostSlugTaken(
  slug: string,
  excludeSourcePostId: string | null
): Promise<boolean> {
  const db = await getMongoDb();
  const filter: Record<string, unknown> = { slug };
  if (excludeSourcePostId) {
    filter.sourcePostId = { $ne: excludeSourcePostId };
  }
  const n = await db.collection(BLOG_POSTS_COLLECTION).countDocuments(filter);
  return n > 0;
}

export async function mongoCreateUniquePostSlug(
  baseSlug: string,
  excludeSourcePostId: string | null
): Promise<string> {
  let attempt = 1;
  let candidate = baseSlug;
  while (await mongoPostSlugTaken(candidate, excludeSourcePostId)) {
    attempt += 1;
    candidate = `${baseSlug}-${attempt}`;
  }
  return candidate;
}

export async function mongoPostFindBySourceId(
  sourcePostId: string
): Promise<BlogPostWrite | null> {
  const db = await getMongoDb();
  return db.collection<BlogPostWrite>(BLOG_POSTS_COLLECTION).findOne({
    sourcePostId,
  });
}

export async function mongoPostFindBySlugAnyStatus(
  slug: string
): Promise<BlogPostWrite | null> {
  const db = await getMongoDb();
  return db.collection<BlogPostWrite>(BLOG_POSTS_COLLECTION).findOne({ slug });
}

export async function mongoPostInsertFromDraft(input: {
  draft: PostDraft;
  slug: string;
  sourcePostId: string;
}): Promise<void> {
  const { draft, slug, sourcePostId } = input;
  const now = new Date();
  const [author, featured] = await Promise.all([
    loadAuthorBlock(draft.authorId),
    resolveFeatured(draft.featuredImageId),
  ]);

  const doc: BlogPostWrite = {
    id: sourcePostId,
    sourcePostId,
    authorId: draft.authorId,
    featuredImageId: featured.featuredImageId,
    slug,
    title: draft.title,
    excerpt: draft.excerpt,
    content: draft.content,
    status: draft.status,
    publishedAt: draft.publishedAt,
    viewCount: 0,
    author,
    categories: taxonomyFromNames(draft.categoryNames),
    tags: tagsFromNames(draft.tagNames),
    featuredImage: featured.featuredImage,
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    metaKeywords: draft.metaKeywords,
    emailNotifiedAt: null,
    updatedAt: now,
    createdAt: now,
  };

  const db = await getMongoDb();
  await db.collection(BLOG_POSTS_COLLECTION).insertOne(doc);
}

export async function mongoPostUpdateFromDraft(input: {
  sourcePostId: string;
  draft: PostDraft;
  slug: string;
}): Promise<void> {
  const { sourcePostId, draft, slug } = input;
  const now = new Date();
  const [author, featured] = await Promise.all([
    loadAuthorBlock(draft.authorId),
    resolveFeatured(draft.featuredImageId),
  ]);

  const doc: Partial<BlogPostWrite> = {
    id: sourcePostId,
    authorId: draft.authorId,
    featuredImageId: featured.featuredImageId,
    slug,
    title: draft.title,
    excerpt: draft.excerpt,
    content: draft.content,
    status: draft.status,
    publishedAt: draft.publishedAt,
    author,
    categories: taxonomyFromNames(draft.categoryNames),
    tags: tagsFromNames(draft.tagNames),
    featuredImage: featured.featuredImage,
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    metaKeywords: draft.metaKeywords,
    updatedAt: now,
  };

  const db = await getMongoDb();
  await db
    .collection(BLOG_POSTS_COLLECTION)
    .updateOne({ sourcePostId }, { $set: doc });
}

export async function mongoPostDelete(sourcePostId: string): Promise<void> {
  const db = await getMongoDb();
  await db.collection(BLOG_POSTS_COLLECTION).deleteOne({ sourcePostId });
}

export async function mongoPostSetEmailNotifiedAt(
  sourcePostId: string,
  at: Date
): Promise<void> {
  const db = await getMongoDb();
  await db
    .collection(BLOG_POSTS_COLLECTION)
    .updateOne(
      { sourcePostId },
      { $set: { emailNotifiedAt: at, updatedAt: new Date() } }
    );
}

export async function mongoPostUpdateStatus(input: {
  sourcePostId: string;
  status: string;
  publishedAt: Date | null;
}): Promise<void> {
  const db = await getMongoDb();
  await db.collection(BLOG_POSTS_COLLECTION).updateOne(
    { sourcePostId: input.sourcePostId },
    {
      $set: {
        status: input.status,
        publishedAt: input.publishedAt,
        updatedAt: new Date(),
      },
    }
  );
}

/** Map stored doc to PostEditorForm + admin list shapes */
export function mongoPostToEditorShape(doc: BlogPostWrite) {
  return {
    id: doc.sourcePostId,
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    content: doc.content,
    status: doc.status,
    authorId: doc.authorId,
    categories: doc.categories.map((c) => ({ name: c.name })),
    tags: doc.tags.map((t) => ({ name: t.name })),
    featuredImageId: doc.featuredImageId ?? '',
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    metaKeywords: doc.metaKeywords ?? '',
    publishedAt: doc.publishedAt,
    emailNotifiedAt: doc.emailNotifiedAt ?? null,
  };
}
