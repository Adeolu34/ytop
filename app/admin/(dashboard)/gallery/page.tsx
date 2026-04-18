import GalleryManagementView from '@/components/admin/gallery/GalleryManagementView';
import {
  getSearchParamValue,
  readAdminFlashMessage,
  type SearchParamRecord,
} from '@/lib/admin-feedback';
import {
  mongoMediaGalleryList,
  mongoMediaGalleryStats,
} from '@/lib/mongo-media';

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

  const [items, stats] = await Promise.all([
    mongoMediaGalleryList({
      typeFilter,
      folderFilter,
      searchQuery,
      take: 24,
    }),
    mongoMediaGalleryStats(),
  ]);

  const totalBytes = stats.totalBytes;
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
      totalItems={stats.totalItems}
      imageCount={stats.imageCount}
      documentAndVideoCount={stats.videoCount + stats.documentCount}
      totalStorageLabel={totalStorageLabel}
      searchQuery={searchQuery}
      typeFilter={typeFilter}
      folderFilter={folderFilter}
      folderNames={stats.folderNames}
      flashMessage={flashMessage}
    />
  );
}
