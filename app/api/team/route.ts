import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

/**
 * GET /api/team
 *
 * Get all active team members
 */
export async function GET() {
  try {
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
