'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ZoomIn } from 'lucide-react';

// Gallery images organized by category
const galleryImages = {
  'All': [
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
  ],
};

// Organize by actual categories
const categories = ['All', 'Events', 'Programs', 'Community', 'Team'];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages = selectedCategory === 'All'
    ? galleryImages['All']
    : galleryImages['All'].filter(img => img.category === selectedCategory);

  return (
    <div>
      {/* Hero - stitch style */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-secondary text-white py-20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} aria-hidden />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-6">Our Gallery</h1>
            <p className="text-xl text-white/95 leading-relaxed">
              Moments of impact, growth, and community from our programs and events
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 md:py-24 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category pills - stitch style */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
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

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-100 dark:border-slate-800"
                onClick={() => setSelectedImage(image.src)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
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

          {/* Empty State */}
          {filteredImages.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-600 text-lg font-medium">No images in this category yet.</p>
                <p className="text-slate-500 text-sm mt-2">Check back soon for new content!</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all duration-200 cursor-pointer transform hover:scale-110"
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt="Gallery image"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}

      {/* CTA Section - stitch */}
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
