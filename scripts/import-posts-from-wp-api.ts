/**
 * Import blog posts from WordPress REST API using Application Password.
 * Ensures featured image URL is always imported (from _embed or by fetching media by ID).
 *
 * Required in .env:
 *   WORDPRESS_URL=https://ytopglobal.org
 *   WORDPRESS_USERNAME=your_wp_username
 *   WORDPRESS_APPLICATION_PASSWORD=xxxx xxxx xxxx xxxx
 *   (or WORDPRESS_APP_PASSWORD)
 *
 * Optional: REIMPORT_POSTS=1 to update existing posts (slug match) with latest content and featured image.
 *
 * Usage: npm run import-posts-wp
 *        REIMPORT_POSTS=1 npm run import-posts-wp   (reimport / update existing)
 */

import 'dotenv/config';
import prisma from '../lib/db';

const WP_URL = (process.env.WORDPRESS_URL || process.env.WP_URL || '').replace(/\/$/, '');
const WP_USER = process.env.WORDPRESS_USERNAME || process.env.WP_USERNAME || '';
const WP_APP_PASSWORD = process.env.WORDPRESS_APPLICATION_PASSWORD || process.env.WORDPRESS_APP_PASSWORD || process.env.WP_APPLICATION_PASSWORD || process.env.APPLICATION_PASSWORD || '';
const REIMPORT = process.env.REIMPORT_POSTS === '1' || process.argv.includes('--reimport');

if (!WP_URL || !WP_APP_PASSWORD) {
  console.error('\nMissing env. Set in .env:');
  console.error('  WORDPRESS_URL=https://yoursite.com');
  console.error('  WORDPRESS_USERNAME=your_wp_username');
  console.error('  WORDPRESS_APPLICATION_PASSWORD=xxxx xxxx xxxx xxxx (or WORDPRESS_APP_PASSWORD)\n');
  process.exit(1);
}

const authHeader = 'Basic ' + Buffer.from(`${WP_USER || 'admin'}:${WP_APP_PASSWORD.replace(/\s/g, '')}`).toString('base64');

function stripHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function wpFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(path, WP_URL);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`WP API ${res.status}: ${res.statusText} – ${url.toString()}`);
  }
  return res.json() as Promise<T>;
}

async function getAllPages<T>(endpoint: string, perPage = 100, extraParams?: Record<string, string>): Promise<T[]> {
  const out: T[] = [];
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const params: Record<string, string> = { per_page: String(perPage), page: String(page), _embed: '1', ...extraParams };
    const list = await wpFetch<T[]>(endpoint, params);
    const arr = Array.isArray(list) ? list : [];
    out.push(...arr);
    hasMore = arr.length === perPage;
    page++;
  }
  return out;
}

type WPPost = {
  id: number;
  date: string;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; mime_type?: string; alt_text?: string }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
  yoast_head_json?: { title?: string; description?: string; keywords?: string };
};

type WPMedia = { source_url: string; mime_type?: string; alt_text?: string };

type WPCategory = { id: number; name: string; slug: string };
type WPTag = { id: number; name: string; slug: string };

/** Get featured image URL: from _embedded first, else fetch by featured_media ID so we always import the link. */
async function getFeaturedImageUrl(p: WPPost): Promise<{ source_url: string; mime_type?: string; alt_text?: string } | null> {
  const embedded = p._embedded?.['wp:featuredmedia']?.[0];
  if (embedded?.source_url) return embedded;
  if (p.featured_media <= 0) return null;
  try {
    const media = await wpFetch<WPMedia>(`/wp-json/wp/v2/media/${p.featured_media}`);
    if (media?.source_url) return media;
  } catch {
    // ignore – no featured image for this post
  }
  return null;
}

