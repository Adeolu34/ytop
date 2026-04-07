'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ImageIcon, Loader2, Search, X } from 'lucide-react';

export type MediaPickerItem = {
  id: string;
  filename: string;
  url: string;
  folder: string | null;
  altText: string | null;
  mimeType: string;
};

type MediaPickerModalProps = {
  open: boolean;
  onClose: () => void;
  folders: string[];
  initialItems: MediaPickerItem[];
  selectedId: string;
  /** Second arg is set when choosing an image from the grid (not "No image"). */
  onSelect: (id: string, item?: MediaPickerItem | null) => void;
};

export default function MediaPickerModal({
  open,
  onClose,
  folders,
  initialItems,
  selectedId,
  onSelect,
}: MediaPickerModalProps) {
  const [q, setQ] = useState('');
  const [folderFilter, setFolderFilter] = useState<string>('all');
  const [items, setItems] = useState<MediaPickerItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    if (open) {
      setItems(initialItems);
      setHasMore(initialItems.length >= 40);
      setLoadError(null);
    }
  }, [open, initialItems]);

  const filterFetchArmedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      setQ('');
      setFolderFilter('all');
      filterFetchArmedRef.current = false;
    }
  }, [open]);

  const runFetch = useCallback(
    async (opts: { skip: number; replace: boolean }) => {
      setLoading(true);
      setLoadError(null);
      try {
        const params = new URLSearchParams();
        if (q.trim()) params.set('q', q.trim());
        if (folderFilter !== 'all') params.set('folder', folderFilter);
        params.set('take', '40');
        params.set('skip', String(opts.skip));

        const res = await fetch(`/api/admin/media?${params.toString()}`, {
          credentials: 'same-origin',
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            typeof err.error === 'string' ? err.error : 'Failed to load media'
          );
        }
        const data = (await res.json()) as {
          items: MediaPickerItem[];
          hasMore: boolean;
        };
        if (opts.replace) {
          setItems(data.items);
        } else {
          setItems((prev) => {
            const seen = new Set(prev.map((i) => i.id));
            const next = [...prev];
            for (const item of data.items) {
              if (!seen.has(item.id)) {
                seen.add(item.id);
                next.push(item);
              }
            }
            return next;
          });
        }
        setHasMore(data.hasMore);
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : 'Failed to load media');
      } finally {
        setLoading(false);
      }
    },
    [folderFilter, q]
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    if (!filterFetchArmedRef.current) {
      filterFetchArmedRef.current = true;
      return;
    }
    const t = window.setTimeout(() => {
      void runFetch({ skip: 0, replace: true });
    }, 280);
    return () => window.clearTimeout(t);
  }, [q, folderFilter, open, runFetch]);

  const loadMore = useCallback(() => {
    void runFetch({ skip: itemsRef.current.length, replace: false });
  }, [runFetch]);

  const sortedFolders = useMemo(
    () => [...folders].sort((a, b) => a.localeCompare(b)),
    [folders]
  );

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-picker-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e7d6d4] px-6 py-4">
          <div>
            <h2
              id="media-picker-title"
              className="admin-font-display text-lg font-bold text-[#1b1c1c]"
            >
              Choose featured image
            </h2>
            <p className="text-sm text-[#5d3f3c]">
              Images from your gallery. Filter by folder or search by filename.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#5d3f3c] hover:bg-[#efeded]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-[#e7d6d4] px-6 py-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b6d69]" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search filename…"
              className="w-full rounded-xl border border-[#e7d6d4] bg-white py-2.5 pl-10 pr-3 text-sm text-[#1b1c1c] outline-none focus:border-[#ba0013]"
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#1b1c1c]">
            <span className="whitespace-nowrap">Folder</span>
            <select
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              className="rounded-xl border border-[#e7d6d4] bg-white px-3 py-2 text-sm outline-none focus:border-[#ba0013]"
            >
              <option value="all">All folders</option>
              <option value="__uncategorized__">Uncategorized</option>
              {sortedFolders.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {loadError ? (
            <p className="text-sm text-[#93000d]">{loadError}</p>
          ) : null}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            <button
              type="button"
              onClick={() => {
                onSelect('', null);
                onClose();
              }}
              className={`flex min-h-[120px] items-center justify-center rounded-xl border-2 border-dashed p-4 text-center text-xs font-semibold transition-colors ${
                selectedId === ''
                  ? 'border-[#ba0013] bg-[#fff1ef] text-[#ba0013]'
                  : 'border-[#e7d6d4] text-[#5d3f3c] hover:border-[#ba0013] hover:bg-[#f8f6f6]'
              }`}
            >
              No image
            </button>
            {items.map((item) => {
              const selected = selectedId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item.id, item);
                    onClose();
                  }}
                  className={`group relative overflow-hidden rounded-xl border-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ba0013] ${
                    selected
                      ? 'border-[#ba0013] ring-2 ring-[#ba0013]/30'
                      : 'border-transparent hover:border-[#e7d6d4]'
                  }`}
                >
                  <div className="relative aspect-square w-full bg-[#efeded]">
                    {item.mimeType.startsWith('image/') ? (
                      <Image
                        src={item.url}
                        alt={item.altText || item.filename}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-[#ba0013]" />
                      </div>
                    )}
                  </div>
                  <p className="truncate px-2 py-1.5 text-[0.65rem] font-medium text-[#1b1c1c]">
                    {item.filename}
                  </p>
                  {item.folder ? (
                    <p className="truncate px-2 pb-2 text-[0.6rem] text-[#5d3f3c]">
                      {item.folder}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-sm text-[#5d3f3c]">
              <Loader2 className="h-6 w-6 animate-spin text-[#ba0013]" />
              Loading…
            </div>
          ) : null}

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              disabled={!hasMore || loading}
              onClick={loadMore}
              className="rounded-lg border border-[#e7d6d4] bg-white px-4 py-2 text-sm font-semibold text-[#1b1c1c] transition enabled:hover:bg-[#efeded] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Load more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
