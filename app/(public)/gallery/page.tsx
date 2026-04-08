import GalleryClient from '@/components/public/gallery/GalleryClient';
import {
  cloudinaryGalleryFolderHintText,
  isCloudinaryConfigured,
  listGalleryImagesFromCloudinary,
} from '@/lib/cloudinary';

/** Always fetch fresh gallery list (Cloudinary env must exist at request time, not only at build). */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GalleryPage() {
  let cloudinaryImages: Awaited<
    ReturnType<typeof listGalleryImagesFromCloudinary>
  > = [];

  const configured = isCloudinaryConfigured();
  if (configured) {
    try {
      cloudinaryImages = await listGalleryImagesFromCloudinary();
    } catch (e) {
      console.error('Cloudinary gallery list failed:', e);
    }
  }

  return (
    <GalleryClient
      cloudinaryConfigured={configured}
      cloudinaryImages={cloudinaryImages}
      galleryFolderHint={cloudinaryGalleryFolderHintText()}
    />
  );
}
