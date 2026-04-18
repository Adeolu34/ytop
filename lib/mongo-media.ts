import type { Filter } from 'mongodb';
import { getMongoDb } from '@/lib/mongodb';

export type MongoMediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'OTHER';

export type MongoMediaDoc = {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl: string | null;
  mimeType: string;
  fileSize: number;
  type: MongoMediaType;
  width: number | null;
  height: number | null;
  altText: string | null;
  caption: string | null;
  description: string | null;
  wordpressId: number | null;
  cloudinaryPublicId: string | null;
  folder: string | null;
  uploadedById: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const COLLECTION = 'cms_media';

export async function mongoMediaEnsureIndexes(): Promise<void> {
  const db = await getMongoDb();
  const col = db.collection(COLLECTION);
  await col.createIndex({ id: 1 }, { unique: true });
  await col.createIndex({ type: 1, createdAt: -1 });
  await col.createIndex({ folder: 1 });
}

export async function mongoMediaFindById(
  id: string
): Promise<MongoMediaDoc | null> {
  const db = await getMongoDb();
  return db.collection<MongoMediaDoc>(COLLECTION).findOne({ id });
}

export async function mongoMediaListImagesForPicker(options: {
  limit?: number;
}): Promise<
  Array<{
    id: string;
    filename: string;
    url: string;
    folder: string | null;
    altText: string | null;
    mimeType: string;
  }>
> {
  const db = await getMongoDb();
  const col = db.collection<MongoMediaDoc>(COLLECTION);
  const rows = await col
    .find({ type: 'IMAGE' })
    .sort({ createdAt: -1 })
    .limit(options.limit ?? 300)
    .project({
      id: 1,
      filename: 1,
      url: 1,
      folder: 1,
      altText: 1,
      mimeType: 1,
    })
    .toArray();
  return rows.map((m) => ({
    id: m.id,
    filename: m.filename,
    url: m.url,
    folder: m.folder ?? null,
    altText: m.altText ?? null,
    mimeType: m.mimeType,
  }));
}

export async function mongoMediaListImageFolders(): Promise<string[]> {
  const db = await getMongoDb();
  const col = db.collection<MongoMediaDoc>(COLLECTION);
  const rows = await col.distinct('folder', {
    type: 'IMAGE',
    folder: { $nin: [null, ''] },
  } as Filter<MongoMediaDoc>);
  return (rows as string[]).filter(Boolean).sort();
}

export async function mongoMediaInsert(
  doc: Omit<MongoMediaDoc, 'createdAt' | 'updatedAt'> & {
    createdAt?: Date;
    updatedAt?: Date;
  }
): Promise<void> {
  const now = new Date();
  const db = await getMongoDb();
  await db.collection(COLLECTION).insertOne({
    ...doc,
    createdAt: doc.createdAt ?? now,
    updatedAt: doc.updatedAt ?? now,
  } as MongoMediaDoc);
}

export async function mongoMediaUpdate(
  id: string,
  patch: Partial<
    Pick<
      MongoMediaDoc,
      | 'altText'
      | 'caption'
      | 'description'
      | 'folder'
      | 'width'
      | 'height'
      | 'url'
      | 'cloudinaryPublicId'
    >
  >
): Promise<void> {
  const db = await getMongoDb();
  await db
    .collection(COLLECTION)
    .updateOne({ id }, { $set: { ...patch, updatedAt: new Date() } });
}

export async function mongoMediaDelete(id: string): Promise<void> {
  const db = await getMongoDb();
  await db.collection(COLLECTION).deleteOne({ id });
}

export async function mongoMediaSetFolderMany(
  ids: string[],
  folder: string | null
): Promise<void> {
  if (ids.length === 0) return;
  const db = await getMongoDb();
  await db.collection(COLLECTION).updateMany(
    { id: { $in: ids } },
    { $set: { folder, updatedAt: new Date() } }
  );
}

export async function mongoMediaDeleteMany(ids: string[]): Promise<number> {
  if (ids.length === 0) return 0;
  const db = await getMongoDb();
  const r = await db.collection(COLLECTION).deleteMany({ id: { $in: ids } });
  return r.deletedCount;
}

export async function mongoMediaListByIds(
  ids: string[]
): Promise<MongoMediaDoc[]> {
  if (ids.length === 0) return [];
  const db = await getMongoDb();
  return db
    .collection<MongoMediaDoc>(COLLECTION)
    .find({ id: { $in: ids } })
    .toArray();
}

export async function mongoMediaListAdminImages(options: {
  q?: string;
  folderParam?: string | null;
  skip: number;
  take: number;
}): Promise<{
  items: Array<{
    id: string;
    filename: string;
    url: string;
    folder: string | null;
    altText: string | null;
    mimeType: string;
  }>;
  total: number;
}> {
  const db = await getMongoDb();
  const col = db.collection<MongoMediaDoc>(COLLECTION);
  const filter: Record<string, unknown> = { type: 'IMAGE' };
  const q = options.q?.trim();
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ filename: rx }, { originalName: rx }];
  }
  if (options.folderParam === '__uncategorized__') {
    filter.folder = null;
  } else if (options.folderParam && options.folderParam !== 'all') {
    filter.folder = options.folderParam;
  }

  const [items, total] = await Promise.all([
    col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.take)
      .project({
        id: 1,
        filename: 1,
        url: 1,
        folder: 1,
        altText: 1,
        mimeType: 1,
      })
      .toArray(),
    col.countDocuments(filter),
  ]);

  return {
    items: items.map((m) => ({
      id: m.id,
      filename: m.filename,
      url: m.url,
      folder: m.folder ?? null,
      altText: m.altText ?? null,
      mimeType: m.mimeType,
    })),
    total,
  };
}

