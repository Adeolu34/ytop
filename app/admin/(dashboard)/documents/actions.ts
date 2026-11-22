'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-utils';
import { createAdminRedirectUrl } from '@/lib/admin-feedback';
import { readOptionalText, readText } from '@/lib/admin-form';
import {
  DOCUMENT_CATEGORIES,
  mongoDocumentDelete,
  mongoDocumentUpsert,
  type DocumentCategory,
} from '@/lib/mongo-documents-store';

const INDEX_PATH = '/admin/documents';

function revalidateDocumentSurfaces() {
  for (const path of ['/reports', '/governance', '/safeguarding', '/get-involved/partner']) {
    revalidatePath(path);
  }
}

/** Accepts an https link or a site-relative path to a file under /public. */
function readDocumentUrl(raw: string): string | null {
  const v = raw.trim();
  if (/^https:\/\/\S+$/i.test(v)) return v;
  if (/^\/[^\s?#]*\.[a-z0-9]{2,5}$/i.test(v) && !v.startsWith('//')) return v;
  return null;
}

export async function saveDocumentAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = readOptionalText(formData, 'id', 80);
  const title = readText(formData, 'title', 200);
  const category = readText(formData, 'category', 20) as DocumentCategory;
  const url = readDocumentUrl(readText(formData, 'url', 600));

  if (!title) {
    redirect(createAdminRedirectUrl(INDEX_PATH, { error: 'A title is required.' }));
  }
  if (!DOCUMENT_CATEGORIES.some((c) => c.value === category)) {
    redirect(createAdminRedirectUrl(INDEX_PATH, { error: 'Choose a document type.' }));
  }
  if (!url) {
    redirect(
      createAdminRedirectUrl(INDEX_PATH, {
        error: 'The link must start with https:// or be a path to a file such as /documents/report.pdf.',
      })
    );
  }

  await mongoDocumentUpsert(id, {
    title,
    category,
    url,
    description: readOptionalText(formData, 'description', 1000),
    period: readOptionalText(formData, 'period', 100),
  });

  revalidateDocumentSurfaces();
  redirect(createAdminRedirectUrl(INDEX_PATH, { notice: id ? 'Document updated.' : 'Document published.' }));
}

export async function deleteDocumentAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = readText(formData, 'id', 80);
  if (id) await mongoDocumentDelete(id);
  revalidateDocumentSurfaces();
  redirect(createAdminRedirectUrl(INDEX_PATH, { notice: 'Document removed.' }));
}
