import { NextRequest, NextResponse } from 'next/server';
import { getMongoDbOr503 } from '@/lib/api-mongo';
import { mongoTestimonialsList } from '@/lib/mongo-testimonials-store';

export const dynamic = 'force-dynamic';

/**
 * GET /api/testimonials
 *
 * Query params:
 * - featured: boolean (default: false)
 * - limit: number (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const gate = await getMongoDbOr503();
    if (!gate.ok) {
      return gate.response;
    }

    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured') === 'true';
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('limit') || '10'))
    );

    const testimonials = await mongoTestimonialsList({
      featuredOnly: featured,
      limit,
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
