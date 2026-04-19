import GalleryClient from '@/components/public/gallery/GalleryClient';
import {
  cloudinaryGalleryFolderHintText,
  isCloudinaryConfigured,
  listGalleryImagesFromCloudinary,
} from '@/lib/cloudinary';
/** CDN ISR — lib/public-page-config.ts */
export const revalidate = 60;

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
