/**
 * Import WordPress posts into MongoDB `blog_posts` (one-time or repeat pull from WP REST API).
 *
 * Posts become first-class YTOP records: stable UUID `sourcePostId`, your Mongo `authorId`,
 * public URLs are `/blog/{slug}` on this site. Optional HTML URL rewrite so old absolute
 * WP links in body copy point at your deployed domain.
 *
 * Required in .env:
 *   WORDPRESS_URL=https://ytopglobal.org
 *   WORDPRESS_USERNAME=your_wp_username
 *   WORDPRESS_APPLICATION_PASSWORD=xxxx xxxx xxxx xxxx (or WORDPRESS_APP_PASSWORD)
 *   MONGODB_URI=...
 * Optional:
 *   MONGODB_DB=ytopglobal
 *   WP_IMPORT_ALL_STATUSES=1   // default imports only published posts
 *   IMPORT_DEFAULT_AUTHOR_ID=<users.id>   // else first ADMIN/EDITOR/AUTHOR in Mongo is used
 *   IMPORT_URL_REWRITE_TO=https://ytopglobal.org   // replace WORDPRESS_URL in imported HTML (same as NEXT_PUBLIC_SITE_URL if unset)
 *
 * Usage:
 *   npm run import-posts-wp-mongo
 */

import { randomUUID } from "crypto";
import "dotenv/config";
import { MongoClient, type Db } from "mongodb";
import type { MongoBlogDocument } from "../lib/mongo-blog";

const WP_URL = (process.env.WORDPRESS_URL || process.env.WP_URL || "").replace(/\/$/, "");
const WP_USER = process.env.WORDPRESS_USERNAME || process.env.WP_USERNAME || "";
const WP_APP_PASSWORD =
  process.env.WORDPRESS_APPLICATION_PASSWORD ||
  process.env.WORDPRESS_APP_PASSWORD ||
  process.env.WP_APPLICATION_PASSWORD ||
  process.env.APPLICATION_PASSWORD ||
  "";

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DB = process.env.MONGODB_DB || "";
const IMPORT_ALL_STATUSES = process.env.WP_IMPORT_ALL_STATUSES === "1";

const IMPORT_URL_TO = (
  process.env.IMPORT_URL_REWRITE_TO ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  ""
).replace(/\/$/, "");

if (!WP_URL || !WP_APP_PASSWORD) {
  console.error("\nMissing WordPress env. Set:");
  console.error("  WORDPRESS_URL=https://yoursite.com");
  console.error("  WORDPRESS_USERNAME=your_wp_username");
  console.error("  WORDPRESS_APPLICATION_PASSWORD=xxxx xxxx xxxx xxxx (or WORDPRESS_APP_PASSWORD)\n");
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error("\nMissing Mongo env. Set MONGODB_URI (and optionally MONGODB_DB).\n");
  process.exit(1);
}

const authHeader =
  "Basic " + Buffer.from(`${WP_USER || "admin"}:${WP_APP_PASSWORD.replace(/\s/g, "")}`).toString("base64");

type WPPost = {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; mime_type?: string; alt_text?: string }>;
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>;
    author?: Array<{ id: number; name?: string; email?: string; avatar_urls?: Record<string, string> }>;
  };
  yoast_head_json?: { title?: string; description?: string };
};

type WPMedia = { source_url: string; mime_type?: string; alt_text?: string };

function stripHtml(html: string): string {
  return (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/** Point imported absolute links at your live site instead of the WP origin. */
function rewriteImportedHtml(html: string): string {
  if (!html || !IMPORT_URL_TO || !WP_URL || IMPORT_URL_TO === WP_URL) return html;
  return html.split(WP_URL).join(IMPORT_URL_TO);
}

async function resolveDefaultAuthorId(db: Db): Promise<string> {
  const fromEnv = process.env.IMPORT_DEFAULT_AUTHOR_ID?.trim();
  if (fromEnv) return fromEnv;
  const user = await db
    .collection<{ id: string }>("users")
    .findOne(
      { role: { $in: ["ADMIN", "EDITOR", "AUTHOR"] } },
      { sort: { createdAt: 1 }, projection: { id: 1 } }
    );
  if (user?.id) return user.id;
  throw new Error(
    "No Mongo user found for authorId. Create an admin/editor user, or set IMPORT_DEFAULT_AUTHOR_ID to a users.id value."
  );
}

async function wpFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(path, WP_URL);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`WP API ${res.status}: ${res.statusText} - ${url.toString()}`);
  }
  return res.json() as Promise<T>;
}

