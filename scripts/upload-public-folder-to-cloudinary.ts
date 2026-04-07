/**
 * Upload every image file under public/media (and optionally public/uploads/admin)
 * to Cloudinary and write a JSON map: "/media/..." -> "https://res.cloudinary.com/..."
 *
 * This is separate from migrate-media-to-cloudinary.ts, which only updates rows
 * in the Prisma Media table. Use this when many assets live on disk + in JSX but
 * were never inserted as Media records.
 *
 * Usage:
 *   npx tsx scripts/upload-public-folder-to-cloudinary.ts
 *   npx tsx scripts/upload-public-folder-to-cloudinary.ts --dry-run
 *   npx tsx scripts/upload-public-folder-to-cloudinary.ts --include-uploads
 *   npx tsx scripts/upload-public-folder-to-cloudinary.ts --limit 20
 *
 * Output: scripts/generated/media-cloudinary-map.json (gitignored)
 */

import 'dotenv/config';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
} from '../lib/cloudinary';

/** Folder in Cloudinary for static /public/media copies (not admin gallery). */
function staticMediaFolder(): string {
  return (
    process.env.CLOUDINARY_STATIC_FOLDER?.trim() || 'ytop/site-media'
  );
}

const EXT = /\.(jpe?g|png|gif|webp|svg|avif|bmp|ico)$/i;

function parseArgs(argv: string[]) {
  return {
    dryRun: argv.includes('--dry-run'),
    includeUploads: argv.includes('--include-uploads'),
    limit: (() => {
      const i = argv.indexOf('--limit');
      if (i === -1 || !argv[i + 1]) return undefined;
      const n = Number.parseInt(argv[i + 1], 10);
      return Number.isFinite(n) && n > 0 ? n : undefined;
    })(),
  };
}

async function walkFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walkFiles(full)));
    } else if (e.isFile() && EXT.test(e.name)) {
      out.push(full);
    }
  }
  return out;
}

/** public_id segment under Cloudinary folder (stable, path-based). */
function publicIdForRelativePosix(relPosix: string): string {
  const base = relPosix.replace(/^\/+/, '');
  const withoutExt = base.replace(/\.[^.]+$/, '');
  return withoutExt.replace(/[^a-zA-Z0-9/_-]/g, '_').replace(/\/+/g, '/');
}

async function main() {
  const { dryRun, includeUploads, limit } = parseArgs(process.argv.slice(2));

  if (!isCloudinaryConfigured()) {
    console.error(
      'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env'
    );
    process.exit(1);
  }

  const cwd = process.cwd();
  const roots: { abs: string; urlPrefix: string }[] = [
    { abs: path.join(cwd, 'public', 'media'), urlPrefix: '/media' },
  ];
  if (includeUploads) {
    roots.push({
      abs: path.join(cwd, 'public', 'uploads', 'admin'),
      urlPrefix: '/uploads/admin',
    });
  }

  const files: { abs: string; publicUrl: string; publicId: string }[] = [];

  for (const { abs, urlPrefix } of roots) {
    let list: string[];
    try {
      list = await walkFiles(abs);
    } catch {
      console.warn(`[warn] Skip missing or unreadable directory: ${abs}`);
      continue;
    }
    for (const fileAbs of list) {
      const rel = path.relative(abs, fileAbs);
      const relPosix = rel.split(path.sep).join('/');
      const publicUrl = `${urlPrefix}/${relPosix}`.replace(/\/+/g, '/');
      const idBody = publicIdForRelativePosix(
        path.join(urlPrefix.replace(/^\//, ''), relPosix)
      );
      files.push({
        abs: fileAbs,
        publicUrl,
        publicId: idBody,
      });
    }
  }

  const toRun = limit ? files.slice(0, limit) : files;

  console.log(
    `Found ${files.length} file(s) under public (${toRun.length} in this run).`
  );

  if (toRun.length === 0) {
    console.log(
      'Nothing to upload. Ensure images exist under public/media (and use --include-uploads for public/uploads/admin).'
    );
    process.exit(0);
  }

  const map: Record<string, string> = {};
  let ok = 0;
  let failed = 0;

  const folder = staticMediaFolder();

  for (const { abs, publicUrl, publicId } of toRun) {
    const scopedId = publicId.replace(/\/+/g, '/');

    if (dryRun) {
      console.log(`[dry-run] ${publicUrl} -> public_id ${folder}/${scopedId}`);
      map[publicUrl] = '(dry-run)';
      ok++;
      continue;
    }

    try {
      const buffer = await readFile(abs);
      const uploaded = await uploadBufferToCloudinary(buffer, {
        publicId: scopedId,
        overwrite: true,
        folder,
      });
      map[publicUrl] = uploaded.secureUrl;
      console.log(`[ok] ${publicUrl}`);
      ok++;
    } catch (e) {
      console.error(`[fail] ${publicUrl}`, e);
      failed++;
    }
  }

  if (!dryRun && Object.keys(map).length > 0) {
    const outDir = path.join(cwd, 'scripts', 'generated');
    await mkdir(outDir, { recursive: true });
    const outFile = path.join(outDir, 'media-cloudinary-map.json');
    await writeFile(outFile, JSON.stringify(map, null, 2), 'utf8');
    console.log(`\nWrote ${outFile}`);
  }

  console.log(
    `\nDone. uploaded=${ok} failed=${failed}${dryRun ? ' (dry-run)' : ''}`
  );
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
