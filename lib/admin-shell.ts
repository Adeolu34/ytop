export type AdminIconKey =
  | 'dashboard'
  | 'users'
  | 'posts'
  | 'gallery'
  | 'settings'
  | 'team'
  | 'programs'
  | 'comments'
  | 'enquiries'
  | 'events'
  | 'testimonials'
  | 'campaigns'
  | 'documents'
  | 'content'
  | 'donations';

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
  { href: '/yadmin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/yadmin/settings', label: 'Site identity', icon: 'settings' },
  { href: '/yadmin/users', label: 'Users', icon: 'users' },
  { href: '/yadmin/posts', label: 'Posts', icon: 'posts' },
  { href: '/yadmin/gallery', label: 'Gallery', icon: 'gallery' },
  { href: '/yadmin/team', label: 'Team', icon: 'team' },
  { href: '/yadmin/programs', label: 'Programs', icon: 'programs' },
  { href: '/yadmin/events', label: 'Events', icon: 'events' },
  { href: '/yadmin/testimonials', label: 'Stories', icon: 'testimonials' },
  { href: '/yadmin/campaigns', label: 'Campaigns', icon: 'campaigns' },
  { href: '/yadmin/donations', label: 'Donations', icon: 'donations' },
  { href: '/yadmin/documents', label: 'Documents', icon: 'documents' },
  { href: '/yadmin/content', label: 'Site content', icon: 'content' },
  { href: '/yadmin/comments', label: 'Comments', icon: 'comments' },
  { href: '/yadmin/enquiries', label: 'Enquiries', icon: 'enquiries' },
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

const ENQUIRIES_META: AdminPageMeta = {
  eyebrow: 'Inbox',
  title: 'Enquiries',
  description: 'Read contact, volunteer, partnership and newsletter submissions.',
  searchPlaceholder: 'Search enquiries...',
};

const EVENTS_META: AdminPageMeta = {
  eyebrow: 'Public site',
  title: 'Events',
  description: 'Publish upcoming events and keep the archive current.',
  searchPlaceholder: 'Search events...',
};

const TESTIMONIALS_META: AdminPageMeta = {
  eyebrow: 'Public site',
  title: 'Participant stories',
  description: 'Manage the stories shown on the homepage and Stories page.',
  searchPlaceholder: 'Search stories...',
};

const CAMPAIGNS_META: AdminPageMeta = {
  eyebrow: 'Fundraising',
  title: 'Campaigns',
  description: 'Manage fundraising campaigns shown on the Donate page.',
  searchPlaceholder: 'Search campaigns...',
};

const DOCUMENTS_META: AdminPageMeta = {
  eyebrow: 'Public site',
  title: 'Documents',
  description: 'Publish reports, governance documents and the organisational profile.',
  searchPlaceholder: 'Search documents...',
};

const CONTENT_META: AdminPageMeta = {
  eyebrow: 'Public site',
  title: 'Site content',
  description: 'Edit impact figures, sponsorship packages and the registration year.',
  searchPlaceholder: 'Search content...',
};

const DONATIONS_META: AdminPageMeta = {
  eyebrow: 'Fundraising',
  title: 'Donations',
  description: 'Gifts confirmed by Paystack.',
  searchPlaceholder: 'Search donations...',
};

export function getAdminPageMeta(pathname: string): AdminPageMeta {
  if (pathname.startsWith('/yadmin/donations') || pathname.startsWith('/admin/donations')) {
    return DONATIONS_META;
  }

  if (pathname.startsWith('/yadmin/documents') || pathname.startsWith('/admin/documents')) {
    return DOCUMENTS_META;
  }

  if (pathname.startsWith('/yadmin/content') || pathname.startsWith('/admin/content')) {
    return CONTENT_META;
  }

  if (pathname.startsWith('/yadmin/events') || pathname.startsWith('/admin/events')) {
    return EVENTS_META;
  }

  if (pathname.startsWith('/yadmin/testimonials') || pathname.startsWith('/admin/testimonials')) {
    return TESTIMONIALS_META;
  }

  if (pathname.startsWith('/yadmin/campaigns') || pathname.startsWith('/admin/campaigns')) {
    return CAMPAIGNS_META;
  }

  if (pathname.startsWith('/yadmin/enquiries') || pathname.startsWith('/admin/enquiries')) {
    return ENQUIRIES_META;
  }

  if (pathname.startsWith('/yadmin/settings') || pathname.startsWith('/admin/settings')) {
    return SETTINGS_META;
  }

  if (pathname.startsWith('/yadmin/users') || pathname.startsWith('/admin/users')) {
    return USER_META;
  }

  if (pathname.startsWith('/yadmin/posts') || pathname.startsWith('/admin/posts')) {
    return POST_META;
  }

  if (pathname.startsWith('/yadmin/comments') || pathname.startsWith('/admin/comments')) {
    return COMMENTS_META;
  }

  if (pathname.startsWith('/yadmin/team') || pathname.startsWith('/admin/team')) {
    return TEAM_META;
  }

  if (pathname.startsWith('/yadmin/programs') || pathname.startsWith('/admin/programs')) {
    return PROGRAMS_META;
  }

  if (
    pathname.startsWith('/yadmin/gallery') ||
    pathname.startsWith('/yadmin/media') ||
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
  if (itemHref === '/yadmin') {
    return pathname === '/yadmin' || pathname === '/admin';
  }

  return pathname === itemHref || pathname.startsWith(`${itemHref}/`);
}
