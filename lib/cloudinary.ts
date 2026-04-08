import { Readable } from 'node:stream';
import { v2 as cloudinary } from 'cloudinary';

function configure(): void {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return;
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim()
  );
}

/** Folder prefix in Cloudinary (no leading/trailing slashes). */
export function cloudinaryUploadFolder(): string {
  return (
    process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || 'ytop/admin'
  );
}

export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
};

/**
 * Upload a file buffer to Cloudinary. Caller must ensure `isCloudinaryConfigured()` first.
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: { publicId: string; overwrite?: boolean; folder?: string }
): Promise<CloudinaryUploadResult> {
  configure();
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured.');
  }

  const folder = options.folder ?? cloudinaryUploadFolder();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options.publicId,
        resource_type: 'auto',
        overwrite: options.overwrite ?? false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result?.secure_url || !result.public_id) {
          reject(new Error('Cloudinary upload returned no URL.'));
          return;
        }
        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

/** Remove asset from Cloudinary by full public_id stored on Media. */
export async function destroyCloudinaryAsset(
  publicId: string
): Promise<void> {
  configure();
  if (!isCloudinaryConfigured()) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
}

/** Public gallery folder prefix (no leading/trailing slash). Tag assets with Events|Programs|Community|Team for filters. */
export function cloudinaryGalleryPrefix(): string {
  return cloudinaryGalleryPrefixes()[0] ?? 'ytop/gallery';
}

/** When unset, public /gallery also lists the admin upload folder so Media Library images appear. Set to 0/false/no/off to only use CLOUDINARY_GALLERY_PREFIX. */
function galleryAlsoIncludeUploadFolder(): boolean {
  const v = process.env.CLOUDINARY_GALLERY_ALSO_UPLOAD_FOLDER?.trim();
  if (v === undefined || v === '') return true;
  const lower = v.toLowerCase();
  return !['0', 'false', 'no', 'off'].includes(lower);
}

/**
 * List every image in the Cloudinary account (paginated Search API).
 * Use when assets are not under ytop/gallery or ytop/admin (or your CLOUDINARY_GALLERY_PREFIX).
 */
function galleryListEntireAccount(): boolean {
  const v = process.env.CLOUDINARY_GALLERY_ALL_IMAGES?.trim();
  return v === '1' || v?.toLowerCase() === 'true' || v?.toLowerCase() === 'yes';
}

/** Max images to load for /gallery (avoids timeouts on huge accounts). */
function galleryMaxImages(): number {
  const raw = process.env.CLOUDINARY_GALLERY_MAX_IMAGES?.trim();
  const n = raw ? parseInt(raw, 10) : 5000;
  return Number.isFinite(n) && n > 0 ? Math.min(n, 20000) : 5000;
}

/**
 * One or more comma-separated folder prefixes to list and merge (deduped by public_id).
 * Default: `ytop/gallery` plus the admin upload folder (e.g. `ytop/admin`) unless
 * `CLOUDINARY_GALLERY_ALSO_UPLOAD_FOLDER` is set to 0/false/no/off.
 */
export function cloudinaryGalleryPrefixes(): string[] {
  const raw = process.env.CLOUDINARY_GALLERY_PREFIX?.trim();
  const parts = raw
    ? raw.split(',').map((s) => s.trim().replace(/^\/+|\/+$/g, '')).filter(Boolean)
    : ['ytop/gallery'];
  const alsoUpload = galleryAlsoIncludeUploadFolder();
  const uploadFolder = cloudinaryUploadFolder().replace(/^\/+|\/+$/g, '');
  if (alsoUpload && uploadFolder && !parts.includes(uploadFolder)) {
    parts.push(uploadFolder);
  }
  return parts;
}

export type CloudinaryGalleryItem = {
  src: string;
  alt: string;
  category: string;
  publicId: string;
};

const GALLERY_CATEGORIES = ['Events', 'Programs', 'Community', 'Team'] as const;

function categoryFromResource(resource: {
  tags?: string[];
  public_id: string;
}): string {
  const tags = resource.tags ?? [];
  for (const c of GALLERY_CATEGORIES) {
    if (tags.some((t) => t.toLowerCase() === c.toLowerCase())) {
      return c;
    }
  }
  for (const seg of resource.public_id.split('/')) {
    if (GALLERY_CATEGORIES.includes(seg as (typeof GALLERY_CATEGORIES)[number])) {
      return seg;
    }
  }
  return 'Events';
}

type GalleryResource = {
  secure_url?: string;
  /** Some API responses use `url` instead of `secure_url`. */
  url?: string;
  public_id: string;
  tags?: string[];
  context?: { custom?: { caption?: string; alt?: string } };
};

async function listResourcesByPrefixPaged(prefix: string): Promise<GalleryResource[]> {
  const collected: GalleryResource[] = [];
  let next_cursor: string | undefined;
  for (let page = 0; page < 40; page++) {
    const batch = (await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix,
      max_results: 500,
      ...(next_cursor ? { next_cursor } : {}),
    })) as { resources?: GalleryResource[]; next_cursor?: string };
    const rows = batch.resources ?? [];
    collected.push(...rows);
    next_cursor = batch.next_cursor;
    if (!next_cursor) break;
  }
  return collected;
}

