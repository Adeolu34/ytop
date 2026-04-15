/**
 * MongoDB client for collections this app uses explicitly.
 *
 * **Public blog:** published posts are read from MongoDB (`blog_posts`).
 * **Auth users:** credentials-based admin login reads `users` from MongoDB.
 */
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

type GlobalWithMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

/**
 * True when MONGODB_URI is set (call before using Mongo helpers).
 */
export function isMongoConfigured(): boolean {
  return Boolean(uri?.trim());
}

function requireUri(): string {
  const u = uri?.trim();
  if (!u) {
    throw new Error(
      'MONGODB_URI is not set. Add it to your environment to use MongoDB.'
    );
  }
  return u;
}

/**
 * Lazily connects and reuses one client per server process (dev HMR uses globalThis).
 */
export function getMongoClientPromise(): Promise<MongoClient> {
  const u = requireUri();
  const g = globalThis as GlobalWithMongo;
  if (!g._mongoClientPromise) {
    g._mongoClientPromise = new MongoClient(u, {
      // Keep serverless requests from hanging until platform timeout.
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      socketTimeoutMS: 10000,
      maxPoolSize: 5,
    }).connect();
  }
  return g._mongoClientPromise;
}

/**
 * Default database: MONGODB_DB if set, otherwise the DB name from the URI, otherwise "test".
 */
export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClientPromise();
  const name = process.env.MONGODB_DB?.trim();
  return name ? client.db(name) : client.db();
}
