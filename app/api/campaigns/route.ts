import { NextResponse } from 'next/server';
import { getPostgresConnectionString } from '@/lib/db-config';

/** Do not prerender; keeps `next build` from eagerly evaluating DB-backed handlers. */
export const dynamic = 'force-dynamic';

/**
 * GET /api/campaigns
 *
 * Get all active fundraising campaigns
 */
export async function GET() {
  if (!getPostgresConnectionString()) {
    return NextResponse.json({ campaigns: [] });
  }

  const { default: prisma } = await import('@/lib/db');

  try {
    const now = new Date();

    const campaigns = await prisma.campaign.findMany({
      where: {
        isActive: true,
        endDate: { gte: now }, // Not yet ended
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
        endDate: 'asc', // Ending soonest first
      },
    });

    const campaignsWithProgress = campaigns.map((campaign) => ({
      ...campaign,
      progressPercentage:
        Number(campaign.goalAmount) > 0
          ? Math.round(
              (Number(campaign.raisedAmount) / Number(campaign.goalAmount)) * 100
            )
          : 0,
    }));

    return NextResponse.json({ campaigns: campaignsWithProgress });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}
