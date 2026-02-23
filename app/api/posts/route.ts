import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

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
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const categorySlug = searchParams.get('category');
    const tagSlug = searchParams.get('tag');
    const searchQuery = searchParams.get('search');

    // Build where clause
    const where: any = {
      status: 'PUBLISHED',
    };

    // Filter by category
    if (categorySlug) {
      where.categories = {
        some: {
          slug: categorySlug,
        },
      };
    }

    // Filter by tag
    if (tagSlug) {
      where.tags = {
        some: {
          slug: tagSlug,
        },
      };
    }

    // Search in title and content
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { content: { contains: searchQuery, mode: 'insensitive' } },
        { excerpt: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const totalCount = await prisma.post.count({ where });

    // Get posts
    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        featuredImage: {
          select: {
            id: true,
            url: true,
            altText: true,
            width: true,
            height: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: page * limit < totalCount,
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
