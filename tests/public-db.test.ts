import test from 'node:test';
import assert from 'node:assert/strict';

async function loadPublicDbModule() {
  try {
    return await import('../lib/public-db');
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'lib/public-db.ts could not be loaded';
    assert.fail(message);
  }
}

test('loadWithDatabaseFallback retries once after a connection error', async () => {
  const { loadWithDatabaseFallback } = await loadPublicDbModule();

  let attempts = 0;
  let resetCalls = 0;

  const result = await loadWithDatabaseFallback({
    load: async () => {
      attempts += 1;

      if (attempts === 1) {
        throw new Error('Connection terminated due to connection timeout');
      }

      return ['ok'];
    },
    fallback: [],
    resetConnection: () => {
      resetCalls += 1;
    },
  });

  assert.deepEqual(result, ['ok']);
  assert.equal(attempts, 2);
  assert.equal(resetCalls, 1);
});

test('loadWithDatabaseFallback returns fallback after a second connection error', async () => {
  const { loadWithDatabaseFallback } = await loadPublicDbModule();

  let resetCalls = 0;
  const errors: string[] = [];

  const result = await loadWithDatabaseFallback({
    load: async () => {
      throw new Error('P1001: database server not reachable');
    },
    fallback: ['fallback'],
    resetConnection: () => {
      resetCalls += 1;
    },
    onError: (error) => {
      errors.push(error instanceof Error ? error.message : String(error));
    },
  });

  assert.deepEqual(result, ['fallback']);
  assert.equal(resetCalls, 1);
  assert.equal(errors.length, 1);
});

test('loadWithDatabaseFallback rethrows non-connection errors', async () => {
  const { loadWithDatabaseFallback } = await loadPublicDbModule();

  await assert.rejects(
    () =>
      loadWithDatabaseFallback({
        load: async () => {
          throw new Error('Validation failed');
        },
        fallback: [],
        resetConnection: () => {},
      }),
    /Validation failed/
  );
});
