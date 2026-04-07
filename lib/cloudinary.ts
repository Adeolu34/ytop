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
