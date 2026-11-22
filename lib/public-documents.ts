import { loadWithDatabaseFallback } from '@/lib/public-db';
import { mongoDocumentsList, type MongoDocument } from '@/lib/mongo-documents-store';
import { ORG_PROFILE_URL } from '@/lib/org';

/** The governance documents the master copy (10.3) says to link, in its order. */
export const GOVERNANCE_DOCUMENT_TITLES = [
  'Organisational Constitution',
  'Governance Framework',
  'Code of Conduct',
  'Safeguarding Policy',
  'Conflict of Interest Policy',
  'Financial Accountability Policy',
  'Privacy and Data Protection Policy',
] as const;

export async function getPublicDocuments(): Promise<MongoDocument[]> {
  return loadWithDatabaseFallback({
    load: async () => mongoDocumentsList(),
    fallback: [] as MongoDocument[],
    onError(error) {
      console.error('Documents unavailable:', error);
    },
  });
}

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** URL of the published governance document with this exact title, or null if none is published yet. */
export function governanceUrl(docs: MongoDocument[], title: string): string | null {
  return docs.find((d) => d.category === 'GOVERNANCE' && same(d.title, title))?.url ?? null;
}

/** The most recently added organisational profile, falling back to lib/org.ts. */
export function profileUrl(docs: MongoDocument[]): string | null {
  return docs.find((d) => d.category === 'PROFILE')?.url ?? ORG_PROFILE_URL;
}
