import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

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

    // Search posts
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { content: { contains: searchTerm, mode: 'insensitive' } },
          { excerpt: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        featuredImage: {
          select: {
            url: true,
            altText: true,
          },
        },
      },
      take: Math.floor(limit * 0.7), // 70% of limit for posts
      orderBy: {
        publishedAt: 'desc',
      },
    });

    // Search pages
    const pages = await prisma.page.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { content: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
      },
      take: Math.floor(limit * 0.3), // 30% of limit for pages
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({
      query: searchTerm,
      results: {
        posts: posts.map(post => ({
          ...post,
          type: 'post',
          url: `/blog/${post.slug}`,
        })),
        pages: pages.map(page => ({
          ...page,
          type: 'page',
          url: `/${page.slug}`,
          excerpt: page.content.substring(0, 200) + '...',
        })),
      },
      totalResults: posts.length + pages.length,
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
