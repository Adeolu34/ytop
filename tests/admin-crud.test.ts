import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildMediaDraft,
  buildPostDraft,
  buildUserDraft,
  sanitizeStoredFilename,
} from '../lib/admin-crud';

test('buildPostDraft generates a slug, normalizes optional fields, and sets publishedAt', () => {
  const now = new Date('2026-03-19T15:30:00.000Z');

  const draft = buildPostDraft(
    {
      title: '  Future of Youth Leadership  ',
      slug: '',
      excerpt: '  A short overview.  ',
      content: ' Full article body ',
      status: 'PUBLISHED',
      authorId: 'user_123',
      categories: 'Leadership, News, Leadership',
      tags: 'impact, africa, impact',
      featuredImageId: '',
      metaTitle: ' ',
      metaDescription: '  Search summary  ',
      metaKeywords: ' youth, innovation ',
      publishedAt: '',
    },
    now
  );

  assert.equal(draft.slug, 'future-of-youth-leadership');
  assert.equal(draft.excerpt, 'A short overview.');
  assert.equal(draft.metaTitle, null);
  assert.equal(draft.metaDescription, 'Search summary');
  assert.equal(draft.featuredImageId, null);
  assert.deepEqual(draft.categoryNames, ['Leadership', 'News']);
  assert.deepEqual(draft.tagNames, ['impact', 'africa']);
  assert.equal(draft.publishedAt?.toISOString(), now.toISOString());
});

test('buildPostDraft clears publishedAt for draft posts', () => {
  const draft = buildPostDraft(
    {
      title: 'Draft note',
      slug: 'draft-note',
      excerpt: '',
      content: 'Draft body',
      status: 'DRAFT',
      authorId: 'user_456',
      categories: '',
      tags: '',
      featuredImageId: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      publishedAt: '2026-03-19T15:30',
    },
    new Date('2026-03-19T15:30:00.000Z')
  );

  assert.equal(draft.publishedAt, null);
});

test('buildUserDraft normalizes email, trims fields, and treats blank password as absent', () => {
  const draft = buildUserDraft({
    name: '  Jane Admin  ',
    email: '  Jane.Admin@Example.COM  ',
    role: 'EDITOR',
    bio: '  Editorial lead  ',
    image: ' ',
    password: '   ',
  });

  assert.equal(draft.name, 'Jane Admin');
  assert.equal(draft.email, 'jane.admin@example.com');
  assert.equal(draft.role, 'EDITOR');
  assert.equal(draft.bio, 'Editorial lead');
  assert.equal(draft.image, null);
  assert.equal(draft.password, null);
});

test('buildMediaDraft infers image metadata from uploaded files', () => {
  const draft = buildMediaDraft({
    altText: '  Community meetup  ',
    caption: '',
    description: '  Homepage hero image  ',
    fileSize: 512345,
    mimeType: 'image/webp',
    originalName: 'Community Meetup 2026!.webp',
  });

  assert.equal(draft.type, 'IMAGE');
  assert.equal(draft.altText, 'Community meetup');
  assert.equal(draft.caption, null);
  assert.equal(draft.description, 'Homepage hero image');
  assert.equal(draft.filename, 'community-meetup-2026.webp');
});

test('sanitizeStoredFilename preserves useful extensions while removing unsafe characters', () => {
  assert.equal(
    sanitizeStoredFilename('Board Photo (Final)!!.PNG'),
    'board-photo-final.png'
  );
  assert.equal(sanitizeStoredFilename('report'), 'report');
});
