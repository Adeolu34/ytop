import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

/**
 * GET /api/events
 *
 * Query params:
 * - type: 'upcoming' | 'past' (default: 'upcoming')
 * - limit: number (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'upcoming';
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));

    const now = new Date();
    const where: any = {};

    if (type === 'upcoming') {
      where.startDate = { gte: now };
    } else if (type === 'past') {
      where.startDate = { lt: now };
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        image: {
          select: {
            id: true,
            url: true,
            altText: true,
          },
        },
      },
      orderBy: {
        startDate: type === 'upcoming' ? 'asc' : 'desc',
      },
      take: limit,
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
