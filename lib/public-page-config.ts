/**
 * ISR window for public routes (seconds). Cached HTML is served from the CDN/edge
 * and regenerated in the background at most this often — much faster than
 * force-dynamic + revalidate 0 on every request.
 *
 * App Router requires `export const revalidate = 60` as a **numeric literal** in
 * each `page.tsx` (imports are not statically analyzable). Keep this value in sync.
 *
 * Tune: higher = faster/cheaper, lower = fresher content. Admin actions can call
 * revalidatePath / revalidateTag where needed for instant updates.
 */
export const PUBLIC_PAGE_REVALIDATE_SECONDS = 60;
