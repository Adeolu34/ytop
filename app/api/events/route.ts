import { NextRequest, NextResponse } from 'next/server';
import { getMongoDbOr503 } from '@/lib/api-mongo';
import { mongoEventsList } from '@/lib/mongo-events-store';

export const dynamic = 'force-dynamic';

/**
 * GET /api/events
 *
 * Query params:
 * - type: 'upcoming' | 'past' (default: 'upcoming')
 * - limit: number (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const gate = await getMongoDbOr503();
    if (!gate.ok) {
      return gate.response;
    }

    const searchParams = request.nextUrl.searchParams;
    const type =
      searchParams.get('type') === 'past' ? 'past' : 'upcoming';
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('limit') || '10'))
    );

    const events = await mongoEventsList({ type, limit });

    return NextResponse.json({
      events: events.map((e) => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        description: e.description,
        startDate: e.startDate,
        endDate: e.endDate,
        location: e.location,
        isOnline: e.isOnline,
        registrationUrl: e.registrationUrl,
        galleryImageIds: e.galleryImageIds,
        programId: e.programId,
        image: e.image,
        maxParticipants: e.maxParticipants,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
