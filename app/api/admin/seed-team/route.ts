import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getMongoDb } from '@/lib/mongodb';
import { checkPermission, getCurrentUser } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const CORE_TEAM = [
  { name: 'Ekundayo Oluwadamilare', position: 'Executive Director', photo: '/media/2023/02/DSC_1209.jpga-min-e1677764390481.jpg' },
  { name: 'Oluwadamilola Ayo-Ajakaiye', position: 'Director of Strategy' },
  { name: 'Alagbe John Adeolu', position: 'Director of Technical Operations' },
  { name: 'Cornelius Ilori', position: 'Program Director' },
  { name: 'Caroline Olasupo', position: 'Administration Officer' },
  { name: 'Olamide Alagbe', position: 'Alumni Relations Officer' },
  { name: 'Ayomide Adeoti', position: 'Community Manager', photo: '/media/2021/10/Ayomide-Adekola-min-scaled.jpg' },
  { name: 'Tolulope Keshinro', position: 'Media Head' },
  { name: 'Peace Popoola', position: 'Volunteering Hub Team Lead' },
];

const FACULTY_MENTORS = [
  { name: 'Rtn Pradeep Pahalwani' },
  { name: 'Prof. Bukola Oyebanji' },
  { name: 'Prof. Jacob Duinstra' },
  { name: 'Olugbemiga Ojubanire', role: 'Farm Help' },
  { name: 'Ifeoluwa Oyeyemi', role: 'Rise of Warriors' },
  { name: 'Oghenekefe Ettoh' },
  { name: 'Akin Alabi', role: 'Mentor', photo: '/media/2021/10/Akin-ALABI-1-min-1-scaled.jpg' },
  { name: 'Dr. Adenike Adeyemi' },
  { name: 'Samuel Agunbiade' },
  { name: 'Segun Fagorusi' },
  { name: 'Dr. Olufunmilayo Adetola' },
  { name: 'Dr. Temitope Ojo' },
  { name: 'Abayomi Adewumi', role: 'Operations and Strategy' },
  { name: 'Racheal Omoruyi' },
  { name: 'Modupeoluwa Akande' },
  { name: 'Fashoranti Damilola', role: 'Rise of Warriors' },
  { name: 'Ruhama Ifere' },
  { name: 'Joseph Adeosun' },
];

export async function POST() {
  const user = await getCurrentUser();
  if (!user?.id || !checkPermission(user.role ?? 'SUBSCRIBER', 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getMongoDb();
  const col = db.collection('team_members');

  const existing = await col.countDocuments({});
  if (existing > 0) {
    return NextResponse.json({
      message: `Already seeded — ${existing} team members exist. Visit /admin/team to manage them.`,
      seeded: 0,
    });
  }

  const now = new Date();
  const docs = [
    ...CORE_TEAM.map((m, i) => ({
      id: randomUUID(),
      name: m.name,
      slug: toSlug(m.name),
      position: m.position,
      bio: null,
      teamSection: 'core',
      order: i + 1,
      isActive: true,
      photoId: null,
      photo: m.photo ? { id: null, url: m.photo, altText: m.name } : null,
      email: null,
      phone: null,
      linkedin: null,
      twitter: null,
      facebook: null,
      createdAt: now,
      updatedAt: now,
    })),
    ...FACULTY_MENTORS.map((m, i) => ({
      id: randomUUID(),
      name: m.name,
      slug: toSlug(m.name),
      position: (m as { role?: string }).role ?? 'Faculty & Mentor',
      bio: null,
      teamSection: 'faculty',
      order: i + 1,
      isActive: true,
      photoId: null,
      photo: (m as { photo?: string }).photo
        ? { id: null, url: (m as { photo?: string }).photo!, altText: m.name }
        : null,
      email: null,
      phone: null,
      linkedin: null,
      twitter: null,
      facebook: null,
      createdAt: now,
      updatedAt: now,
    })),
  ];

  await col.insertMany(docs);

  return NextResponse.json({
    message: `Seeded ${docs.length} team members successfully. Visit /admin/team to manage them.`,
    seeded: docs.length,
    breakdown: {
      core: CORE_TEAM.length,
      faculty: FACULTY_MENTORS.length,
    },
  });
}
