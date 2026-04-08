import { NextResponse } from 'next/server';
import { getPrismaOr503 } from '@/lib/api-prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/team
 *
 * Get all active team members
 */
export async function GET() {
  try {
    const pg = await getPrismaOr503();
    if (!pg.ok) {
      return pg.response;
    }
    const prisma = pg.prisma;

    const teamMembers = await prisma.teamMember.findMany({
      where: {
        isActive: true,
      },
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
    });

    return NextResponse.json({ teamMembers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
