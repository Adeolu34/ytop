'use client';

import { useActionState, useRef } from 'react';
import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import AdminSubmitButton from '@/components/admin/forms/AdminSubmitButton';
import {
  updateSiteSettingsAction,
  type SiteSettingsState,
} from '@/app/admin/(dashboard)/settings/actions';

const INITIAL: SiteSettingsState = { error: null, notice: null };

type SiteSettingsFormProps = {
  initialValues: {
    siteName: string;
    siteTagline: string;
    siteLogoUrl: string;
    siteFaviconUrl: string;
    brandPrimaryHex: string;
    brandSecondaryHex: string;
  };
  imageOptions: Array<{ id: string; label: string; url: string }>;
};

export default function SiteSettingsForm({
  initialValues,
  imageOptions,
}: SiteSettingsFormProps) {
  const [state, formAction] = useActionState(updateSiteSettingsAction, INITIAL);
  const logoInputRef = useRef<HTMLInputElement>(null);

  return (
    <form action={formAction} className="space-y-8">
      {state.error ? <AdminFlashBanner type="error" message={state.error} /> : null}
      {state.notice ? (
        <AdminFlashBanner type="notice" message={state.notice} />
      ) : null}

      <div className="admin-surface-card rounded-2xl p-8">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
          General
        </p>
        <h2 className="admin-font-display mt-2 text-2xl font-bold text-[#1b1c1c]">
          Site name & tagline
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
              Site name
            </span>
            <input
              name="site_name"
              required
              defaultValue={initialValues.siteName}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
              Tagline
            </span>
            <input
              name="site_tagline"
              defaultValue={initialValues.siteTagline}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
        </div>
      </div>

      <div className="admin-surface-card rounded-2xl p-8">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
          Branding
        </p>
        <h2 className="admin-font-display mt-2 text-2xl font-bold text-[#1b1c1c]">
          Logo, favicon & colors
        </h2>
        <p className="mt-2 text-sm text-[#5d3f3c]">
          Use full URLs (e.g. Cloudinary) or site paths like{' '}
          <code className="rounded bg-[#efeded] px-1">/media/...</code>. Colors
          must be six-digit hex (e.g. #EF4444).
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
              Logo URL
            </span>
            <input
              ref={logoInputRef}
              name="site_logo_url"
              defaultValue={initialValues.siteLogoUrl}
              placeholder="/media/2023/03/logo.png"
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
              Pick logo from gallery
            </span>
            <select
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
              defaultValue=""
              onChange={(e) => {
                const opt = imageOptions.find((o) => o.id === e.target.value);
                if (opt && logoInputRef.current) {
                  logoInputRef.current.value = opt.url;
                }
              }}
            >
              <option value="">— Optional: set logo URL from media —</option>
              {imageOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
              Favicon URL
            </span>
            <input
              name="site_favicon_url"
              defaultValue={initialValues.siteFaviconUrl}
              placeholder="/favicon.ico"
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
              Primary brand color
            </span>
            <input
              name="brand_primary_hex"
              defaultValue={initialValues.brandPrimaryHex}
              placeholder="#EF4444"
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm font-mono"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
              Secondary brand color
            </span>
            <input
              name="brand_secondary_hex"
              defaultValue={initialValues.brandSecondaryHex}
              placeholder="#1E3A8A"
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm font-mono"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <AdminSubmitButton idleLabel="Save settings" pendingLabel="Saving..." />
      </div>
    </form>
  );
}
