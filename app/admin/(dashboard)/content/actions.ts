'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-utils';
import { createAdminRedirectUrl } from '@/lib/admin-feedback';
import { readText } from '@/lib/admin-form';
import { mongoSettingsUpsert } from '@/lib/mongo-settings-store';
import { CONTENT_KEYS } from '@/lib/site-content';
import {
  parseGivingLinks,
  parseHttpsUrl,
  parseImpactFigures,
  parseRegistrationYear,
  parseSponsorshipPackages,
  serializeGivingLinks,
  serializeImpactFigures,
  serializeSponsorshipPackages,
} from '@/lib/site-content-parse';

const INDEX_PATH = '/admin/content';

export async function saveSiteContentAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const impactText = readText(formData, 'impactFigures', 5000);
  const packagesText = readText(formData, 'sponsorshipPackages', 8000);
  const yearText = readText(formData, 'registrationYear', 10);
  const givingText = readText(formData, 'givingLinks', 4000);
  const monthlyText = readText(formData, 'monthlyGivingUrl', 500);

  if (yearText && parseRegistrationYear(yearText) === null) {
    redirect(
      createAdminRedirectUrl(INDEX_PATH, {
        error: `Registration year must be a four-digit year between 2000 and ${new Date().getFullYear()}, or left empty.`,
      })
    );
  }

  if (monthlyText && parseHttpsUrl(monthlyText) === null) {
    redirect(createAdminRedirectUrl(INDEX_PATH, { error: 'The monthly giving link must start with https://.' }));
  }

  // Normalise through the parser so malformed lines are dropped rather than stored.
  await mongoSettingsUpsert({
    key: CONTENT_KEYS.impactFigures,
    value: serializeImpactFigures(parseImpactFigures(impactText)),
    group: 'content',
  });
  await mongoSettingsUpsert({
    key: CONTENT_KEYS.sponsorshipPackages,
    value: serializeSponsorshipPackages(parseSponsorshipPackages(packagesText)),
    group: 'content',
  });
  await mongoSettingsUpsert({ key: CONTENT_KEYS.registrationYear, value: yearText, group: 'content' });

  await mongoSettingsUpsert({
    key: CONTENT_KEYS.givingLinks,
    value: serializeGivingLinks(parseGivingLinks(givingText)),
    group: 'content',
  });
  await mongoSettingsUpsert({
    key: CONTENT_KEYS.monthlyGivingUrl,
    value: parseHttpsUrl(monthlyText) ?? '',
    group: 'content',
  });

  for (const path of ['/', '/about', '/impact', '/get-involved/sponsor', '/donate']) revalidatePath(path);
  redirect(createAdminRedirectUrl(INDEX_PATH, { notice: 'Site content saved.' }));
}
