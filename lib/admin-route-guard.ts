const ADMIN_BASE_PATH = '/yadmin';
const LEGACY_ADMIN_BASE_PATH = '/admin';
const PUBLIC_ADMIN_PATHS = [`${ADMIN_BASE_PATH}/login`];

function normalizeAdminPath(pathname: string): string {
  if (pathname.startsWith(LEGACY_ADMIN_BASE_PATH)) {
    return pathname.replace(LEGACY_ADMIN_BASE_PATH, ADMIN_BASE_PATH);
  }
  return pathname;
}

export function isProtectedAdminPath(pathname: string): boolean {
  const normalizedPath = normalizeAdminPath(pathname);
  if (!normalizedPath.startsWith(ADMIN_BASE_PATH)) {
    return false;
  }

  return !PUBLIC_ADMIN_PATHS.some(
    (publicPath) =>
      normalizedPath === publicPath || normalizedPath.startsWith(`${publicPath}/`)
  );
}

export function buildAdminLoginRedirectUrl(requestUrl: string): string {
  const url = new URL(requestUrl);
  const callbackUrl = `${normalizeAdminPath(url.pathname)}${url.search}`;

  url.pathname = `${ADMIN_BASE_PATH}/login`;
  url.search = new URLSearchParams({ callbackUrl }).toString();

  return url.toString();
}
