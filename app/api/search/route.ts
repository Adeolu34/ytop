import { NextRequest, NextResponse } from 'next/server';
import { getMongoDbOr503 } from '@/lib/api-mongo';
import { mongoSearchPosts } from '@/lib/mongo-blog';
import { mongoPageSearchPublished } from '@/lib/mongo-pages-store';

export const dynamic = 'force-dynamic';

type SearchPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  featuredImage: { url: string; altText: string | null } | null;
};

/**
 * GET /api/search
 *
 * Global search across posts and pages
 *
 * Query params:
 * - q: string (search query)
 * - limit: number (default: 20)
 */
export async function GET(request: NextRequest) {
  try {
    const gate = await getMongoDbOr503();
    if (!gate.ok) {
      return gate.response;
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    const searchTerm = query.trim();
    const postTake = Math.floor(limit * 0.7);

    const posts: SearchPostRow[] = await mongoSearchPosts(
      searchTerm,
      postTake
    );

    const pages = await mongoPageSearchPublished(
      searchTerm,
      Math.floor(limit * 0.3)
    );

    return NextResponse.json({
      query: searchTerm,
      results: {
        posts: posts.map((post) => ({
          ...post,
          type: 'post' as const,
          url: `/blog/${post.slug}`,
        })),
        pages: pages.map((page) => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          type: 'page' as const,
          url: `/${page.slug}`,
          content: page.excerpt ?? '',
          excerpt:
            (page.excerpt ?? '').length > 200
              ? `${(page.excerpt ?? '').substring(0, 200)}...`
              : page.excerpt ?? '',
        })),
      },
      totalResults: posts.length + pages.length,
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
