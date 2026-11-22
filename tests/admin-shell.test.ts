import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ADMIN_NAV_ITEMS,
  getAdminPageMeta,
  isAdminNavItemActive,
} from '../lib/admin-shell';

test('returns the dashboard metadata for the admin root', () => {
  assert.deepEqual(getAdminPageMeta('/admin'), {
    eyebrow: 'System Overview',
    title: 'Dashboard',
    description: 'Monitor platform activity, publishing velocity, and media growth.',
    searchPlaceholder: 'Search analytics or items...',
  });
});

test('returns route-specific metadata for managed sections', () => {
  assert.equal(getAdminPageMeta('/admin/posts').title, 'Post Management');
  assert.equal(getAdminPageMeta('/admin/users').title, 'User Management');
  assert.equal(getAdminPageMeta('/admin/gallery').title, 'Gallery Management');
  assert.equal(getAdminPageMeta('/admin/comments').title, 'Comment Moderation');
});

test('marks admin root as active only on the exact dashboard path', () => {
  assert.equal(isAdminNavItemActive('/yadmin', '/yadmin'), true);
  assert.equal(isAdminNavItemActive('/yadmin/posts', '/yadmin'), false);
});

test('marks nested admin routes active by prefix', () => {
  assert.equal(isAdminNavItemActive('/admin/posts', '/admin/posts'), true);
  assert.equal(isAdminNavItemActive('/admin/posts/123/edit', '/admin/posts'), true);
  assert.equal(isAdminNavItemActive('/admin/gallery', '/admin/users'), false);
});

test('defines the primary admin sections under the public /yadmin prefix', () => {
  assert.deepEqual(
    ADMIN_NAV_ITEMS.map((item) => item.href),
    [
      '/yadmin',
      '/yadmin/settings',
      '/yadmin/users',
      '/yadmin/posts',
      '/yadmin/gallery',
      '/yadmin/team',
      '/yadmin/programs',
      '/yadmin/events',
      '/yadmin/testimonials',
      '/yadmin/campaigns',
      '/yadmin/donations',
      '/yadmin/documents',
      '/yadmin/content',
      '/yadmin/comments',
      '/yadmin/enquiries',
    ]
  );
});
