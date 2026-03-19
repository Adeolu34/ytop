import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assessCommentModeration,
  normalizeCommentSubmission,
} from '../lib/comment-moderation';

test('approves a normal community comment', () => {
  const result = assessCommentModeration({
    name: 'Ada',
    email: 'ada@example.com',
    content:
      'This was a thoughtful article. I especially liked the section about mentoring young leaders.',
    website: '',
    recentDuplicateCount: 0,
    recentSubmissionCount: 0,
  });

  assert.equal(result.decision, 'approve');
  assert.deepEqual(result.flags, []);
});

test('rejects comments with obvious vulgar language', () => {
  const result = assessCommentModeration({
    name: 'Troll',
    email: 'troll@example.com',
    content: 'This is f*cking stupid and you are all idiots.',
    website: '',
    recentDuplicateCount: 0,
    recentSubmissionCount: 0,
  });

  assert.equal(result.decision, 'reject');
  assert.ok(result.flags.includes('profanity'));
});

test('rejects clear spam bait with promotional links and contact lures', () => {
  const result = assessCommentModeration({
    name: 'Promo Bot',
    email: 'promo@example.com',
    content:
      'Earn fast cash now. Visit https://spam.example and https://promo.example. Contact me on WhatsApp for the best crypto recovery service.',
    website: '',
    recentDuplicateCount: 0,
    recentSubmissionCount: 0,
  });

  assert.equal(result.decision, 'reject');
  assert.ok(result.flags.includes('spam'));
});

test('holds suspicious but not certain spam for moderation review', () => {
  const result = assessCommentModeration({
    name: 'Visitor',
    email: 'visitor@example.com',
    content:
      'Great post! Check my website for a related resource: https://example.org/resource',
    website: '',
    recentDuplicateCount: 0,
    recentSubmissionCount: 0,
  });

  assert.equal(result.decision, 'review');
  assert.ok(result.flags.includes('link'));
});

test('normalizes names, emails, and comment content before assessment', () => {
  const normalized = normalizeCommentSubmission({
    name: '  Ada Lovelace  ',
    email: '  ADA@Example.COM ',
    content: '  Inspiring work from the team.  ',
    website: ' ',
  });

  assert.deepEqual(normalized, {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    content: 'Inspiring work from the team.',
    website: '',
  });
});

test('treats repeated duplicate submissions as review-worthy even without spam words', () => {
  const result = assessCommentModeration({
    name: 'Repeated Visitor',
    email: 'repeat@example.com',
    content: 'Thank you for sharing this update with the community.',
    website: '',
    recentDuplicateCount: 2,
    recentSubmissionCount: 3,
  });

  assert.equal(result.decision, 'review');
  assert.ok(result.flags.includes('repeat'));
});
