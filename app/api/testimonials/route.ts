import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

/**
 * GET /api/testimonials
 *
 * Query params:
 * - featured: boolean (default: false)
 * - limit: number (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured') === 'true';
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));

    const where: any = {};
    if (featured) {
      where.isFeatured = true;
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      include: {
        photo: {
          select: {
            id: true,
            url: true,
            altText: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
      take: limit,
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
