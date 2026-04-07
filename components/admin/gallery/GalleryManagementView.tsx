'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Filter,
  FolderInput,
  Image as ImageIcon,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import {
  deleteMediaAction,
  deleteSelectedMediaAction,
  moveSelectedMediaToFolderAction,
} from '@/app/admin/(dashboard)/gallery/actions';

type GalleryItem = {
  id: string;
  filename: string;
  url: string;
  altText: string | null;
  mimeType: string;
  type: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  folder: string | null;
  createdAt: string;
};

type GalleryManagementViewProps = {
  items: GalleryItem[];
  totalItems: number;
  imageCount: number;
  documentAndVideoCount: number;
  totalStorageLabel: string;
  searchQuery: string;
  typeFilter: string;
  folderFilter: string;
  folderNames: string[];
  flashMessage:
    | {
        type: 'notice' | 'error';
        message: string;
      }
    | null;
};

const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function buildTypeHref(
  type: string,
  searchQuery: string,
  folderFilter: string
): string {
  const searchParams = new URLSearchParams();

  if (type !== 'ALL') {
    searchParams.set('type', type);
  }

  if (searchQuery) {
    searchParams.set('q', searchQuery);
  }

  if (folderFilter !== 'ALL') {
    searchParams.set('folder', folderFilter);
  }

  const queryString = searchParams.toString();
  return queryString ? `/admin/gallery?${queryString}` : '/admin/gallery';
}

function buildFolderHref(
  folder: string,
  searchQuery: string,
  typeFilter: string
): string {
  const searchParams = new URLSearchParams();

  if (typeFilter !== 'ALL') {
    searchParams.set('type', typeFilter);
  }

  if (searchQuery) {
    searchParams.set('q', searchQuery);
  }

  if (folder !== 'ALL') {
    searchParams.set('folder', folder);
  }

  const queryString = searchParams.toString();
  return queryString ? `/admin/gallery?${queryString}` : '/admin/gallery';
}

