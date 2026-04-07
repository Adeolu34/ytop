import GalleryClient from '@/components/public/gallery/GalleryClient';
import {
  isCloudinaryConfigured,
  listGalleryImagesFromCloudinary,
} from '@/lib/cloudinary';

export default async function GalleryPage() {
  let cloudinaryImages: Awaited<
    ReturnType<typeof listGalleryImagesFromCloudinary>
  > = [];

  if (isCloudinaryConfigured()) {
    try {
      cloudinaryImages = await listGalleryImagesFromCloudinary();
    } catch (e) {
      console.error('Cloudinary gallery list failed:', e);
    }
  }

  return <GalleryClient cloudinaryImages={cloudinaryImages} />;
}
