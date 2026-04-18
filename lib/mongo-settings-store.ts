import { getMongoDb } from '@/lib/mongodb';

const COLLECTION = 'cms_settings';

export type MongoSettingRow = {
  key: string;
  value: string;
  group?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function mongoSettingsFindManyByKeys(
  keys: string[]
): Promise<Array<{ key: string; value: string }>> {
  if (keys.length === 0) return [];
  const db = await getMongoDb();
  const rows = await db
    .collection<MongoSettingRow>(COLLECTION)
    .find({ key: { $in: keys } })
    .project({ key: 1, value: 1, _id: 0 })
    .toArray();
  return rows.map((r) => ({ key: r.key, value: r.value }));
}

export async function mongoSettingsUpsert(input: {
  key: string;
  value: string;
  group?: string | null;
}): Promise<void> {
  const db = await getMongoDb();
  const now = new Date();
  await db.collection(COLLECTION).updateOne(
    { key: input.key },
    {
      $set: {
        value: input.value,
        group: input.group ?? null,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );
}

export async function mongoSettingsListAll(): Promise<MongoSettingRow[]> {
  const db = await getMongoDb();
  return db
    .collection<MongoSettingRow>(COLLECTION)
    .find({})
    .sort({ key: 1 })
    .toArray();
}
