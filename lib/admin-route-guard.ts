const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export function isProtectedAdminPath(pathname: string): boolean {
  if (!pathname.startsWith('/admin')) {
    return false;
  }

  return !PUBLIC_ADMIN_PATHS.some(
    (publicPath) =>
      pathname === publicPath || pathname.startsWith(`${publicPath}/`)
  );
}

export function buildAdminLoginRedirectUrl(requestUrl: string): string {
  const url = new URL(requestUrl);
  const callbackUrl = `${url.pathname}${url.search}`;

  url.pathname = '/admin/login';
  url.search = new URLSearchParams({ callbackUrl }).toString();

  return url.toString();
}
