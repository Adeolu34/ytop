import { NextResponse, type NextRequest } from 'next/server';
import { getMongoDbOr503 } from '@/lib/api-mongo';
import { checkPermission, getCurrentUser } from '@/lib/auth-utils';
import { mongoMediaListAdminImages } from '@/lib/mongo-media';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id || !checkPermission(user.role ?? 'SUBSCRIBER', 'AUTHOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gate = await getMongoDbOr503();
    if (!gate.ok) {
      return gate.response;
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const folderParam = searchParams.get('folder');
    const skip = Math.max(0, Number.parseInt(searchParams.get('skip') || '0', 10) || 0);
    const take = Math.min(
      200,
      Math.max(1, Number.parseInt(searchParams.get('take') || '40', 10) || 40)
    );

    const { items, total } = await mongoMediaListAdminImages({
      q: q || undefined,
      folderParam,
      skip,
      take,
    });

    return NextResponse.json({
      items,
      total,
      hasMore: skip + items.length < total,
    });
  } catch (error) {
    console.error('GET /api/admin/media:', error);
    return NextResponse.json(
      { error: 'Failed to load media' },
      { status: 500 }
    );
  }
}
