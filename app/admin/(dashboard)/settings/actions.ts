'use server';

import { requireAdmin } from '@/lib/auth-utils';
import { mongoSettingsUpsert } from '@/lib/mongo-settings-store';
import { revalidateSiteIdentityCache } from '@/lib/public-site-settings';
import { revalidatePath } from 'next/cache';

const HEX = /^#[0-9A-Fa-f]{6}$/;

function readString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

export type SiteSettingsState = { error: string | null; notice: string | null };

export async function updateSiteSettingsAction(
  _prev: SiteSettingsState,
  formData: FormData
): Promise<SiteSettingsState> {
  await requireAdmin();

  const siteName = readString(formData, 'site_name');
  const siteTagline = readString(formData, 'site_tagline');
  const siteLogoUrl = readString(formData, 'site_logo_url');
  const siteFaviconUrl = readString(formData, 'site_favicon_url');
  const brandPrimary = readString(formData, 'brand_primary_hex');
  const brandSecondary = readString(formData, 'brand_secondary_hex');

  if (!siteName) {
    return { error: 'Site name is required.', notice: null };
  }

  if (brandPrimary && !HEX.test(brandPrimary)) {
    return {
      error: 'Primary brand color must be a valid hex color like #EF4444.',
      notice: null,
    };
  }

  if (brandSecondary && !HEX.test(brandSecondary)) {
    return {
      error: 'Secondary brand color must be a valid hex color like #1E3A8A.',
      notice: null,
    };
  }

  const upserts: { key: string; value: string; group: string }[] = [
    { key: 'site_name', value: siteName, group: 'general' },
    { key: 'site_tagline', value: siteTagline, group: 'general' },
    { key: 'site_logo_url', value: siteLogoUrl, group: 'branding' },
    { key: 'site_favicon_url', value: siteFaviconUrl, group: 'branding' },
    { key: 'brand_primary_hex', value: brandPrimary, group: 'branding' },
    { key: 'brand_secondary_hex', value: brandSecondary, group: 'branding' },
  ];

  for (const row of upserts) {
    await mongoSettingsUpsert({
      key: row.key,
      value: row.value,
      group: row.group,
    });
  }

  revalidateSiteIdentityCache();
  revalidatePath('/', 'layout');
  revalidatePath('/admin/settings');

  return { error: null, notice: 'Site identity saved. Public pages will update within a minute.' };
}
