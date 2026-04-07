'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const DEFAULT_LOGO_SRC = '/media/2023/03/YTOP-PNGGG-2022.png';

type LogoProps = {
  logoUrl?: string | null;
  siteName?: string;
};

export default function Logo({ logoUrl, siteName = 'YTOP Global' }: LogoProps) {
  const [failed, setFailed] = useState(false);
  const src = logoUrl?.trim() || DEFAULT_LOGO_SRC;

  return (
    <Link href="/" className="flex items-center group">
      {!failed ? (
        <div className="relative h-12 w-[160px] flex-shrink-0">
          <Image
            src={src}
            alt={siteName}
            fill
            className="object-contain object-left"
            sizes="160px"
            onError={() => setFailed(true)}
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary flex items-center justify-center text-white font-display font-bold text-lg shadow-ytop group-hover:shadow-ytop-lg transition-all duration-300">
          YG
        </div>
      )}
    </Link>
  );
}
