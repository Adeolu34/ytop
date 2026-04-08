import NextAuth from 'next-auth';
import type { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';
import authConfig from '@/lib/auth.config';
import {
  buildAdminLoginRedirectUrl,
  isProtectedAdminPath,
} from '@/lib/admin-route-guard';

/**
 * Edge-safe Auth.js client: no Prisma / pg (see lib/auth.config.ts).
 * Full login + adapter live in lib/auth.ts.
 */
const { auth } = NextAuth(authConfig);

/**
 * WordPress → Next.js URL mappings (exact paths). Extend as needed.
 */
const urlMappings = new Map<string, string>([]);

/**
 * Track redirect in database (optional; not used yet).
 */
async function trackRedirect(_fromUrl: string, _toUrl: string) {
  // Reserved for Prisma Redirect model
}

/**
 * Generate redirect URL based on patterns
 */
function getRedirectUrl(pathname: string): string | null {
  const wpPostPattern = /^\/\d{4}\/\d{2}\/\d{2}\/([^\/]+)\/?$/;
  const wpPostMatch = pathname.match(wpPostPattern);
  if (wpPostMatch) {
    return `/blog/${wpPostMatch[1]}`;
  }

  const wpCategoryPattern = /^\/category\/([^\/]+)\/?$/;
  const wpCategoryMatch = pathname.match(wpCategoryPattern);
  if (wpCategoryMatch) {
    return `/blog/category/${wpCategoryMatch[1]}`;
  }

  const wpTagPattern = /^\/tag\/([^\/]+)\/?$/;
  const wpTagMatch = pathname.match(wpTagPattern);
  if (wpTagMatch) {
    return `/blog/tag/${wpTagMatch[1]}`;
  }

  const wpAuthorPattern = /^\/author\/([^\/]+)\/?$/;
  const wpAuthorMatch = pathname.match(wpAuthorPattern);
  if (wpAuthorMatch) {
    return `/blog/author/${wpAuthorMatch[1]}`;
  }

  if (pathname.endsWith('/') && pathname.length > 1) {
    return pathname.slice(0, -1);
  }

  return null;
}

export default auth((request: NextAuthRequest) => {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|json|xml|txt)$/)
  ) {
    return NextResponse.next();
  }

  if (isProtectedAdminPath(pathname)) {
    if (!request.auth?.user) {
      return NextResponse.redirect(buildAdminLoginRedirectUrl(request.url), {
        status: 307,
      });
    }
  }

  if (urlMappings.has(pathname)) {
    const redirectTo = urlMappings.get(pathname)!;
    void trackRedirect(pathname, redirectTo).catch(console.error);
    const url = request.nextUrl.clone();
    url.pathname = redirectTo;
    return NextResponse.redirect(url, { status: 301 });
  }

  const patternRedirect = getRedirectUrl(pathname);
  if (patternRedirect) {
    void trackRedirect(pathname, patternRedirect).catch(console.error);
    const url = request.nextUrl.clone();
    url.pathname = patternRedirect;
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
