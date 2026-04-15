import { resetPrismaConnection } from '@/lib/db';

type LoadWithDatabaseFallbackOptions<T> = {
  load: () => Promise<T>;
  fallback: T;
  resetConnection?: () => void;
  onError?: (error: unknown) => void;
};

export function isDatabaseConnectionError(error: unknown): boolean {
  if (error && typeof error === 'object') {
    const name = (error as { name?: string }).name ?? '';
    if (
      /Mongo(ServerSelection|Network|Timeout|Write|BulkWrite|Pool)?Error/i.test(
        name
      )
    ) {
      return true;
    }
  }
  const message = error instanceof Error ? error.message : String(error);
  return /connection|terminated|timeout|ECONNRESET|ECONNREFUSED|P1001|P1017|SSL routines|tlsv1 alert|ERR_SSL|MongoServer|TopologyDescription|SystemOverloadedError/i.test(
    message
  );
}

function isMissingDatabaseUrlError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /DATABASE_URL \(or NETLIFY_DATABASE_URL.*\) is not set/i.test(message);
}

export async function loadWithDatabaseFallback<T>({
  load,
  fallback,
  resetConnection = resetPrismaConnection,
  onError,
}: LoadWithDatabaseFallbackOptions<T>): Promise<T> {
  try {
    return await load();
  } catch (error) {
    if (isMissingDatabaseUrlError(error)) {
      onError?.(error);
      return fallback;
    }

    if (!isDatabaseConnectionError(error)) {
      throw error;
    }

    resetConnection();

    try {
      return await load();
    } catch (retryError) {
      if (isMissingDatabaseUrlError(retryError)) {
        onError?.(retryError);
        return fallback;
      }
      if (!isDatabaseConnectionError(retryError)) {
        throw retryError;
      }

      onError?.(retryError);
      return fallback;
    }
  }
}
