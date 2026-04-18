import { getMongoDb, isMongoConfigured } from '@/lib/mongodb';

export function useMongoForPublicData(): boolean {
  return isMongoConfigured();
}

export type MongoProgram = {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  sdgGoals: string[];
  order: number;
  isActive: boolean;
  image: { id: string | null; url: string; altText: string | null } | null;
};

export type MongoTeamMember = {
  id: string;
  name: string;
  slug: string;
  position: string;
  bio: string | null;
  teamSection: string;
  order: number;
  isActive: boolean;
  photo: { id: string | null; url: string; altText: string | null } | null;
};

export async function mongoListActivePrograms(): Promise<MongoProgram[]> {
  const db = await getMongoDb();
  return db
    .collection<MongoProgram>('programs')
    .find({ isActive: true })
    .sort({ order: 1, title: 1 })
    .toArray();
}

export async function mongoListActiveTeamMembers(): Promise<MongoTeamMember[]> {
  const db = await getMongoDb();
  return db
    .collection<MongoTeamMember>('team_members')
    .find({ isActive: true })
    .sort({ order: 1, name: 1 })
    .toArray();
}

