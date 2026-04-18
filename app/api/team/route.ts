import { NextResponse } from 'next/server';
import { getMongoDbOr503 } from '@/lib/api-mongo';
import { mongoListActiveTeamMembers } from '@/lib/mongo-public';

export const dynamic = 'force-dynamic';

/**
 * GET /api/team
 *
 * Get all active team members
 */
export async function GET() {
  try {
    const gate = await getMongoDbOr503();
    if (!gate.ok) {
      return gate.response;
    }

    const teamMembers = await mongoListActiveTeamMembers();
    return NextResponse.json({ teamMembers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
