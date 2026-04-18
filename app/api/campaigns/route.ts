import { NextResponse } from 'next/server';
import { getMongoDbOr503 } from '@/lib/api-mongo';
import { mongoCampaignsListActive } from '@/lib/mongo-campaigns-store';

export const dynamic = 'force-dynamic';

/**
 * GET /api/campaigns
 *
 * Get all active fundraising campaigns
 */
export async function GET() {
  try {
    const gate = await getMongoDbOr503();
    if (!gate.ok) {
      return gate.response;
    }

    const campaigns = await mongoCampaignsListActive();

    const campaignsWithProgress = campaigns.map((campaign) => ({
      ...campaign,
      progressPercentage:
        campaign.goalAmount > 0
          ? Math.round(
              (campaign.raisedAmount / campaign.goalAmount) * 100
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
