import {
  IMPACT_FIGURES,
  ORG_REGISTRATION_YEAR,
  SPONSORSHIP_PACKAGES,
  type ImpactFigure,
  type SponsorshipPackage,
} from '@/lib/org';
import {
  parseGivingLinks,
  parseHttpsUrl,
  parseImpactFigures,
  parseRegistrationYear,
  parseSponsorshipPackages,
} from '@/lib/site-content-parse';
import type { GivingLink } from '@/lib/site-content-parse';
import { loadWithDatabaseFallback } from '@/lib/public-db';
import { mongoSettingsFindManyByKeys } from '@/lib/mongo-settings-store';

export const CONTENT_KEYS = {
  impactFigures: 'content.impactFigures',
  sponsorshipPackages: 'content.sponsorshipPackages',
  registrationYear: 'content.registrationYear',
  givingLinks: 'content.givingLinks',
  monthlyGivingUrl: 'content.monthlyGivingUrl',
} as const;

export type SiteContent = {
  impactFigures: ImpactFigure[];
  sponsorshipPackages: SponsorshipPackage[];
  registrationYear: number | null;
  /** Paystack payment pages for specific programmes or funds, chosen on the Donate form. */
  givingLinks: GivingLink[];
  /** Paystack payment page or plan page for monthly giving. */
  monthlyGivingUrl: string | null;
};

const DEFAULTS: SiteContent = {
  impactFigures: IMPACT_FIGURES,
  sponsorshipPackages: SPONSORSHIP_PACKAGES,
  registrationYear: ORG_REGISTRATION_YEAR,
  givingLinks: [],
  monthlyGivingUrl: null,
};

/**
 * Content edited in the admin (Site content) wins; anything never saved falls back to lib/org.ts.
 * Saving an empty value hides that section on purpose.
 */
export async function getSiteContent(): Promise<SiteContent> {
  return loadWithDatabaseFallback({
    load: async () => {
      const rows = await mongoSettingsFindManyByKeys(Object.values(CONTENT_KEYS));
      const byKey = new Map(rows.map((r) => [r.key, r.value]));
      return {
        impactFigures: byKey.has(CONTENT_KEYS.impactFigures)
          ? parseImpactFigures(byKey.get(CONTENT_KEYS.impactFigures) ?? '')
          : DEFAULTS.impactFigures,
        sponsorshipPackages: byKey.has(CONTENT_KEYS.sponsorshipPackages)
          ? parseSponsorshipPackages(byKey.get(CONTENT_KEYS.sponsorshipPackages) ?? '')
          : DEFAULTS.sponsorshipPackages,
        registrationYear: byKey.has(CONTENT_KEYS.registrationYear)
          ? parseRegistrationYear(byKey.get(CONTENT_KEYS.registrationYear) ?? '')
          : DEFAULTS.registrationYear,
        givingLinks: parseGivingLinks(byKey.get(CONTENT_KEYS.givingLinks) ?? ''),
        monthlyGivingUrl: parseHttpsUrl(byKey.get(CONTENT_KEYS.monthlyGivingUrl) ?? ''),
      } satisfies SiteContent;
    },
    fallback: DEFAULTS,
    onError(error) {
      console.error('Site content unavailable, using built-in defaults:', error);
    },
  });
}
