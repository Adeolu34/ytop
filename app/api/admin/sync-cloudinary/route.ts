import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { checkPermission, getCurrentUser } from '@/lib/auth-utils';
import { getMongoDb } from '@/lib/mongodb';
import { isCloudinaryConfigured, cloudinaryGalleryPrefixes } from '@/lib/cloudinary';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

type CloudResource = {
  public_id: string;
  secure_url?: string;
  url?: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
  context?: { custom?: { alt?: string; caption?: string } };
};

async function listResourcesByPrefix(prefix: string): Promise<CloudResource[]> {
  const collected: CloudResource[] = [];
  let next_cursor: string | undefined;
  for (let page = 0; page < 40; page++) {
    const batch = (await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix,
      max_results: 500,
      ...(next_cursor ? { next_cursor } : {}),
    })) as { resources?: CloudResource[]; next_cursor?: string };
    const rows = batch.resources ?? [];
    collected.push(...rows);
    next_cursor = batch.next_cursor;
    if (!next_cursor) break;
  }
  return collected;
}

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user?.id || !checkPermission(user.role ?? 'SUBSCRIBER', 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: 'Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET.' },
        { status: 500 }
      );
    }

    configureCloudinary();

    const prefixes = cloudinaryGalleryPrefixes();
    const byId = new Map<string, CloudResource>();

    for (const prefix of prefixes) {
      const rows = await listResourcesByPrefix(prefix);
      for (const r of rows) {
        const src = r.secure_url || r.url;
        if (r.public_id && src) {
          byId.set(r.public_id, { ...r, secure_url: src });
        }
      }
    }

    if (byId.size === 0) {
      return NextResponse.json({
        message: 'No images found in Cloudinary under the configured prefixes.',
        synced: 0,
        skipped: 0,
      });
    }

    const db = await getMongoDb();
    const col = db.collection('cms_media');
    await col.createIndex({ id: 1 }, { unique: true });

    const now = new Date();
    let synced = 0;
    let skipped = 0;

    for (const [publicId, r] of byId) {
      const url = r.secure_url ?? r.url ?? '';
      const filename = publicId.split('/').pop() ?? publicId;
      const folder = publicId.includes('/')
        ? publicId.substring(0, publicId.lastIndexOf('/'))
        : null;
      const altText =
        r.context?.custom?.alt || r.context?.custom?.caption || null;

      const existing = await col.findOne({ cloudinaryPublicId: publicId });
      if (existing) {
        skipped++;
        continue;
      }

      await col.insertOne({
        id: randomUUID(),
        filename,
        originalName: filename,
        url,
        thumbnailUrl: null,
        mimeType: `image/${r.format ?? 'jpeg'}`,
        fileSize: r.bytes ?? 0,
        type: 'IMAGE',
        width: r.width ?? null,
        height: r.height ?? null,
        altText,
        caption: null,
        description: null,
        wordpressId: null,
        cloudinaryPublicId: publicId,
        folder,
        uploadedById: user.id,
        createdAt: now,
        updatedAt: now,
      });
      synced++;
    }

    return NextResponse.json({
      message: `Sync complete: ${synced} new image(s) added, ${skipped} already in library.`,
      synced,
      skipped,
      total: byId.size,
    });
  } catch (error) {
    console.error('Cloudinary sync error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Sync failed: ${message}` },
      { status: 500 }
    );
  }
}
