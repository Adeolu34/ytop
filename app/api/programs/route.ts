import { NextResponse } from 'next/server';
import { getMongoDbOr503 } from '@/lib/api-mongo';
import { mongoListActivePrograms } from '@/lib/mongo-public';

export const dynamic = 'force-dynamic';

/**
 * GET /api/programs
 *
 * Get all active programs
 */
export async function GET() {
  try {
    const gate = await getMongoDbOr503();
    if (!gate.ok) {
      return gate.response;
    }

    const programs = await mongoListActivePrograms();
    return NextResponse.json({ programs });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}
