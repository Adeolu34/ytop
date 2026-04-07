import { resetPrismaConnection } from '@/lib/db';

type LoadWithDatabaseFallbackOptions<T> = {
  load: () => Promise<T>;
  fallback: T;
  resetConnection?: () => void;
  onError?: (error: unknown) => void;
};

export function isDatabaseConnectionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /connection|terminated|timeout|ECONNRESET|ECONNREFUSED|P1001|P1017/i.test(
    message
  );
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
    if (!isDatabaseConnectionError(error)) {
      throw error;
    }

    resetConnection();

    try {
      return await load();
    } catch (retryError) {
      if (!isDatabaseConnectionError(retryError)) {
        throw retryError;
      }

      onError?.(retryError);
      return fallback;
    }
  }
}
