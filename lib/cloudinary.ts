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
  return (
    process.env.CLOUDINARY_GALLERY_PREFIX?.trim() || 'ytop/gallery'
  );
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
  const pathParts = resource.public_id.split('/');
  const idx = pathParts.findIndex((p) => p === 'gallery');
  if (idx >= 0 && pathParts[idx + 1]) {
    const seg = pathParts[idx + 1];
    if (GALLERY_CATEGORIES.includes(seg as (typeof GALLERY_CATEGORIES)[number])) {
      return seg;
    }
  }
  return 'Events';
}

/**
 * List images under {@link cloudinaryGalleryPrefix} for the public /gallery page.
 */
export async function listGalleryImagesFromCloudinary(): Promise<
  CloudinaryGalleryItem[]
> {
  configure();
  if (!isCloudinaryConfigured()) {
    return [];
  }

  const prefix = cloudinaryGalleryPrefix();
  const result = (await cloudinary.api.resources({
    type: 'upload',
    resource_type: 'image',
    prefix,
    max_results: 500,
  })) as {
    resources: Array<{
      secure_url: string;
      public_id: string;
      tags?: string[];
      context?: { custom?: { caption?: string; alt?: string } };
    }>;
  };

  return result.resources.map((r) => ({
    src: r.secure_url,
    alt:
      r.context?.custom?.alt ||
      r.context?.custom?.caption ||
      r.public_id.split('/').pop() ||
      'Gallery image',
    category: categoryFromResource(r),
    publicId: r.public_id,
  }));
}
