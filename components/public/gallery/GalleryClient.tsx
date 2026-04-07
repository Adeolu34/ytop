'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ZoomIn } from 'lucide-react';
import type { CloudinaryGalleryItem } from '@/lib/cloudinary';

const STATIC_GALLERY: Array<{
  src: string;
  alt: string;
  category: string;
}> = [
  { src: '/media/2021/10/IMG_9586-scaled.jpg', alt: 'YTOP team workshop', category: 'Events' },
  { src: '/media/2021/10/IMG_9622-scaled.jpg', alt: 'Community outreach', category: 'Community' },
  { src: '/media/2021/10/IMG_9658-scaled.jpg', alt: 'Leadership training', category: 'Programs' },
  { src: '/media/2021/10/IMG_9724-scaled.jpg', alt: 'Youth gathering', category: 'Events' },
  { src: '/media/2021/11/1-scaled.jpg', alt: 'Team collaboration', category: 'Team' },
  { src: '/media/2021/11/2-scaled.jpg', alt: 'Workshop session', category: 'Programs' },
  { src: '/media/2021/11/005.jpg', alt: 'Anniversary celebration', category: 'Events' },
  { src: '/media/2021/11/006.jpg', alt: 'Youth empowerment', category: 'Programs' },
  { src: '/media/2021/11/007.jpg', alt: 'Community service', category: 'Community' },
  { src: '/media/2021/11/008.jpg', alt: 'Mentorship program', category: 'Programs' },
  { src: '/media/2021/11/20210605_080734-scaled.jpg', alt: 'Training session', category: 'Programs' },
  { src: '/media/2021/11/20210605_082337-scaled.jpg', alt: 'Group activity', category: 'Events' },
];

const categories = ['All', 'Events', 'Programs', 'Community', 'Team'];

type Row = { src: string; alt: string; category: string; key: string };

export default function GalleryClient({
  cloudinaryConfigured,
  cloudinaryImages,
  galleryFolderHint,
}: {
  cloudinaryConfigured: boolean;
  cloudinaryImages: CloudinaryGalleryItem[];
  /** Comma-separated folder prefixes (for empty-state copy). */
  galleryFolderHint?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const rows: Row[] = useMemo(() => {
    if (cloudinaryConfigured && cloudinaryImages.length > 0) {
      return cloudinaryImages.map((img) => ({
        src: img.src,
        alt: img.alt,
        category: img.category,
        key: img.publicId,
      }));
    }
    if (!cloudinaryConfigured) {
      return STATIC_GALLERY.map((img, i) => ({
        ...img,
        key: `static-${i}-${img.src}`,
      }));
    }
    return [];
  }, [cloudinaryConfigured, cloudinaryImages]);

  const filteredImages =
    selectedCategory === 'All'
      ? rows
      : rows.filter((img) => img.category === selectedCategory);

  return (
    <div>
      <section className="relative min-h-[50vh] flex items-center justify-center bg-secondary text-white py-20">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
          aria-hidden
        />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-6">
              Our Gallery
            </h1>
            <p className="text-xl text-white/95 leading-relaxed">
              Moments of impact, growth, and community from our programs and events
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {cloudinaryConfigured && rows.length === 0 && (
            <div className="mb-10 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
              <p className="font-medium">Cloudinary is configured, but no images were returned for this site.</p>
              <p className="mt-1 text-amber-900/90 dark:text-amber-100/90">
                Upload images whose <strong className="font-semibold">public ID</strong> starts with one of:{' '}
                <code className="rounded bg-white/80 px-1 py-0.5 text-xs dark:bg-black/30">
                  {galleryFolderHint ?? 'ytop/gallery, ytop/admin'}
                </code>
                . Set <code className="rounded bg-white/80 px-1 py-0.5 text-xs dark:bg-black/30">CLOUDINARY_GALLERY_PREFIX</code> to match your Cloudinary folder(s). If you disabled the admin folder with{' '}
                <code className="rounded bg-white/80 px-1 py-0.5 text-xs dark:bg-black/30">CLOUDINARY_GALLERY_ALSO_UPLOAD_FOLDER=0</code>, either move assets under the gallery prefix or turn that flag back on (default is on).
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.key}
                className="group relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-100 dark:border-slate-800"
                onClick={() => setSelectedImage(image.src)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedImage(image.src);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  unoptimized={image.src.startsWith('http')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  <div className="text-white">
                    <p className="font-bold text-sm">{image.alt}</p>
                    <p className="text-xs text-white/80">{image.category}</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="max-w-md mx-auto">
                <p className="text-slate-600 text-lg font-medium">
                  No images in this category yet.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Check back soon for new content!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
          role="presentation"
        >
          <button
            type="button"
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all duration-200 cursor-pointer transform hover:scale-110"
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative w-full max-w-5xl aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <Image
              src={selectedImage}
              alt="Gallery image"
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized={selectedImage.startsWith('http')}
            />
          </div>
        </div>
      )}

      <section className="py-20 md:py-24 bg-white dark:bg-background-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Be Part of Our Story
          </h2>
          <p className="text-xl mb-10 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Join our community and be featured in our next gallery showcase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/get-involved"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all cursor-pointer"
            >
              Get Involved
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-surface-dark text-secondary font-bold rounded-full border-2 border-secondary hover:bg-secondary hover:text-white transition-all cursor-pointer"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
