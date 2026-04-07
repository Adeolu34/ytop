import { NextResponse } from 'next/server';
import { isDatabaseConfigured } from '@/lib/db-config';

/**
 * GET /api/campaigns
 *
 * Get all active fundraising campaigns
 */
export async function GET() {
  if (!isDatabaseConfigured()) {
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

    // Calculate progress percentage for each campaign
    const campaignsWithProgress = campaigns.map(campaign => ({
      ...campaign,
      progressPercentage: Number(campaign.goalAmount) > 0
        ? Math.round((Number(campaign.raisedAmount) / Number(campaign.goalAmount)) * 100)
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
