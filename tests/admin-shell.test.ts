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
  assert.equal(isAdminNavItemActive('/admin', '/admin'), true);
  assert.equal(isAdminNavItemActive('/admin/posts', '/admin'), false);
});

test('marks nested admin routes active by prefix', () => {
  assert.equal(isAdminNavItemActive('/admin/posts', '/admin/posts'), true);
  assert.equal(isAdminNavItemActive('/admin/posts/123/edit', '/admin/posts'), true);
  assert.equal(isAdminNavItemActive('/admin/gallery', '/admin/users'), false);
});

test('defines the four primary admin sections from the Stitch designs', () => {
  assert.deepEqual(
    ADMIN_NAV_ITEMS.map((item) => item.href),
    ['/admin', '/admin/users', '/admin/posts', '/admin/gallery']
  );
});
