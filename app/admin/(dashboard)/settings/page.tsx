import { requireAdmin } from '@/lib/auth-utils';
import prisma from '@/lib/db';
import SiteSettingsForm from '@/components/admin/settings/SiteSettingsForm';

async function loadSettings() {
  const keys = [
    'site_name',
    'site_tagline',
    'site_logo_url',
    'site_favicon_url',
    'brand_primary_hex',
    'brand_secondary_hex',
  ] as const;

  const rows = await prisma.settings.findMany({
    where: { key: { in: [...keys] } },
  });

  const map = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<
    string,
    string
  >;

  return {
    siteName: map.site_name || 'YTOP Global',
    siteTagline:
      map.site_tagline ||
      'Young Talented Optimistic and Potential Organization',
    siteLogoUrl: map.site_logo_url || '',
    siteFaviconUrl: map.site_favicon_url || '',
    brandPrimaryHex: map.brand_primary_hex || '#EF4444',
    brandSecondaryHex: map.brand_secondary_hex || '#1E3A8A',
  };
}

export default async function AdminSiteSettingsPage() {
  await requireAdmin();

  const [initialValues, mediaList] = await Promise.all([
    loadSettings(),
    prisma.media.findMany({
      where: { type: 'IMAGE' },
      take: 200,
      orderBy: { createdAt: 'desc' },
      select: { id: true, filename: true, url: true },
    }),
  ]);

  const imageOptions = mediaList.map((m) => ({
    id: m.id,
    label: m.filename,
    url: m.url,
  }));

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section>
        <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
          Configuration
        </span>
        <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
          Site identity
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
          Logo, favicon, and brand colors apply to the public website. Only
          administrators can change these settings.
        </p>
      </section>

      <SiteSettingsForm
        initialValues={initialValues}
        imageOptions={imageOptions}
      />
    </div>
  );
}
