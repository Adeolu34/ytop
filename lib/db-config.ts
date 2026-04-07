/**
 * Postgres URL detection only — does not import Prisma (safe for API routes during `next build`
 * when DATABASE_URL is unset; avoids loading `lib/db.ts` until you dynamic-import it).
 */
export function getPostgresConnectionString(): string | undefined {
  const a = process.env.DATABASE_URL?.trim();
  const b = process.env.NETLIFY_DATABASE_URL?.trim();
  return a || b || undefined;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(getPostgresConnectionString());
}
