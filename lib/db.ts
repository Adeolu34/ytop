/**
 * Database entrypoint — MongoDB only (no PostgreSQL).
 */
export {
  resetMongoConnection,
  resetMongoConnection as resetPrismaConnection,
  isMongoConfigured,
  isMongoConfigured as isDatabaseConfigured,
} from '@/lib/mongodb';
