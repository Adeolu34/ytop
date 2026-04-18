import { resetMongoConnection } from '@/lib/mongodb';

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

function isMissingMongoUriError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /MONGODB_URI is not set|MongoDB is not configured/i.test(message);
}

/**
 * User-facing copy when the blog (or similar) cannot reach MongoDB after retries.
 * Tunes hints for auth vs TLS vs network vs hosted vs local dev.
 */
export function mongoBlogConnectionGuidance(error: unknown): {
  title: string;
  hint: string;
} {
  const message = error instanceof Error ? error.message : String(error);
  const m = message;

  const onHostedInfra =
    process.env.VERCEL === '1' ||
    Boolean(process.env.NETLIFY) ||
    Boolean(process.env.NETLIFY_ENV);

  const atlasNetwork = onHostedInfra
    ? 'In Atlas → Network Access, add the IPs your host uses for outbound traffic, or temporarily allow 0.0.0.0/0 only while debugging (remove when stable).'
    : 'In Atlas → Network Access, click Add Current IP Address, or for quick local tests only allow 0.0.0.0/0 (wide open; not for production).';

  if (/MONGODB_URI is not set|MongoDB is not configured/i.test(m)) {
    return {
      title: 'MongoDB is not configured in this environment.',
      hint: 'Set MONGODB_URI in .env (local) or your host environment (production). Optionally set MONGODB_DB if the URI has no database name in the path.',
    };
  }

  if (/bad auth|not authorized|authentication failed|SCRAM/i.test(m)) {
    return {
      title: 'MongoDB rejected the connection (authentication).',
      hint: 'Check MONGODB_URI: database user and password (URL-encode special characters in the password), correct cluster host, and authSource=admin if your user lives in the admin DB.',
    };
  }

  if (/TLS|SSL|certificate|tlsv1 alert|ERR_SSL|0A000438/i.test(m)) {
    return {
      title: 'The TLS connection to MongoDB failed.',
      hint: 'Confirm the URI matches the cluster (Atlas → Connect → Drivers). Try another network to rule out a proxy or firewall altering TLS. If the cluster was paused or deleted, restore it in Atlas.',
    };
  }

  if (
    isDatabaseConnectionError(error) ||
    /ServerSelection|TopologyDescription|PoolCleared|MongoNetworkError|MongoServerSelectionError|ETIMEDOUT|ENOTFOUND|ECONNREFUSED|ECONNRESET/i.test(
      m
    )
  ) {
    return {
      title: 'Unable to reach MongoDB right now.',
      hint: `${atlasNetwork} Confirm MONGODB_URI (and MONGODB_DB if needed) in the environment that runs this server.`,
    };
  }

  return {
    title: 'Something went wrong while loading posts from MongoDB.',
    hint: 'Verify MONGODB_URI, Atlas network access, and that the blog_posts collection contains documents with status PUBLISHED. Check server logs for the underlying error.',
  };
}

export async function loadWithDatabaseFallback<T>({
  load,
  fallback,
  resetConnection = resetMongoConnection,
  onError,
}: LoadWithDatabaseFallbackOptions<T>): Promise<T> {
  try {
    return await load();
  } catch (error) {
    if (isMissingMongoUriError(error)) {
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
      if (isMissingMongoUriError(retryError)) {
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