async function getAllWpPosts(): Promise<WPPost[]> {
  const out: WPPost[] = [];
  let page = 1;
  while (true) {
    const params: Record<string, string> = {
      per_page: "100",
      page: String(page),
      _embed: "1",
      status: IMPORT_ALL_STATUSES ? "any" : "publish",
    };
    const rows = await wpFetch<WPPost[]>("/wp-json/wp/v2/posts", params);
    if (!rows.length) break;
    out.push(...rows);
    if (rows.length < 100) break;
    page += 1;
  }
  return out;
}

async function getFeaturedImage(post: WPPost): Promise<{ url: string; altText: string | null }> {
  const embedded = post._embedded?.["wp:featuredmedia"]?.[0];
  if (embedded?.source_url) {
    return {
      url: embedded.source_url,
      altText: embedded.alt_text || null,
    };
  }
  if (!post.featured_media) return { url: "", altText: null };
  try {
    const media = await wpFetch<WPMedia>(`/wp-json/wp/v2/media/${post.featured_media}`);
    return {
      url: media?.source_url || "",
      altText: media.alt_text || null,
    };
  } catch {
    return { url: "", altText: null };
  }
}

type BlogPostDoc = MongoBlogDocument & { id: string; createdAt: Date };

function toMongoDoc(
  post: WPPost,
  featured: { url: string; altText: string | null },
  opts: { sourcePostId: string; authorId: string; createdAt: Date }
): BlogPostDoc {
  const terms = post._embedded?.["wp:term"] || [];
  const wpCategories = terms[0] || [];
  const wpTags = terms[1] || [];
  const wpAuthor = post._embedded?.author?.[0];

  const published = post.status === "publish";
  const title = stripHtml(post.title?.rendered || "Untitled");
  const rawContent = post.content?.rendered || "";
  const rawExcerpt = post.excerpt?.rendered || "";
  const excerptPlain = stripHtml(rewriteImportedHtml(rawExcerpt));

  return {
    id: opts.sourcePostId,
    sourcePostId: opts.sourcePostId,
    authorId: opts.authorId,
    featuredImageId: null,
    slug: post.slug,
    title,
    excerpt: excerptPlain || null,
    content: rewriteImportedHtml(rawContent),
    status: published ? "PUBLISHED" : "DRAFT",
    publishedAt: published ? new Date(post.date) : null,
    viewCount: 0,
    author: {
      name: wpAuthor?.name || "YTOP Global",
      image: wpAuthor?.avatar_urls?.["96"] || null,
      bio: null,
      email: wpAuthor?.email || null,
    },
    categories: wpCategories
      .filter((c) => c?.slug && c?.name)
      .map((c) => ({ id: randomUUID(), name: c.name, slug: c.slug })),
    tags: wpTags
      .filter((t) => t?.slug && t?.name)
      .map((t) => ({ id: randomUUID(), name: t.name, slug: t.slug })),
    featuredImage: featured.url
      ? {
          url: rewriteImportedHtml(featured.url),
          altText: featured.altText || title,
          caption: null,
        }
      : null,
    metaTitle: post.yoast_head_json?.title || null,
    metaDescription: post.yoast_head_json?.description || null,
    updatedAt: new Date(post.modified || post.date),
    createdAt: opts.createdAt,
  };
}

async function main() {
  console.log(`\nFetching posts from ${WP_URL} (WordPress REST API) …`);
  const wpPosts = await getAllWpPosts();
  console.log(`Fetched ${wpPosts.length} post(s).`);

  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  await client.connect();
  const db = MONGODB_DB ? client.db(MONGODB_DB) : client.db();
  const col = db.collection<BlogPostDoc>("blog_posts");

  const authorId = await resolveDefaultAuthorId(db);
  console.log(`Using Mongo authorId: ${authorId}`);
  if (IMPORT_URL_TO && IMPORT_URL_TO !== WP_URL) {
    console.log(`Rewriting imported HTML URLs: ${WP_URL} → ${IMPORT_URL_TO}`);
  }

  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ sourcePostId: 1 }, { unique: true });
  await col.createIndex({ status: 1, publishedAt: -1 });

  let upserts = 0;
  for (const post of wpPosts) {
    const featured = await getFeaturedImage(post);
    const existing = await col.findOne(
      { slug: post.slug },
      { projection: { sourcePostId: 1, createdAt: 1 } }
    );
    const sourcePostId = existing?.sourcePostId ?? randomUUID();
    const createdAt = existing?.createdAt ?? new Date();
    const doc = toMongoDoc(post, featured, { sourcePostId, authorId, createdAt });
    await col.updateOne({ slug: doc.slug }, { $set: doc }, { upsert: true });
    upserts += 1;
  }

  const publishedCount = await col.countDocuments({ status: "PUBLISHED" });
  console.log(`Upserted ${upserts} post(s) by slug into blog_posts.`);
  console.log(`Published posts available for /blog: ${publishedCount}`);
  console.log(
    "Each post uses a native sourcePostId (UUID). Public URLs are /blog/<slug> on this app.\n"
  );

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
