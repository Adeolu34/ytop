import test from 'node:test';
import assert from 'node:assert/strict';

async function loadSitemapModule() {
  try {
    return await import('../lib/sitemap');
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'lib/sitemap.ts could not be loaded';
    assert.fail(message);
  }
}

test('buildSitemapEntries returns static pages when dynamic sources fail', async () => {
  const { buildSitemapEntries } = await loadSitemapModule();

  const entries = await buildSitemapEntries({
    baseUrl: 'https://ytopglobal.org',
    fetchPosts: async () => {
      throw new Error('database unavailable');
    },
    fetchCategories: async () => [],
    now: new Date('2026-03-19T00:00:00.000Z'),
  });

  assert(entries.length > 0);
  assert(entries.some((entry) => entry.url === 'https://ytopglobal.org/blog'));
  assert(!entries.some((entry) => entry.url.includes('/blog/example-post')));
  assert(!entries.some((entry) => entry.url.includes('?category=')));
});

test('buildSitemapEntries includes posts and categories when dynamic sources succeed', async () => {
  const { buildSitemapEntries } = await loadSitemapModule();
  const now = new Date('2026-03-19T00:00:00.000Z');

  const entries = await buildSitemapEntries({
    baseUrl: 'https://ytopglobal.org',
    fetchPosts: async () => [
      {
        slug: 'example-post',
        updatedAt: new Date('2026-03-18T12:00:00.000Z'),
      },
    ],
    fetchCategories: async () => [{ slug: 'leadership' }],
    now,
  });

  assert(entries.some((entry) => entry.url === 'https://ytopglobal.org/blog/example-post'));
  assert(entries.some((entry) => entry.url === 'https://ytopglobal.org/blog?category=leadership'));
  assert(entries.some((entry) => entry.url === 'https://ytopglobal.org/about'));
});
