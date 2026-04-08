import { NextResponse } from 'next/server';
import { getPrismaOr503 } from '@/lib/api-prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/categories
 *
 * Get all categories with post counts
 */
export async function GET() {
  try {
    const pg = await getPrismaOr503();
    if (!pg.ok) {
      return pg.response;
    }
    const prisma = pg.prisma;

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED',
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        postCount: cat._count.posts,
      })),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
