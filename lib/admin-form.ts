/** Small helpers for reading admin form posts. */

export function readText(formData: FormData, key: string, max = 5000): string {
  return String(formData.get(key) ?? '').trim().slice(0, max);
}

export function readOptionalText(formData: FormData, key: string, max = 2000): string | null {
  const v = readText(formData, key, max);
  return v || null;
}

export function readDate(formData: FormData, key: string): Date | null {
  const raw = readText(formData, key, 40);
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function readNumber(formData: FormData, key: string): number | null {
  const raw = readText(formData, key, 30);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function readCheckbox(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on';
}

/** Accepts site-relative paths and https URLs only. */
export function readImageUrl(formData: FormData, key: string): string | null {
  const v = readOptionalText(formData, key, 500);
  if (!v) return null;
  return v.startsWith('/') || /^https:\/\//i.test(v) ? v : null;
}

/** Accepts https URLs only (for registration links). */
export function readHttpsUrl(formData: FormData, key: string): string | null {
  const v = readOptionalText(formData, key, 500);
  return v && /^https:\/\//i.test(v) ? v : null;
}

/** datetime-local value for an input, in UTC. */
export function toDateTimeLocal(value: Date | string | null | undefined): string {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 16);
}
