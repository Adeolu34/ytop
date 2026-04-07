export type AdminIconKey =
  | 'dashboard'
  | 'users'
  | 'posts'
  | 'gallery'
  | 'settings'
  | 'team'
  | 'programs'
  | 'comments';

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
  { href: '/admin/settings', label: 'Site identity', icon: 'settings' },
  { href: '/admin/users', label: 'Users', icon: 'users' },
  { href: '/admin/posts', label: 'Posts', icon: 'posts' },
  { href: '/admin/gallery', label: 'Gallery', icon: 'gallery' },
  { href: '/admin/team', label: 'Team', icon: 'team' },
  { href: '/admin/programs', label: 'Programs', icon: 'programs' },
  { href: '/admin/comments', label: 'Comments', icon: 'comments' },
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

const SETTINGS_META: AdminPageMeta = {
  eyebrow: 'Configuration',
  title: 'Site identity',
  description: 'Logo, favicon, and brand colors for the public website.',
  searchPlaceholder: 'Search settings...',
};

const TEAM_META: AdminPageMeta = {
  eyebrow: 'People',
  title: 'Team members',
  description: 'Manage leadership and staff profiles shown on the site.',
  searchPlaceholder: 'Search team...',
};

const PROGRAMS_META: AdminPageMeta = {
  eyebrow: 'Programs',
  title: 'Programs',
  description: 'Create and edit program pages and imagery.',
  searchPlaceholder: 'Search programs...',
};

export function getAdminPageMeta(pathname: string): AdminPageMeta {
  if (pathname.startsWith('/admin/settings')) {
    return SETTINGS_META;
  }

  if (pathname.startsWith('/admin/users')) {
    return USER_META;
  }

  if (pathname.startsWith('/admin/posts')) {
    return POST_META;
  }

  if (pathname.startsWith('/admin/comments')) {
    return COMMENTS_META;
  }

  if (pathname.startsWith('/admin/team')) {
    return TEAM_META;
  }

  if (pathname.startsWith('/admin/programs')) {
    return PROGRAMS_META;
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
