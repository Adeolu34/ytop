import { NextResponse } from 'next/server';
import { getMongoDbOr503 } from '@/lib/api-mongo';
import { mongoAggregateCategories } from '@/lib/mongo-blog';

export const dynamic = 'force-dynamic';

/**
 * GET /api/categories
 *
 * Get all categories with post counts (from published Mongo blog posts)
 */
export async function GET() {
  try {
    const gate = await getMongoDbOr503();
    if (!gate.ok) {
      return gate.response;
    }

    const categories = await mongoAggregateCategories();

    return NextResponse.json({
      categories: categories.map((cat) => ({
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
