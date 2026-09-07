/**
 * Canonical site URL — set NEXT_PUBLIC_SITE_URL in your environment.
 * Change this one env var when you point a custom domain.
 */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ytop.netlify.app').replace(/\/$/, '');
}
