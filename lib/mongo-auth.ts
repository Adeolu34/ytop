import { getMongoDb } from '@/lib/mongodb';

export type MongoAuthUser = {
  id: string;
  email: string;
  name: string | null;
  hashedPassword: string | null;
  role: string;
  image: string | null;
  bio?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function findMongoAuthUserByEmail(
  email: string
): Promise<MongoAuthUser | null> {
  const db = await getMongoDb();
  const users = db.collection<MongoAuthUser>('users');
  const normalized = email.trim().toLowerCase();
  const user = await users.findOne({ email: normalized });
  return user ?? null;
}

