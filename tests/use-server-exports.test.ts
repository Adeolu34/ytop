import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(__dirname, '..');

const serverActionFiles = [
  'app/admin/posts/actions.ts',
  'app/admin/users/actions.ts',
  'app/admin/gallery/actions.ts',
  'app/(public)/blog/[slug]/comment-actions.ts',
];

for (const relativePath of serverActionFiles) {
  test(`"${relativePath}" only exports async functions`, () => {
    const fileContents = readFileSync(
      path.join(projectRoot, relativePath),
      'utf8'
    );

    assert.match(fileContents, /^'use server';/m);
    assert.doesNotMatch(fileContents, /^export const /m);
  });
}
