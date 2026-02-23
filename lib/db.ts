import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaClient } from '@/app/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

// Netlify injects NETLIFY_DATABASE_URL when Neon is connected; use it if DATABASE_URL is not set
const connectionString = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaPool: Pool | undefined;
};

function createPrismaClient(): PrismaClient {
  if (!connectionString) {
    throw new Error('DATABASE_URL (or NETLIFY_DATABASE_URL on Netlify) is not set. Add it to .env or Netlify env to use blog, programs, and other database features.');
  }
  const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 60_000, // 1 min – avoid dropping connections after short idle
    connectionTimeoutMillis: 15_000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  });
  globalForPrisma.prismaPool = pool;
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
}

export const prisma = getPrismaClient();

/** Reset the cached client so the next getPrisma() gets a fresh connection (use after connection errors). */
export function resetPrismaConnection(): void {
  if (globalForPrisma.prisma) {
    void (globalForPrisma.prisma as any).$disconnect?.().catch(() => {});
    globalForPrisma.prisma = undefined;
  }
  if (globalForPrisma.prismaPool) {
    void globalForPrisma.prismaPool.end().catch(() => {});
    globalForPrisma.prismaPool = undefined;
  }
}

/** Use this when you need a client that may have been reset after a connection error. */
export function getPrisma(): PrismaClient {
  return getPrismaClient();
}

export default prisma;
