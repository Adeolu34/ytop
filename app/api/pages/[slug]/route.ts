import { NextRequest, NextResponse } from 'next/server';
import { getPrismaOr503 } from '@/lib/api-prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/pages/[slug]
 *
 * Get a single page by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const pg = await getPrismaOr503();
    if (!pg.ok) {
      return pg.response;
    }
    const prisma = pg.prisma;

    const page = await prisma.page.findUnique({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        parent: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        children: {
          where: {
            status: 'PUBLISHED',
          },
          select: {
            id: true,
            title: true,
            slug: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ page });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}
