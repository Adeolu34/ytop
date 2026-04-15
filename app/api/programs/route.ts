import { NextResponse } from 'next/server';
import { getPrismaOr503 } from '@/lib/api-prisma';
import { mongoListActivePrograms, useMongoForPublicData } from '@/lib/mongo-public';

export const dynamic = 'force-dynamic';

/**
 * GET /api/programs
 *
 * Get all active programs
 */
export async function GET() {
  try {
    if (useMongoForPublicData()) {
      const programs = await mongoListActivePrograms();
      return NextResponse.json({ programs });
    }

    const pg = await getPrismaOr503();
    if (!pg.ok) {
      return pg.response;
    }
    const prisma = pg.prisma;

    const programs = await prisma.program.findMany({
      where: {
        isActive: true,
      },
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
        order: 'asc',
      },
    });

    return NextResponse.json({ programs });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}