async function main() {
  console.log('\nFetching from WordPress:', WP_URL);
  console.log('');

  // 1) Get or create author user
  let authorId: string;
  const existingUser = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
  if (existingUser) {
    authorId = existingUser.id;
    console.log('Using existing author:', existingUser.name || existingUser.email);
  } else {
    const user = await prisma.user.create({
      data: {
        email: 'blog@ytopglobal.org',
        name: 'YTOP Blog',
        role: 'AUTHOR',
      },
    });
    authorId = user.id;
    console.log('Created author user: blog@ytopglobal.org');
  }

  // 2) Fetch categories and tags from WP
  let wpCategories: WPCategory[] = [];
  let wpTags: WPTag[] = [];
  try {
    wpCategories = await wpFetch<WPCategory[]>('/wp-json/wp/v2/categories', { per_page: '100' });
    wpTags = await wpFetch<WPTag[]>('/wp-json/wp/v2/tags', { per_page: '100' });
    console.log('Fetched', wpCategories.length, 'categories,', wpTags.length, 'tags');
  } catch (e) {
    console.warn('Could not fetch categories/tags:', (e as Error).message);
  }

  const categoryBySlug = new Map<string, string>();
  const tagBySlug = new Map<string, string>();

  for (const c of wpCategories) {
    if (c.slug === 'uncategorized') continue;
    const existing = await prisma.category.findUnique({ where: { slug: c.slug } });
    if (existing) {
      categoryBySlug.set(c.slug, existing.id);
    } else {
      const created = await prisma.category.create({
        data: { name: c.name, slug: c.slug },
      });
      categoryBySlug.set(c.slug, created.id);
    }
  }
  for (const t of wpTags) {
    const existing = await prisma.tag.findUnique({ where: { slug: t.slug } });
    if (existing) {
      tagBySlug.set(t.slug, existing.id);
    } else {
      const created = await prisma.tag.create({
        data: { name: t.name, slug: t.slug },
      });
      tagBySlug.set(t.slug, created.id);
    }
  }

  // 3) Fetch all posts (status=any so we get published, draft, pending, private when using app password)
  const wpPosts = await getAllPages<WPPost>('/wp-json/wp/v2/posts', 100, { status: 'any' });
  console.log('Fetched', wpPosts.length, 'posts from WordPress');
  if (REIMPORT) console.log('Reimport mode: will update existing posts (slug match) with latest content and featured image.\n');
  else console.log('');

  if (wpPosts.length === 0) {
    console.log('No posts returned. Check WORDPRESS_URL and application password.\n');
    await prisma.$disconnect();
    process.exit(0);
    return;
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const p of wpPosts) {
    try {
      const existing = await prisma.post.findUnique({ where: { slug: p.slug } });
      if (existing && !REIMPORT) {
        skipped++;
        continue;
      }

      const title = stripHtml(p.title?.rendered || 'Untitled');
      const content = p.content?.rendered || '';
      const excerpt = p.excerpt?.rendered ? stripHtml(p.excerpt.rendered) : null;
      const status = p.status === 'publish' ? 'PUBLISHED' : 'DRAFT';
      const publishedAt = p.status === 'publish' ? new Date(p.date) : null;

      // Always try to get featured image URL (from _embed or by fetching media by ID)
      let featuredImageId: string | null = null;
      const featured = await getFeaturedImageUrl(p);
      if (featured?.source_url) {
        const filename = featured.source_url.split('/').pop() || `wp-${p.id}.jpg`;
        const media = await prisma.media.create({
          data: {
            filename,
            originalName: filename,
            url: featured.source_url,
            mimeType: featured.mime_type || 'image/jpeg',
            fileSize: 0,
            type: 'IMAGE',
            altText: featured.alt_text || title,
            wordpressId: p.featured_media || undefined,
          },
        });
        featuredImageId = media.id;
      }

      const categoryIds = (p._embedded?.['wp:term']?.[0] || [])
        .map((t) => categoryBySlug.get(t.slug))
        .filter(Boolean) as string[];
      const tagIds = (p._embedded?.['wp:term']?.[1] || [])
        .map((t) => tagBySlug.get(t.slug))
        .filter(Boolean) as string[];

      const postData = {
        title,
        slug: p.slug,
        excerpt,
        content,
        status,
        publishedAt,
        authorId,
        featuredImageId,
        metaTitle: p.yoast_head_json?.title || null,
        metaDescription: p.yoast_head_json?.description || null,
        metaKeywords: p.yoast_head_json?.keywords || null,
        categories: categoryIds.length ? { connect: categoryIds.map((id) => ({ id })) } : undefined,
        tags: tagIds.length ? { connect: tagIds.map((id) => ({ id })) } : undefined,
      };

      if (existing && REIMPORT) {
        const { categories, tags, ...updatePayload } = postData;
        await prisma.post.update({
          where: { id: existing.id },
          data: {
            ...updatePayload,
            categories: categoryIds.length ? { set: categoryIds.map((id) => ({ id })) } : undefined,
            tags: tagIds.length ? { set: tagIds.map((id) => ({ id })) } : undefined,
          },
        });
        updated++;
        console.log('  ↻', title.slice(0, 50) + (title.length > 50 ? '…' : ''), featuredImageId ? `| featured: ${featured!.source_url}` : '');
      } else {
        await prisma.post.create({
          data: postData,
        });
        created++;
        console.log('  ✓', title.slice(0, 50) + (title.length > 50 ? '…' : ''), featuredImageId ? `| featured: ${featured!.source_url}` : '');
      }
    } catch (err) {
      console.error('  ✗', p.slug, (err as Error).message);
    }
  }

  console.log('\nDone. Created:', created, '| Updated:', updated, '| Skipped (already exist):', skipped);
  console.log('Featured image links are stored in Media and linked to each post. Run npm run publish-posts to set all to PUBLISHED if needed.\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
