import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getMongoDb } from '@/lib/mongodb';
import { isCloudinaryConfigured, uploadBufferToCloudinary } from '@/lib/cloudinary';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

const VALID_SECTIONS = ['core', 'faculty', 'volunteer', 'community'];

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const { allowed } = checkRateLimit(ip, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again in a few minutes.' },
      { status: 429 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
  }

  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const position = (formData.get('position') as string | null)?.trim() ?? '';
  const teamSection = (formData.get('teamSection') as string | null)?.trim() ?? 'core';
  const bio = (formData.get('bio') as string | null)?.trim() || null;
  const email = (formData.get('email') as string | null)?.trim() || null;
  const linkedin = (formData.get('linkedin') as string | null)?.trim() || null;
  const twitter = (formData.get('twitter') as string | null)?.trim() || null;
  const photoFile = formData.get('photo') as File | null;

  if (!name) return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
  if (!position) return NextResponse.json({ error: 'Role / position is required.' }, { status: 400 });
  if (!VALID_SECTIONS.includes(teamSection)) {
    return NextResponse.json({ error: 'Invalid team section.' }, { status: 400 });
  }

  // Upload photo to Cloudinary
  let photo: { id: null; url: string; altText: string } | null = null;
  if (photoFile && photoFile.size > 0) {
    if (photoFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Photo must be under 5 MB.' }, { status: 400 });
    }
    if (isCloudinaryConfigured()) {
      try {
        const buffer = Buffer.from(await photoFile.arrayBuffer());
        const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const result = await uploadBufferToCloudinary(buffer, {
          publicId: `${baseSlug}-${Date.now()}`,
          folder: 'ytop/team-profiles',
          overwrite: false,
        });
        photo = { id: null, url: result.secureUrl, altText: name };
      } catch (e) {
        console.error('Team profile photo upload failed:', e);
      }
    }
  }

  const id = randomUUID();
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
  const now = new Date();

  const db = await getMongoDb();
  await db.collection('team_members').insertOne({
    id,
    name,
    slug: `${baseSlug}-${id.slice(0, 6)}`,
    position,
    bio,
    teamSection,
    order: 99,
    isActive: false,
    photoId: null,
    photo,
    email,
    phone: null,
    linkedin: linkedin || null,
    twitter: twitter || null,
    facebook: null,
    submittedViaForm: true,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ success: true });
}
