import { NextRequest, NextResponse } from 'next/server';
import { getMongoDbOr503 } from '@/lib/api-mongo';
import {
  mongoBlogDocumentToApiListPost,
  mongoListPublishedPostDocuments,
} from '@/lib/mongo-blog';

export const dynamic = 'force-dynamic';

/**
 * GET /api/posts
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 10, max: 100)
 * - category: string (category slug)
 * - tag: string (tag slug)
 * - search: string (search in title and content)
 */
export async function GET(request: NextRequest) {
  try {
    const mongo = await getMongoDbOr503();
    if (!mongo.ok) {
      return mongo.response;
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const categorySlug = searchParams.get('category');
    const tagSlug = searchParams.get('tag');
    const searchQuery = searchParams.get('search');

    const { documents, total } = await mongoListPublishedPostDocuments({
      page,
      limit,
      categorySlug: categorySlug || undefined,
      tagSlug: tagSlug || undefined,
      searchQuery: searchQuery || undefined,
    });
    const posts = documents.map((doc) => mongoBlogDocumentToApiListPost(doc));
    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        totalCount: total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