/** Search API fallback when Admin `resources` returns nothing (e.g. DAM folder vs public_id mismatch). */
async function listResourcesViaSearchPrefix(prefix: string): Promise<GalleryResource[]> {
  // Quote public_id so paths like ytop/gallery are not parsed as nested fields.
  const quoted = prefix.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const collected: GalleryResource[] = [];
  let next_cursor: string | undefined;
  const max = galleryMaxImages();
  for (let page = 0; page < 80 && collected.length < max; page++) {
    const q = cloudinary.search
      .expression(`resource_type:image AND public_id:"${quoted}*"`)
      .max_results(Math.min(500, max - collected.length))
      .with_field(['tags', 'context']);
    if (next_cursor) q.next_cursor(next_cursor);
    const result = (await q.execute()) as {
      resources?: GalleryResource[];
      next_cursor?: string;
    };
    const rows = result.resources ?? [];
    collected.push(...rows);
    next_cursor = result.next_cursor;
    if (!next_cursor || rows.length === 0) break;
  }
  return collected.slice(0, max);
}

/** Paginated account-wide image list (Search API). */
async function listAllImagesSearchPaged(): Promise<GalleryResource[]> {
  const collected: GalleryResource[] = [];
  let next_cursor: string | undefined;
  const max = galleryMaxImages();
  for (let page = 0; page < 80 && collected.length < max; page++) {
    const q = cloudinary.search
      .expression('resource_type:image')
      .max_results(Math.min(500, max - collected.length))
      .sort_by('created_at', 'desc')
      .with_field(['tags', 'context']);
    if (next_cursor) q.next_cursor(next_cursor);
    const batch = (await q.execute()) as {
      resources?: GalleryResource[];
      next_cursor?: string;
    };
    const rows = batch.resources ?? [];
    collected.push(...rows);
    next_cursor = batch.next_cursor;
    if (!next_cursor || rows.length === 0) break;
  }
  return collected.slice(0, max);
}

/** Some accounts organize by Media Library asset folder instead of public_id prefix. */
async function listResourcesByAssetFolder(folder: string): Promise<GalleryResource[]> {
  try {
    const batch = (await cloudinary.api.resources_by_asset_folder(folder, {
      resource_type: 'image',
      max_results: 500,
    })) as { resources?: GalleryResource[] };
    return batch.resources ?? [];
  } catch {
    return [];
  }
}

function resourceToGalleryItem(r: GalleryResource): CloudinaryGalleryItem {
  const src = r.secure_url || r.url || '';
  return {
    src,
    alt:
      r.context?.custom?.alt ||
      r.context?.custom?.caption ||
      r.public_id.split('/').pop() ||
      'Gallery image',
    category: categoryFromResource(r),
    publicId: r.public_id,
  };
}

async function collectForPrefix(prefix: string): Promise<GalleryResource[]> {
  const byId = new Map<string, GalleryResource>();

  const addAll = (rows: GalleryResource[]) => {
    for (const row of rows) {
      const src = row.secure_url || row.url;
      if (row.public_id && src) {
        byId.set(row.public_id, { ...row, secure_url: src });
      }
    }
  };

  addAll(await listResourcesByPrefixPaged(prefix));

  if (byId.size === 0) {
    addAll(await listResourcesViaSearchPrefix(prefix));
  }

  if (byId.size === 0) {
    addAll(await listResourcesByAssetFolder(prefix));
  }

  return [...byId.values()];
}

/**
 * List images under {@link cloudinaryGalleryPrefixes} for the public /gallery page.
 */
export async function listGalleryImagesFromCloudinary(): Promise<
  CloudinaryGalleryItem[]
> {
  configure();
  if (!isCloudinaryConfigured()) {
    return [];
  }

  if (galleryListEntireAccount()) {
    const rows = await listAllImagesSearchPaged();
    const merged = new Map<string, GalleryResource>();
    for (const r of rows) {
      const src = r.secure_url || r.url;
      if (r.public_id && src) {
        merged.set(r.public_id, { ...r, secure_url: src });
      }
    }
    return [...merged.values()]
      .map(resourceToGalleryItem)
      .slice(0, galleryMaxImages());
  }

  const prefixes = cloudinaryGalleryPrefixes();
  const merged = new Map<string, GalleryResource>();

  for (const prefix of prefixes) {
    const rows = await collectForPrefix(prefix);
    for (const r of rows) {
      const src = r.secure_url || r.url;
      if (r.public_id && src) {
        merged.set(r.public_id, { ...r, secure_url: src });
      }
    }
  }

  return [...merged.values()]
    .map(resourceToGalleryItem)
    .slice(0, galleryMaxImages());
}

/** Hint text for empty-state / docs: folder prefixes or entire-account mode. */
export function cloudinaryGalleryFolderHintText(): string {
  if (galleryListEntireAccount()) {
    return 'entire Cloudinary account (CLOUDINARY_GALLERY_ALL_IMAGES)';
  }
  return cloudinaryGalleryPrefixes().join(', ');
}
