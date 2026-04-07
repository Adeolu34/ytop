/** Official YTOP Global social URLs — single source of truth */
export const YTOP_SOCIAL_URLS = {
  facebook: 'https://www.facebook.com/YTOPGLOBAL/',
  linkedin: 'https://www.linkedin.com/company/ytop-global',
  instagram: 'https://instagram.com/ytop_global?igshid=YmMyMTA2M2Y=',
  twitter:
    'https://twitter.com/YTOPGLOBAL?t=Au30L44yTfn1blw7uwsr0w&s=09',
  telegram: 'https://t.me/ytopglobal/1',
  youtube: 'https://youtube.com/@ytopglobal?si=WwnPQYHrEXs93O28',
  tiktok:
    'https://www.tiktok.com/@ytop_global?_t=ZM-8yvynQ3n4Q1&_r=1',
} as const;

/** Order matches typical display; use for JSON-LD `sameAs` */
export const YTOP_SOCIAL_SAME_AS: string[] = [
  YTOP_SOCIAL_URLS.facebook,
  YTOP_SOCIAL_URLS.linkedin,
  YTOP_SOCIAL_URLS.instagram,
  YTOP_SOCIAL_URLS.twitter,
  YTOP_SOCIAL_URLS.telegram,
  YTOP_SOCIAL_URLS.youtube,
  YTOP_SOCIAL_URLS.tiktok,
];
