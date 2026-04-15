/**
 * Seed non-blog public collections in MongoDB for Mongo-first deployments.
 *
 * Collections:
 * - users
 * - team_members
 * - programs
 * - events
 * - campaigns
 *
 * Usage:
 *   npm run seed:mongo
 */

import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI?.trim();
const dbName = process.env.MONGODB_DB?.trim();

if (!uri) {
  console.error('MONGODB_URI is required for Mongo seeding.');
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  await client.connect();
  const db = dbName ? client.db(dbName) : client.db();

  const users = db.collection('users');
  const team = db.collection('team_members');
  const programs = db.collection('programs');
  const events = db.collection('events');
  const campaigns = db.collection('campaigns');

  await Promise.all([
    users.createIndex({ email: 1 }, { unique: true }),
    team.createIndex({ slug: 1 }, { unique: true }),
    programs.createIndex({ slug: 1 }, { unique: true }),
    events.createIndex({ slug: 1 }, { unique: true }),
    campaigns.createIndex({ slug: 1 }, { unique: true }),
    team.createIndex({ isActive: 1, order: 1 }),
    programs.createIndex({ isActive: 1, order: 1 }),
  ]);

  await users.updateOne(
    { email: 'admin@ytopglobal.org' },
    {
      $set: {
        name: 'Admin User',
        role: 'ADMIN',
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  const teamSeed = [
    {
      id: 'tm-core-1',
      name: 'Abayomi Adewumi',
      slug: 'abayomi-adewumi',
      position: 'Founder & Executive Director',
      bio: 'Leads YTOP Global strategy and cross-program execution.',
      teamSection: 'core',
      isActive: true,
      order: 1,
      photo: null,
    },
    {
      id: 'tm-core-2',
      name: 'Adedayo Adeniyi',
      slug: 'adedayo-adeniyi',
      position: 'Programs Manager',
      bio: 'Coordinates education and leadership programs across communities.',
      teamSection: 'core',
      isActive: true,
      order: 2,
      photo: null,
    },
  ];

  for (const member of teamSeed) {
    await team.updateOne(
      { slug: member.slug },
      { $set: { ...member, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
  }

  const programSeed = [
    {
      id: 'program-project-300',
      title: 'Project 300',
      slug: 'project-300',
      description:
        'A school mentorship and impact program empowering students through guidance, life skills, and leadership support.',
      shortDesc: 'School mentorship and leadership development program.',
      sdgGoals: ['4', '8', '10'],
      isActive: true,
      order: 1,
      image: null,
    },
    {
      id: 'program-rise-of-warriors',
      title: 'Rise of Warriors',
      slug: 'rise-of-warriors',
      description:
        'A transformational youth leadership program focused on mindset, discipline, and purposeful community impact.',
      shortDesc: 'Youth leadership and personal transformation program.',
      sdgGoals: ['4', '5', '8', '16'],
      isActive: true,
      order: 2,
      image: null,
    },
  ];

  for (const program of programSeed) {
    await programs.updateOne(
      { slug: program.slug },
      { $set: { ...program, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
  }

  await events.updateOne(
    { slug: 'rise-of-warriors-bootcamp' },
    {
      $set: {
        id: 'event-row-bootcamp',
        title: 'Rise of Warriors Bootcamp',
        slug: 'rise-of-warriors-bootcamp',
        description:
          'A practical training bootcamp for young leaders, with mentorship and project execution support.',
        startDate: new Date('2026-06-15T09:00:00.000Z'),
        endDate: new Date('2026-06-15T16:00:00.000Z'),
        location: 'Lagos, Nigeria',
        isOnline: false,
        registrationUrl: 'https://ytopglobal.org/get-involved',
        galleryImageIds: [],
        programId: 'program-rise-of-warriors',
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  await campaigns.updateOne(
    { slug: 'project-300-fundraiser' },
    {
      $set: {
        id: 'campaign-project-300-fundraiser',
        title: 'Project 300 Fundraiser',
        slug: 'project-300-fundraiser',
        description:
          'Support school outreach, mentorship resources, and youth development activities through Project 300.',
        goalAmount: 10000,
        raisedAmount: 2500,
        currency: 'USD',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: new Date('2026-12-31T23:59:59.000Z'),
        isActive: true,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  console.log('Mongo core collections seeded: users, team_members, programs, events, campaigns');
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

