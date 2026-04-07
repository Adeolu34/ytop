import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Send,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { YTOP_SOCIAL_URLS } from '@/lib/ytop-social-urls';

function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

type SocialIconLinksVariant = 'footer' | 'contact' | 'mobile';

type Item = {
  key: keyof typeof YTOP_SOCIAL_URLS;
  label: string;
  Icon: LucideIcon | typeof TikTokGlyph;
};

const ITEMS: Item[] = [
  { key: 'facebook', label: 'Facebook', Icon: Facebook },
  { key: 'twitter', label: 'Twitter', Icon: Twitter },
  { key: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
  { key: 'instagram', label: 'Instagram', Icon: Instagram },
  { key: 'telegram', label: 'Telegram', Icon: Send },
  { key: 'youtube', label: 'YouTube', Icon: Youtube },
  { key: 'tiktok', label: 'TikTok', Icon: TikTokGlyph },
];

export default function SocialIconLinks({
  variant,
}: {
  variant: SocialIconLinksVariant;
}) {
  return (
    <div
      className={
        variant === 'mobile'
          ? 'flex flex-wrap items-center justify-center gap-4'
          : 'flex flex-wrap gap-3'
      }
    >
      {ITEMS.map(({ key, label, Icon }, i) => {
        const href = YTOP_SOCIAL_URLS[key];
        const tilt =
          variant !== 'mobile'
            ? i % 2 === 0
              ? 'hover:-rotate-6'
              : 'hover:rotate-6'
            : undefined;

        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              variant === 'footer' &&
                'w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:text-white transition-all duration-300 cursor-pointer transform hover:scale-110',
              variant === 'footer' &&
                (key === 'instagram' ? 'hover:bg-primary' : 'hover:bg-white/20'),
              variant === 'contact' &&
                'w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer transform hover:scale-110',
              variant === 'contact' && tilt,
              variant === 'footer' && tilt,
              variant === 'mobile' &&
                'text-gray-600 dark:text-gray-400 hover:text-primary transition p-1'
            )}
            aria-label={label}
          >
            <Icon
              className={variant === 'mobile' ? 'w-6 h-6' : 'w-5 h-5'}
            />
          </a>
        );
      })}
    </div>
  );
}
