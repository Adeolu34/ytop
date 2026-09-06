import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { checkPermission, getCurrentUser } from '@/lib/auth-utils';
import { isCloudinaryConfigured, cloudinaryGalleryExcludePrefixes } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

function configure() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

async function listSubfolders(path?: string): Promise<{ name: string; path: string }[]> {
  try {
    const res = path
      ? (await cloudinary.api.sub_folders(path)) as { folders?: { name: string; path: string }[] }
      : (await cloudinary.api.root_folders()) as { folders?: { name: string; path: string }[] };
    return res.folders ?? [];
  } catch {
    return [];
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.id || !checkPermission(user.role ?? 'SUBSCRIBER', 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 503 });
  }

  configure();

  const roots = await listSubfolders();
  const tree: { path: string; children: string[] }[] = [];

  for (const root of roots) {
    const children = await listSubfolders(root.path);
    tree.push({ path: root.path, children: children.map((c) => c.path) });
  }

  return NextResponse.json({
    folders: tree,
    currentExcludes: cloudinaryGalleryExcludePrefixes(),
    hint: 'Set CLOUDINARY_GALLERY_EXCLUDE_PREFIX=folder/path in Netlify env vars (comma-separated for multiple) then redeploy.',
  });
}
