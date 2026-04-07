import { MediaType, type Prisma } from '@/app/generated/prisma';
import prisma from '@/lib/db';
import GalleryManagementView from '@/components/admin/gallery/GalleryManagementView';
import {
  getSearchParamValue,
  readAdminFlashMessage,
  type SearchParamRecord,
} from '@/lib/admin-feedback';

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  const resolvedSearchParams = await searchParams;
  const flashMessage = readAdminFlashMessage(resolvedSearchParams);
  const searchQuery = getSearchParamValue(resolvedSearchParams.q)?.trim() || '';
  const typeFilter =
    getSearchParamValue(resolvedSearchParams.type)?.toUpperCase() || 'ALL';
  const folderFilter =
    getSearchParamValue(resolvedSearchParams.folder)?.trim() || 'ALL';

  const where: Prisma.MediaWhereInput = {};

  if (typeFilter !== 'ALL') {
    where.type = typeFilter as MediaType;
  }

  if (folderFilter === '__uncategorized__') {
    where.folder = null;
  } else if (folderFilter !== 'ALL') {
    where.folder = folderFilter;
  }

  if (searchQuery) {
    where.OR = [
      { filename: { contains: searchQuery, mode: 'insensitive' } },
      { originalName: { contains: searchQuery, mode: 'insensitive' } },
      { altText: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  const [items, totalItems, imageCount, videoCount, documentCount, storage, folderRows] =
    await Promise.all([
      prisma.media.findMany({
        where,
        take: 24,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          filename: true,
          url: true,
          altText: true,
          mimeType: true,
          type: true,
          fileSize: true,
          width: true,
          height: true,
          folder: true,
          createdAt: true,
        },
      }),
      prisma.media.count(),
      prisma.media.count({ where: { type: 'IMAGE' } }),
      prisma.media.count({ where: { type: 'VIDEO' } }),
      prisma.media.count({ where: { type: 'DOCUMENT' } }),
      prisma.media.aggregate({
        _sum: {
          fileSize: true,
        },
      }),
      prisma.media.findMany({
        where: { folder: { not: null } },
        select: { folder: true },
        distinct: ['folder'],
      }),
    ]);

  const folderNames = folderRows
    .map((row) => row.folder)
    .filter((f): f is string => Boolean(f));

  const totalBytes = storage._sum.fileSize || 0;
  const totalStorageLabel =
    totalBytes > 1024 * 1024
      ? `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(totalBytes / 1024, 0).toFixed(1)} KB`;

  return (
    <GalleryManagementView
      items={items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      }))}
      totalItems={totalItems}
      imageCount={imageCount}
      documentAndVideoCount={videoCount + documentCount}
      totalStorageLabel={totalStorageLabel}
      searchQuery={searchQuery}
      typeFilter={typeFilter}
      folderFilter={folderFilter}
      folderNames={folderNames}
      flashMessage={flashMessage}
    />
  );
}
