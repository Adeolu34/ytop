'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SLIDE_INTERVAL_MS = 5000;

const HERO_IMAGES = [
  '/media/2021/10/IMG_9724-scaled.jpg',
  '/media/2021/10/IMG_9658-scaled.jpg',
  '/media/2021/11/005.jpg',
  '/media/2021/11/006.jpg',
  '/media/2021/10/IMG_9586-scaled.jpg',
  '/media/2021/11/1-scaled.jpg',
];

export default function HomeHeroSlideshow() {
  const [index, setIndex] = useState(0);
  const len = HERO_IMAGES.length;
  const nextIndex = (index + 1) % len;
  const slot0Visible = index % 2 === 0;
  const slot0Src = slot0Visible ? HERO_IMAGES[index] : HERO_IMAGES[nextIndex];
  const slot1Src = slot0Visible ? HERO_IMAGES[nextIndex] : HERO_IMAGES[index];

  const goTo = useCallback((i: number) => setIndex(i), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % len), [len]);

  useEffect(() => {
    const id = setInterval(next, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Slide 0 */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-700 ease-in-out"
        style={{ opacity: slot0Visible ? 1 : 0 }}
        aria-hidden={!slot0Visible}
      >
        <Image
          src={slot0Src}
          alt=""
          fill
          className="object-cover object-center"
          priority={index === 0}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900/90" />
      </div>
      {/* Slide 1 */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-700 ease-in-out"
        style={{ opacity: slot0Visible ? 0 : 1 }}
        aria-hidden={slot0Visible}
      >
        <Image
          src={slot1Src}
          alt=""
          fill
          className="object-cover object-center"
          priority={false}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900/90" />
      </div>

      {/* Content - stitch hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100/90 dark:bg-blue-900/50 text-secondary dark:text-blue-300 text-sm font-bold tracking-wide mb-6 uppercase">
            Since 2016 • Rc179444
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-white leading-tight drop-shadow-lg">
            Empowering Young <br />
            <span className="hero-text-gradient">Changemakers</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-white/95 mb-10 leading-relaxed drop-shadow-md">
            We expand to that future by fostering leadership, personal development, and social impact across the globe. Join the movement.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/donate"
              className="bg-primary hover:bg-primary-hover text-white text-lg px-8 py-4 rounded-full font-bold shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1"
            >
              Donate to Support
            </Link>
            <Link
              href="/about"
              className="bg-white/95 dark:bg-gray-800/95 text-secondary dark:text-white border-2 border-white/80 dark:border-gray-600 hover:bg-secondary hover:text-white dark:hover:bg-gray-700 text-lg px-8 py-4 rounded-full font-bold transition-all transform hover:-translate-y-1"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className="h-2.5 w-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
            style={{
              backgroundColor: i === index ? 'white' : 'rgba(255,255,255,0.5)',
              transform: i === index ? 'scale(1.25)' : 'scale(1)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
