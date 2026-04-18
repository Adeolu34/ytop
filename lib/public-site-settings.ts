import { unstable_cache, revalidateTag } from 'next/cache';
import { isMongoConfigured } from '@/lib/mongodb';
import { mongoSettingsFindManyByKeys } from '@/lib/mongo-settings-store';

export type PublicSiteIdentity = {
  siteName: string;
  siteTagline: string;
  siteLogoUrl: string | null;
  siteFaviconUrl: string | null;
  brandPrimaryHex: string | null;
  brandSecondaryHex: string | null;
};

const DEFAULT_NAME = 'YTOP Global';
const DEFAULT_TAGLINE =
  'Young Talented Optimistic and Potential Organization';

function defaultPublicSiteIdentity(): PublicSiteIdentity {
  return {
    siteName: DEFAULT_NAME,
    siteTagline: DEFAULT_TAGLINE,
    siteLogoUrl: null,
    siteFaviconUrl: null,
    brandPrimaryHex: null,
    brandSecondaryHex: null,
  };
}

function isHexColor(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value.trim());
}

async function loadIdentityFromDb(): Promise<PublicSiteIdentity> {
  if (!isMongoConfigured()) {
    return defaultPublicSiteIdentity();
  }

  const keys = [
    'site_name',
    'site_tagline',
    'site_logo_url',
    'site_favicon_url',
    'brand_primary_hex',
    'brand_secondary_hex',
  ] as const;

  try {
    const rows = await mongoSettingsFindManyByKeys([...keys]);

    const map = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<
      string,
      string
    >;

    const primary = map.brand_primary_hex?.trim();
    const secondary = map.brand_secondary_hex?.trim();

    return {
      siteName: map.site_name?.trim() || DEFAULT_NAME,
      siteTagline: map.site_tagline?.trim() || DEFAULT_TAGLINE,
      siteLogoUrl: map.site_logo_url?.trim() || null,
      siteFaviconUrl: map.site_favicon_url?.trim() || null,
      brandPrimaryHex: primary && isHexColor(primary) ? primary : null,
      brandSecondaryHex: secondary && isHexColor(secondary) ? secondary : null,
    };
  } catch {
    return defaultPublicSiteIdentity();
  }
}

export const getPublicSiteIdentity = unstable_cache(
  loadIdentityFromDb,
  ['public-site-identity'],
  { revalidate: 60, tags: ['site-settings'] }
);

export function revalidateSiteIdentityCache(): void {
  revalidateTag('site-settings', 'default');
}
