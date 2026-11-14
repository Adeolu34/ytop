/**
 * Single source of truth for organisational facts shown across the site.
 * Update here, not in individual pages.
 *
 * Verified-data slots below are intentionally empty. Each section on the site that uses one stays
 * hidden until it is filled in, so nothing unverified is ever published by default.
 */
export const ORG_FOUNDED_YEAR = 2017;
export const ORG_RC_NUMBER = 'RC179444';

/** CAC registration year, confirmed by the organisation as 2021. Set to null to hide the milestone. */
export const ORG_REGISTRATION_YEAR: number | null = 2021;

/** Years of operation, counting the founding year (2017 -> 2026 = 9). */
export function yearsOfOperation(now: Date = new Date()): number {
  return now.getFullYear() - ORG_FOUNDED_YEAR;
}

export function journeyTitle(now: Date = new Date()): string {
  const n = yearsOfOperation(now);
  return `Our ${n} Years Journey`;
}

export type ImpactFigure = {
  /** Display value, e.g. "12,500+". */
  value: string;
  label: string;
  /** Reporting period, e.g. "January 2024 – December 2025". Required. */
  period: string;
  /** Where the number comes from, e.g. "Attendance records, 2024–2025". Required. */
  source: string;
};

/**
 * Organisation-wide impact figures for the homepage "Our Work. Our Reach. Our Results." section.
 * Every entry needs a reporting period and an identifiable source (master copy, publication controls).
 * Example entry:
 *   { value: '12,500+', label: 'Young people reached', period: '2017–2025', source: 'Beneficiary records' }
 */
export const IMPACT_FIGURES: ImpactFigure[] = [];

export type SponsorshipPackage = {
  name: string;
  /** Approved contribution, e.g. "₦500,000". */
  amount: string;
  /** What the sponsor receives and what it funds, from the approved programme budget. */
  benefits: string[];
};

/** Corporate sponsorship packages. Leave empty until prices are approved from programme budgets. */
export const SPONSORSHIP_PACKAGES: SponsorshipPackage[] = [];

/** Public path or URL of the approved organisational profile PDF, e.g. '/documents/ytop-profile.pdf'. */
export const ORG_PROFILE_URL: string | null = null;
