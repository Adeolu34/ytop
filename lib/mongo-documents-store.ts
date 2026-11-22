import { randomUUID } from 'crypto';
import { getMongoDb } from '@/lib/mongodb';

const COLLECTION = 'documents';

export const DOCUMENT_CATEGORIES = [
  { value: 'REPORT', label: 'Report or publication' },
  { value: 'GOVERNANCE', label: 'Governance document' },
  { value: 'PROFILE', label: 'Organisational profile' },
] as const;

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number]['value'];

export type MongoDocument = {
  id: string;
  title: string;
  category: DocumentCategory;
  description: string | null;
  /** Public https URL, or a site-relative path such as /documents/annual-report-2025.pdf. */
  url: string;
  /** Reporting period or version, e.g. "2025" or "Version 2, March 2026". */
  period: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function mongoDocumentsList(category?: DocumentCategory): Promise<MongoDocument[]> {
  const db = await getMongoDb();
  return db
    .collection<MongoDocument>(COLLECTION)
    .find(category ? { category } : {}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(300)
    .toArray();
}

export async function mongoDocumentFindById(id: string): Promise<MongoDocument | null> {
  const db = await getMongoDb();
  return db.collection<MongoDocument>(COLLECTION).findOne({ id }, { projection: { _id: 0 } });
}

export type MongoDocumentInput = {
  title: string;
  category: DocumentCategory;
  description: string | null;
  url: string;
  period: string | null;
};

export async function mongoDocumentUpsert(id: string | null, input: MongoDocumentInput): Promise<string> {
  const db = await getMongoDb();
  const col = db.collection(COLLECTION);
  const now = new Date();
  const fields = { ...input, updatedAt: now };
  if (id) {
    await col.updateOne({ id }, { $set: fields });
    return id;
  }
  const newId = randomUUID();
  await col.insertOne({ id: newId, createdAt: now, ...fields });
  return newId;
}

export async function mongoDocumentDelete(id: string): Promise<void> {
  const db = await getMongoDb();
  await db.collection(COLLECTION).deleteOne({ id });
}
