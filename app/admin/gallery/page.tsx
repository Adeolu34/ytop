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

  const where: Prisma.MediaWhereInput = {};

  if (typeFilter !== 'ALL') {
    where.type = typeFilter as MediaType;
  }

  if (searchQuery) {
    where.OR = [
      { filename: { contains: searchQuery, mode: 'insensitive' } },
      { originalName: { contains: searchQuery, mode: 'insensitive' } },
      { altText: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  const [items, totalItems, imageCount, videoCount, documentCount, storage] =
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
    ]);

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
      flashMessage={flashMessage}
    />
  );
}
