export type AdminIconKey = 'dashboard' | 'users' | 'posts' | 'gallery';

export type AdminNavItem = {
  href: string;
  label: string;
  icon: AdminIconKey;
};

export type AdminPageMeta = {
  eyebrow: string;
  title: string;
  description: string;
  searchPlaceholder: string;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/users', label: 'User Management', icon: 'users' },
  { href: '/admin/posts', label: 'Post Management', icon: 'posts' },
  { href: '/admin/gallery', label: 'Gallery Management', icon: 'gallery' },
];

const DASHBOARD_META: AdminPageMeta = {
  eyebrow: 'System Overview',
  title: 'Dashboard',
  description:
    'Monitor platform activity, publishing velocity, and media growth.',
  searchPlaceholder: 'Search analytics or items...',
};

const USER_META: AdminPageMeta = {
  eyebrow: 'Access & Roles',
  title: 'User Management',
  description: 'Manage administrators, authors, and platform access.',
  searchPlaceholder: 'Search users, roles, or status...',
};

const POST_META: AdminPageMeta = {
  eyebrow: 'Content Management',
  title: 'Post Management',
  description: 'Review published stories, drafts, and editorial momentum.',
  searchPlaceholder: 'Search posts, authors, or tags...',
};

const COMMENTS_META: AdminPageMeta = {
  eyebrow: 'Trust & Moderation',
  title: 'Comment Moderation',
  description: 'Review held comments and protect the community from spam.',
  searchPlaceholder: 'Search comments, authors, or posts...',
};

const GALLERY_META: AdminPageMeta = {
  eyebrow: 'Visual Assets',
  title: 'Gallery Management',
  description: 'Browse media assets, storage usage, and recent uploads.',
  searchPlaceholder: 'Search gallery assets...',
};

export function getAdminPageMeta(pathname: string): AdminPageMeta {
  if (pathname.startsWith('/admin/users')) {
    return USER_META;
  }

  if (pathname.startsWith('/admin/posts')) {
    return POST_META;
  }

  if (pathname.startsWith('/admin/comments')) {
    return COMMENTS_META;
  }

  if (
    pathname.startsWith('/admin/gallery') ||
    pathname.startsWith('/admin/media')
  ) {
    return GALLERY_META;
  }

  return DASHBOARD_META;
}

export function isAdminNavItemActive(
  pathname: string,
  itemHref: string
): boolean {
  if (itemHref === '/admin') {
    return pathname === '/admin';
  }

  return pathname === itemHref || pathname.startsWith(`${itemHref}/`);
}
