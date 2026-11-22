import type { ImpactFigure, SponsorshipPackage } from '@/lib/org';

/**
 * Admin-editable site content is stored as plain text, one item per line, so a non-developer can
 * edit it. These helpers convert between that text and the structured values the pages use.
 *
 * Impact figures:      value | label | reporting period | source      (period and source optional)
 * Sponsorship package: name | amount | benefit one; benefit two
 * Giving link:         name | https://paystack.com/pay/your-page
 */

const clean = (s: string | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
const LINE_BREAK = /\r?\n/;

export function parseImpactFigures(text: string): ImpactFigure[] {
  const out: ImpactFigure[] = [];
  for (const raw of text.split(LINE_BREAK)) {
    const line = raw.trim();
    if (!line) continue;
    const [value, label, period, source] = line.split('|').map(clean);
    if (!value || !label) continue;
    out.push({ value, label, ...(period ? { period } : {}), ...(source ? { source } : {}) });
  }
  return out;
}

export function serializeImpactFigures(items: ImpactFigure[]): string {
  return items
    .map((f) => [f.value, f.label, f.period ?? '', f.source ?? ''].join(' | ').replace(/( \| )+$/, ''))
    .join('\n');
}

export function parseSponsorshipPackages(text: string): SponsorshipPackage[] {
  const out: SponsorshipPackage[] = [];
  for (const raw of text.split(LINE_BREAK)) {
    const line = raw.trim();
    if (!line) continue;
    const [name, amount, benefits] = line.split('|').map(clean);
    if (!name || !amount) continue;
    out.push({
      name,
      amount,
      benefits: (benefits ?? '')
        .split(';')
        .map(clean)
        .filter(Boolean),
    });
  }
  return out;
}

export function serializeSponsorshipPackages(items: SponsorshipPackage[]): string {
  return items.map((p) => `${p.name} | ${p.amount} | ${p.benefits.join('; ')}`).join('\n');
}

export type GivingLink = { label: string; url: string };

const HTTPS_URL = /^https:\/\/\S+$/i;

/** Giving links: one per line, "label | https://paystack.com/pay/your-page". Only https links are kept. */
export function parseGivingLinks(text: string): GivingLink[] {
  const out: GivingLink[] = [];
  for (const raw of text.split(LINE_BREAK)) {
    const [label, url] = raw.split('|').map(clean);
    if (label && url && HTTPS_URL.test(url)) out.push({ label, url });
  }
  return out;
}

export function serializeGivingLinks(items: GivingLink[]): string {
  return items.map((l) => `${l.label} | ${l.url}`).join('\n');
}

/** A single https URL, or null when empty or not https. */
export function parseHttpsUrl(text: string): string | null {
  const v = text.trim();
  return HTTPS_URL.test(v) ? v : null;
}

export function parseRegistrationYear(text: string): number | null {
  const n = Number(text.trim());
  const current = new Date().getFullYear();
  return Number.isInteger(n) && n >= 2000 && n <= current ? n : null;
}
