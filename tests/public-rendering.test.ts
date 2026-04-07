import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(__dirname, '..');

const dynamicPublicPages = [
  'app/(public)/page.tsx',
  'app/(public)/programs/page.tsx',
];

for (const relativePath of dynamicPublicPages) {
  test(`"${relativePath}" opts out of build-time prerendering`, () => {
    const fileContents = readFileSync(
      path.join(projectRoot, relativePath),
      'utf8'
    );

    assert.match(fileContents, /export const dynamic = 'force-dynamic';/);
  });
}
