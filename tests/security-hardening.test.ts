import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildAdminLoginRedirectUrl,
  isProtectedAdminPath,
} from '../lib/admin-route-guard';
import { normalizeSubscriberEmail } from '../lib/newsletter';
import { resolveSeedAdminCredentials } from '../lib/seed-admin';

test('protects admin routes but leaves the login page public', () => {
  assert.equal(isProtectedAdminPath('/admin'), true);
  assert.equal(isProtectedAdminPath('/admin/posts'), true);
  assert.equal(isProtectedAdminPath('/admin/login'), false);
  assert.equal(isProtectedAdminPath('/admin/login/reset'), false);
  assert.equal(isProtectedAdminPath('/blog'), false);
});

test('builds a callback-aware admin login redirect URL', () => {
  const redirectUrl = buildAdminLoginRedirectUrl(
    'https://example.com/admin/posts?draft=1'
  );

  assert.equal(
    redirectUrl,
    'https://example.com/admin/login?callbackUrl=%2Fadmin%2Fposts%3Fdraft%3D1'
  );
});

test('normalizes subscriber emails for deduplication', () => {
  assert.equal(
    normalizeSubscriberEmail('  Person@Example.COM  '),
    'person@example.com'
  );
});

test('requires explicit admin seed credentials in production', () => {
  assert.throws(
    () =>
      resolveSeedAdminCredentials({
        NODE_ENV: 'production',
      }),
    /ADMIN_EMAIL and ADMIN_PASSWORD/
  );
});

test('uses env-provided admin seed credentials when present', () => {
  assert.deepEqual(
    resolveSeedAdminCredentials({
      NODE_ENV: 'production',
      ADMIN_EMAIL: 'admin@example.com',
      ADMIN_PASSWORD: 'super-secret-password',
      ADMIN_NAME: 'Platform Admin',
    }),
    {
      email: 'admin@example.com',
      password: 'super-secret-password',
      name: 'Platform Admin',
    }
  );
});
