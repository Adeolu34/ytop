import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { checkPermission, getCurrentUser } from '@/lib/auth-utils';
import { getMongoDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const WP_BASE = (
  process.env.WORDPRESS_URL || process.env.WP_URL || 'https://ytopglobal.org'
).replace(/\/$/, '');

type WPPost = {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string; alt_text?: string }>;
    'wp:term'?: Array<Array<{ name: string; slug: string; taxonomy?: string }>>;
    author?: Array<{ name?: string }>;
  };
  yoast_head_json?: { title?: string; description?: string };
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

async function fetchAllPosts(): Promise<WPPost[]> {
  const collected: WPPost[] = [];
  let page = 1;
  while (true) {
    const url = `${WP_BASE}/wp-json/wp/v2/posts?status=publish&per_page=100&page=${page}&_embed=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'YTOPSiteImporter/1.0' },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      if (res.status === 400 && page > 1) break; // past last page
      throw new Error(`WP API responded ${res.status} at page ${page}: ${await res.text()}`);
    }
    const posts = (await res.json()) as WPPost[];
    if (!Array.isArray(posts) || posts.length === 0) break;
    collected.push(...posts);
    const totalPages = Number(res.headers.get('X-WP-TotalPages') ?? '1');
    if (page >= totalPages) break;
    page++;
  }
  return collected;
}

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user?.id || !checkPermission(user.role ?? 'SUBSCRIBER', 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = await fetchAllPosts();
    if (posts.length === 0) {
      return NextResponse.json({
        message: 'No published posts found on ytopglobal.org.',
        inserted: 0,
        updated: 0,
        total: 0,
      });
    }

    const db = await getMongoDb();
    const col = db.collection('blog_posts');
    await col.createIndex({ slug: 1 }, { unique: true });

    const now = new Date();
    let inserted = 0;
    let updated = 0;

    for (const wp of posts) {
      const title = stripHtml(wp.title.rendered);
      const excerpt = stripHtml(wp.excerpt.rendered).substring(0, 300);
      const content = wp.content.rendered;
      const slug = wp.slug;
      const publishedAt = new Date(wp.date);
      const updatedAt = new Date(wp.modified);

      const featuredMedia = wp._embedded?.['wp:featuredmedia']?.[0];
      const featuredImage = featuredMedia?.source_url
        ? { url: featuredMedia.source_url, altText: featuredMedia.alt_text ?? title }
        : null;

      const terms = wp._embedded?.['wp:term'] ?? [];
      const categories = terms
        .flat()
        .filter((t) => t.taxonomy === 'category' || !t.taxonomy)
        .map((t) => ({ name: t.name, slug: t.slug }));
      const tags = terms
        .flat()
        .filter((t) => t.taxonomy === 'post_tag')
        .map((t) => ({ name: t.name, slug: t.slug }));

      const authorName = wp._embedded?.author?.[0]?.name ?? 'YTOP Global';

      const metaTitle = wp.yoast_head_json?.title ?? title;
      const metaDescription = wp.yoast_head_json?.description ?? excerpt;

      const doc = {
        id: randomUUID(),
        sourcePostId: String(wp.id),
        title,
        slug,
        excerpt,
        content,
        status: 'PUBLISHED' as const,
        author: { name: authorName },
        featuredImage,
        categories,
        tags,
        metaTitle,
        metaDescription,
        publishedAt,
        updatedAt,
        createdAt: now,
      };

      const existing = await col.findOne({ slug });
      if (existing) {
        await col.updateOne(
          { slug },
          { $set: { ...doc, createdAt: existing.createdAt ?? now } }
        );
        updated++;
      } else {
        await col.insertOne(doc);
        inserted++;
      }
    }

    return NextResponse.json({
      message: `Import complete: ${inserted} new, ${updated} updated out of ${posts.length} posts.`,
      inserted,
      updated,
      total: posts.length,
    });
  } catch (error) {
    console.error('WP import error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: `Import failed: ${message}`, inserted: 0, updated: 0, total: 0, error: message },
      { status: 500 }
    );
  }
}
