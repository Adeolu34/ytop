import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const isrPublicPages = [
  'app/(public)/page.tsx',
  'app/(public)/programs/page.tsx',
];

for (const relativePath of isrPublicPages) {
  test(`"${relativePath}" uses ISR (revalidate) instead of force-dynamic`, () => {
    const fileContents = readFileSync(
      path.join(projectRoot, relativePath),
      'utf8'
    );

    assert.match(fileContents, /export const revalidate = 60;/);
    assert.doesNotMatch(fileContents, /export const dynamic = 'force-dynamic'/);
  });
}
