/**
 * Upload existing Media rows that still point at local public/ files to Cloudinary,
 * then update Prisma with secure URLs + cloudinaryPublicId.
 *
 * Only rows in the Prisma `Media` table are processed. If you have many images under
 * public/media that were never inserted as Media records, use
 * `upload-public-folder-to-cloudinary.ts` instead (and/or add Media rows first).
 *
 * Usage:
 *   npx tsx scripts/migrate-media-to-cloudinary.ts
 *   npx tsx scripts/migrate-media-to-cloudinary.ts --dry-run
 *   npx tsx scripts/migrate-media-to-cloudinary.ts --keep-local
 *   npx tsx scripts/migrate-media-to-cloudinary.ts --limit 5
 *
 * Requires: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, DATABASE_URL
 */

import 'dotenv/config';
import { readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import prisma from '../lib/db';
import {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
} from '../lib/cloudinary';

function parseArgs(argv: string[]) {
  return {
    dryRun: argv.includes('--dry-run'),
    keepLocal: argv.includes('--keep-local'),
    limit: (() => {
      const i = argv.indexOf('--limit');
      if (i === -1 || !argv[i + 1]) return undefined;
      const n = Number.parseInt(argv[i + 1], 10);
      return Number.isFinite(n) && n > 0 ? n : undefined;
    })(),
  };
}

function isCloudinaryHostedUrl(url: string): boolean {
  const u = url.toLowerCase();
  return u.includes('res.cloudinary.com') || u.includes('cloudinary.com');
}

/** Map Media.url (/uploads/... or /media/...) to absolute path under public/. */
function localFilePathFromUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed.startsWith('/')) return null;
  if (trimmed.startsWith('//')) return null;
  const parts = trimmed.split('/').filter(Boolean);
  if (parts.length === 0) return null;
  return path.join(process.cwd(), 'public', ...parts);
}

async function main() {
  const { dryRun, keepLocal, limit } = parseArgs(process.argv.slice(2));

  if (!isCloudinaryConfigured()) {
    console.error(
      'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env'
    );
    process.exit(1);
  }

  const all = await prisma.media.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      url: true,
      filename: true,
      width: true,
      height: true,
      cloudinaryPublicId: true,
    },
  });

  const candidates = all.filter((m) => {
    if (isCloudinaryHostedUrl(m.url)) return false;
    if (m.cloudinaryPublicId) return false;
    if (m.url.startsWith('http://') || m.url.startsWith('https://')) {
      return false;
    }
    return m.url.startsWith('/');
  });

  const toProcess = limit ? candidates.slice(0, limit) : candidates;

  console.log(
    `Found ${candidates.length} media row(s) to migrate (${toProcess.length} in this run).`
  );

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const media of toProcess) {
    const absPath = localFilePathFromUrl(media.url);
    if (!absPath) {
      console.warn(`[skip] ${media.id} — unsupported url: ${media.url}`);
      skipped++;
      continue;
    }

    let buffer: Buffer;
    try {
      buffer = await readFile(absPath);
    } catch {
      console.warn(`[skip] ${media.id} — file not found: ${absPath}`);
      skipped++;
      continue;
    }

    const publicId = `migrated-${media.id.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

    if (dryRun) {
      console.log(`[dry-run] ${media.id} ${media.url} -> Cloudinary public_id ${publicId}`);
      ok++;
      continue;
    }

    try {
      const uploaded = await uploadBufferToCloudinary(buffer, {
        publicId,
        overwrite: true,
      });

      await prisma.media.update({
        where: { id: media.id },
        data: {
          url: uploaded.secureUrl,
          cloudinaryPublicId: uploaded.publicId,
          width: media.width ?? uploaded.width ?? null,
          height: media.height ?? uploaded.height ?? null,
        },
      });

      if (!keepLocal) {
        try {
          await unlink(absPath);
        } catch (e) {
          console.warn(
            `[warn] ${media.id} — could not delete local file ${absPath}:`,
            e
          );
        }
      }

      console.log(`[ok] ${media.id} -> ${uploaded.secureUrl}`);
      ok++;
    } catch (e) {
      console.error(`[fail] ${media.id}`, e);
      failed++;
    }
  }

  console.log(
    `\nDone. ok=${ok} skipped=${skipped} failed=${failed}${dryRun ? ' (dry-run)' : ''}${keepLocal ? ' (local files kept)' : ''}`
  );

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