export type MongoMediaGalleryListItem = {
  id: string;
  filename: string;
  url: string;
  altText: string | null;
  mimeType: string;
  type: MongoMediaType;
  fileSize: number;
  width: number | null;
  height: number | null;
  folder: string | null;
  createdAt: Date;
};

export async function mongoMediaGalleryStats(): Promise<{
  totalItems: number;
  imageCount: number;
  videoCount: number;
  documentCount: number;
  totalBytes: number;
  folderNames: string[];
}> {
  const db = await getMongoDb();
  const col = db.collection<MongoMediaDoc>(COLLECTION);
  const [
    totalItems,
    imageCount,
    videoCount,
    documentCount,
    aggRows,
    folderDistinct,
  ] = await Promise.all([
    col.countDocuments({}),
    col.countDocuments({ type: 'IMAGE' }),
    col.countDocuments({ type: 'VIDEO' }),
    col.countDocuments({ type: 'DOCUMENT' }),
    col
      .aggregate([{ $group: { _id: null, sum: { $sum: '$fileSize' } } }])
      .toArray(),
    col.distinct('folder', {
      folder: { $nin: [null, ''] },
    } as Filter<MongoMediaDoc>),
  ]);
  const sum = (aggRows[0] as { sum?: number | null } | undefined)?.sum;
  const totalBytes = typeof sum === 'number' ? sum : 0;
  const folderNames = (folderDistinct as string[]).filter(Boolean).sort();
  return {
    totalItems,
    imageCount,
    videoCount,
    documentCount,
    totalBytes,
    folderNames,
  };
}

export async function mongoMediaGalleryList(options: {
  typeFilter: string;
  folderFilter: string;
  searchQuery: string;
  take: number;
}): Promise<MongoMediaGalleryListItem[]> {
  const db = await getMongoDb();
  const col = db.collection<MongoMediaDoc>(COLLECTION);
  const filter: Record<string, unknown> = {};

  const tf = options.typeFilter?.trim().toUpperCase() || 'ALL';
  if (tf !== 'ALL' && ['IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER'].includes(tf)) {
    filter.type = tf as MongoMediaType;
  }

  const ff = options.folderFilter?.trim() || 'ALL';
  if (ff === '__uncategorized__') {
    filter.folder = null;
  } else if (ff !== 'ALL') {
    filter.folder = ff;
  }

  const q = options.searchQuery?.trim();
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ filename: rx }, { originalName: rx }, { altText: rx }];
  }

  const rows = await col
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(options.take)
    .toArray();

  return rows.map((m) => ({
    id: m.id,
    filename: m.filename,
    url: m.url,
    altText: m.altText ?? null,
    mimeType: m.mimeType,
    type: m.type,
    fileSize: m.fileSize,
    width: m.width ?? null,
    height: m.height ?? null,
    folder: m.folder ?? null,
    createdAt: m.createdAt,
  }));
}

export function isMongoDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: number }).code === 11000
  );
}
