import { NextResponse, type NextRequest } from 'next/server';
import type { Prisma } from '@/app/generated/prisma';
import prisma from '@/lib/db';
import { checkPermission, getCurrentUser } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.id || !checkPermission(user.role ?? 'SUBSCRIBER', 'AUTHOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const folderParam = searchParams.get('folder');
  const skip = Math.max(0, Number.parseInt(searchParams.get('skip') || '0', 10) || 0);
  const take = Math.min(
    200,
    Math.max(1, Number.parseInt(searchParams.get('take') || '40', 10) || 40)
  );

  const where: Prisma.MediaWhereInput = {
    type: 'IMAGE',
  };

  if (q) {
    where.OR = [
      { filename: { contains: q, mode: 'insensitive' } },
      { originalName: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (folderParam === '__uncategorized__') {
    where.folder = null;
  } else if (folderParam && folderParam !== 'all') {
    where.folder = folderParam;
  }

  const [items, total] = await Promise.all([
    prisma.media.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        url: true,
        folder: true,
        altText: true,
        mimeType: true,
      },
    }),
    prisma.media.count({ where }),
  ]);

  return NextResponse.json({
    items,
    total,
    hasMore: skip + items.length < total,
  });
}