export default function GalleryManagementView({
  items,
  totalItems,
  imageCount,
  documentAndVideoCount,
  totalStorageLabel,
  searchQuery,
  typeFilter,
  folderFilter,
  folderNames,
  flashMessage,
}: GalleryManagementViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    setSelectedIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    );
  };

  const selectedCount = selectedIds.length;
  const typeFilters = ['ALL', 'IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER'];

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="mb-2 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#ba0013]">
            Visual Assets
          </span>
          <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
            Gallery Management
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
            Organize images, downloadable resources, and media uploads from the
            site in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <form
            method="get"
            className="inline-flex items-center gap-2 rounded-md bg-[#e9e8e7] px-4 py-3 text-sm font-semibold text-[#1b1c1c]"
          >
            {typeFilter !== 'ALL' ? (
              <input type="hidden" name="type" value={typeFilter} />
            ) : null}
            {folderFilter !== 'ALL' ? (
              <input type="hidden" name="folder" value={folderFilter} />
            ) : null}
            <Filter className="h-4 w-4" />
            <input
              type="search"
              name="q"
              defaultValue={searchQuery}
              className="w-44 bg-transparent outline-none placeholder:text-[#8b6d69]"
              placeholder="Search filenames or alt text"
            />
            <button
              type="submit"
              className="rounded-full bg-white px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#ba0013] transition-colors hover:bg-[#ffdad6]"
            >
              Search
            </button>
          </form>
          <Link
            href="/admin/gallery/new"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-[#ba0013] to-[#e31e24] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#ba0013]/20 transition-transform hover:scale-[1.02]"
          >
            <Upload className="h-4 w-4" />
            Upload New Image
          </Link>
        </div>
      </section>

      {flashMessage ? (
        <AdminFlashBanner
          type={flashMessage.type}
          message={flashMessage.message}
        />
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="admin-surface-card rounded-xl p-6">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
            Total Assets
          </p>
          <p className="admin-font-display mt-4 text-4xl font-extrabold tracking-tight text-[#1b1c1c]">
            {totalItems.toLocaleString()}
          </p>
          <p className="mt-2 text-xs font-medium text-[#5d3f3c]">
            Across image, video, and document uploads
          </p>
        </div>
        <div className="admin-surface-card rounded-xl p-6">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
            Image Library
          </p>
          <p className="admin-font-display mt-4 text-4xl font-extrabold tracking-tight text-[#1b1c1c]">
            {imageCount.toLocaleString()}
          </p>
          <p className="mt-2 text-xs font-medium text-[#5d3f3c]">
            Photos and graphics ready for publishing
          </p>
        </div>
        <div className="admin-surface-card rounded-xl p-6">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
            Other Assets
          </p>
          <p className="admin-font-display mt-4 text-4xl font-extrabold tracking-tight text-[#1b1c1c]">
            {documentAndVideoCount.toLocaleString()}
          </p>
          <p className="mt-2 text-xs font-medium text-[#5d3f3c]">
            Videos and documents stored alongside images
          </p>
        </div>
        <div className="admin-surface-card rounded-xl p-6">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
            Storage Used
          </p>
          <p className="admin-font-display mt-4 text-4xl font-extrabold tracking-tight text-[#1b1c1c]">
            {totalStorageLabel}
          </p>
          <p className="mt-2 text-xs font-medium text-[#5d3f3c]">
            Combined file size for indexed assets
          </p>
        </div>
      </section>

      <section className="admin-surface-card rounded-xl p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {typeFilters.map((filter) => (
              <Link
                key={filter}
                href={buildTypeHref(filter, searchQuery, folderFilter)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  typeFilter === filter
                    ? 'bg-[#ba0013] text-white'
                    : 'border border-[#e7bdb8]/30 bg-white text-[#1b1c1c] hover:bg-[#efeded]'
                }`}
              >
                {filter === 'ALL' ? 'All Assets' : filter}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-[#ead6d3] pt-4">
            <span className="mr-2 text-xs font-bold uppercase tracking-wide text-[#5d3f3c]">
              Folder
            </span>
            <Link
              href={buildFolderHref('ALL', searchQuery, typeFilter)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                folderFilter === 'ALL'
                  ? 'bg-[#1b1c1c] text-white'
                  : 'border border-[#e7bdb8]/30 bg-white text-[#1b1c1c] hover:bg-[#efeded]'
              }`}
            >
              All
            </Link>
            <Link
              href={buildFolderHref('__uncategorized__', searchQuery, typeFilter)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                folderFilter === '__uncategorized__'
                  ? 'bg-[#1b1c1c] text-white'
                  : 'border border-[#e7bdb8]/30 bg-white text-[#1b1c1c] hover:bg-[#efeded]'
              }`}
            >
              Uncategorized
            </Link>
            {folderNames.map((name) => (
              <Link
                key={name}
                href={buildFolderHref(name, searchQuery, typeFilter)}
                className={`max-w-[180px] truncate rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  folderFilter === name
                    ? 'bg-[#1b1c1c] text-white'
                    : 'border border-[#e7bdb8]/30 bg-white text-[#1b1c1c] hover:bg-[#efeded]'
                }`}
                title={name}
              >
                {name}
              </Link>
            ))}
          </div>

          <p className="mt-3 text-xs font-medium text-[#5d3f3c]">
            Showing {items.length} asset{items.length === 1 ? '' : 's'}
          </p>
        </div>
      </section>

      <section className="admin-surface-card rounded-xl border-l-4 border-l-[#ba0013] px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-[#ffdad6] text-xs font-bold text-[#410002]">
              {selectedCount}
            </span>
            <p className="text-sm font-medium text-[#1b1c1c]">
              {selectedCount > 0
                ? `${selectedCount} item${selectedCount === 1 ? '' : 's'} selected`
                : 'Select items to enable bulk deletion'}
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <form
              action={moveSelectedMediaToFolderAction}
              className="flex flex-wrap items-center gap-2"
            >
              <input type="hidden" name="mediaIds" value={selectedIds.join(',')} />
              <label className="text-xs font-semibold text-[#5d3f3c]">
                Move to folder
                <input
                  name="targetFolder"
                  placeholder="Folder name or leave empty"
                  className="ml-2 w-44 rounded-md border border-[#e7d6d4] bg-white px-2 py-1.5 text-xs text-[#1b1c1c] outline-none focus:border-[#ba0013]"
                />
              </label>
              <button
                type="submit"
                disabled={selectedCount === 0}
                className="inline-flex items-center gap-2 rounded-md border border-[#e7d6d4] bg-white px-4 py-2 text-sm font-bold text-[#1b1c1c] transition-colors enabled:hover:bg-[#efeded] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FolderInput className="h-4 w-4" />
                Move
              </button>
            </form>
            <form action={deleteSelectedMediaAction} className="flex items-center gap-2">
              <input type="hidden" name="mediaIds" value={selectedIds.join(',')} />
              <button
                type="submit"
                disabled={selectedCount === 0}
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 font-bold text-[#ba0013] transition-colors enabled:hover:bg-[#ffdad6] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          const isImage = item.mimeType.startsWith('image/');
          const fileExtension =
            item.filename.split('.').pop()?.toUpperCase() || item.type;

          return (
            <article
              key={item.id}
              className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#efeded]">
                {isImage ? (
                  <img
                    src={item.url}
                    alt={item.altText || item.filename}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ffdad6] via-white to-[#efeded]">
                    {item.type === 'VIDEO' ? (
                      <Video className="h-12 w-12 text-[#ba0013]" />
                    ) : (
                      <FolderInput className="h-12 w-12 text-[#ba0013]" />
                    )}
                  </div>
                )}

                <label className="absolute left-3 top-3 inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleItem(item.id)}
                    className="h-5 w-5 rounded border-white/50 bg-white/20 text-[#ba0013] ring-offset-0 focus:ring-[#ba0013]"
                  />
                </label>
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="truncate text-sm font-bold text-[#1b1c1c]">
                    {item.filename}
                  </h3>
                  <span className="rounded bg-[#efeded] px-2 py-0.5 text-[0.625rem] font-bold uppercase text-[#5d3f3c]">
                    {fileExtension}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[0.6875rem] text-[#5d3f3c]">
                  <span>
                    {item.fileSize.toLocaleString()} bytes
                    {item.width && item.height
                      ? ` · ${item.width} × ${item.height}`
                      : ''}
                  </span>
                  <span className="font-medium">
                    {fullDateFormatter.format(new Date(item.createdAt))}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[0.6875rem] font-semibold text-[#5d3f3c]">
                  <span className="inline-flex items-center gap-1">
                    <ImageIcon className="h-3.5 w-3.5" />
                    {item.type}
                  </span>
                  {item.folder ? (
                    <span className="rounded bg-[#ffdad6]/50 px-1.5 py-0.5 text-[0.6rem] font-bold text-[#410002]">
                      {item.folder}
                    </span>
                  ) : (
                    <span className="text-[0.6rem] font-medium text-[#8b6d69]">
                      Uncategorized
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Link
                    href={`/admin/gallery/${item.id}/edit`}
                    className="inline-flex flex-1 items-center justify-center rounded-md bg-[#efeded] px-3 py-2 text-xs font-semibold text-[#1b1c1c] transition-colors hover:bg-[#e4e2e2]"
                  >
                    Edit
                  </Link>
                  <form action={deleteMediaAction} className="flex-1">
                    <input type="hidden" name="mediaId" value={item.id} />
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center rounded-md bg-[#fff1ef] px-3 py-2 text-xs font-semibold text-[#93000d] transition-colors hover:bg-[#ffdad6]"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#d8b9b4] bg-white px-6 py-12 text-center text-sm text-[#5d3f3c]">
          No media items match the current filters yet.
        </div>
      ) : null}
    </div>
  );
}
