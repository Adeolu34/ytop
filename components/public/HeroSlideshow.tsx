'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SLIDE_INTERVAL_MS = 5500;

export default function HeroSlideshow({
  images,
  tagline,
  title,
  description,
}: {
  images: string[];
  tagline: string;
  title: string;
  description: string;
}) {
  const [index, setIndex] = useState(0);
  const len = images.length;
  const nextIndex = (index + 1) % len;
  const slot0Visible = index % 2 === 0;
  const slot0Src = slot0Visible ? images[index] : images[nextIndex];
  const slot1Src = slot0Visible ? images[nextIndex] : images[index];

  const goTo = useCallback((i: number) => {
    setIndex(i);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % len);
  }, [len]);

  useEffect(() => {
    const id = setInterval(next, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Only 2 slides in DOM: current + next (reduces initial load from 5 to 2 images) */}
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
        <div className="absolute inset-0 bg-slate-900/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900/80" />
      </div>
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
        <div className="absolute inset-0 bg-slate-900/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900/80" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10 py-20 md:py-28">
        <p className="text-sm uppercase tracking-[0.2em] text-white mb-4 font-bold [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
          {tagline}
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight [text-shadow:0_2px_8px_rgba(0,0,0,0.7),0_0_40px_rgba(0,0,0,0.3)]">
          {title}
        </h1>
        <div className="max-w-3xl mx-auto mb-12 px-4 py-5 rounded-2xl bg-black/40 backdrop-blur-sm">
          <p className="text-lg md:text-xl text-white leading-relaxed [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
            {description}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/about"
            className="group inline-flex items-center justify-center px-8 py-4 bg-ytop-blue text-white font-bold rounded-xl hover:bg-ytop-blue-hover shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Read more
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href="https://paystack.com/pay/ytopglobalpay/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center px-8 py-4 bg-ytop-red text-white font-bold rounded-xl border-2 border-white/30 hover:bg-ytop-red-hover hover:border-white shadow-lg transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Donate
          </a>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className="h-2.5 w-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
            style={{
              backgroundColor: i === index ? 'white' : 'rgba(255,255,255,0.4)',
              transform: i === index ? 'scale(1.25)' : 'scale(1)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
