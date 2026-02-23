import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

/**
 * GET /api/programs
 *
 * Get all active programs
 */
export async function GET() {
  try {
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
