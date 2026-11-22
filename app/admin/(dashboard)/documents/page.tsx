import Link from 'next/link';
import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import {
  AdminDeleteButton,
  AdminField,
  AdminFormCard,
  AdminPrimaryButton,
  AdminTextArea,
} from '@/components/admin/forms/AdminField';
import { requireAdmin } from '@/lib/auth-utils';
import {
  getSearchParamValue,
  readAdminFlashMessage,
  type SearchParamRecord,
} from '@/lib/admin-feedback';
import { isMongoConfigured } from '@/lib/mongodb';
import {
  DOCUMENT_CATEGORIES,
  mongoDocumentsList,
  type MongoDocument,
} from '@/lib/mongo-documents-store';
import { GOVERNANCE_DOCUMENT_TITLES } from '@/lib/public-documents';
import { deleteDocumentAction, saveDocumentAction } from '@/app/admin/(dashboard)/documents/actions';

export default async function AdminDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const flashMessage = readAdminFlashMessage(params);
  const editId = getSearchParamValue(params.edit);

  let docs: MongoDocument[] = [];
  let loadError: string | null = null;
  if (!isMongoConfigured()) {
    loadError = 'MongoDB is not configured for this deployment. Set MONGODB_URI, then redeploy.';
  } else {
    try {
      docs = await mongoDocumentsList();
    } catch (e) {
      loadError = e instanceof Error ? e.message : 'Could not load documents.';
    }
  }

  const editing = editId ? docs.find((d) => d.id === editId) ?? null : null;
  const label = (v: string) => DOCUMENT_CATEGORIES.find((c) => c.value === v)?.label ?? v;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section>
        <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
          Public site
        </span>
        <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
          Documents
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
          Reports appear on Reports and Publications. Governance documents are linked on the
          Governance page when their title matches exactly. The organisational profile powers the
          “Download Our Organisational Profile” button. Only publish approved, current versions.
        </p>
      </section>

      {flashMessage ? <AdminFlashBanner type={flashMessage.type} message={flashMessage.message} /> : null}
      {loadError ? <AdminFlashBanner type="error" message={loadError} /> : null}

      <AdminFormCard title={editing ? `Edit: ${editing.title}` : 'Publish a document'}>
        <form action={saveDocumentAction} className="grid gap-4 md:grid-cols-2" key={editing?.id ?? 'new'}>
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
          <AdminField label="Title" name="title" required defaultValue={editing?.title} hint="For governance documents, use one of the exact titles listed below." />
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#1b1c1c]">
            Document type
            <select
              name="category"
              required
              defaultValue={editing?.category ?? 'REPORT'}
              className="w-full rounded-xl border border-[#e4beb9] bg-white px-4 py-2.5 text-sm text-[#1b1c1c] focus:border-[#ba0013] focus:outline-none focus:ring-2 focus:ring-[#ba0013]/20"
            >
              {DOCUMENT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </label>
          <div className="md:col-span-2">
            <AdminField label="Link to the file" name="url" required defaultValue={editing?.url} hint="An https:// link (Google Drive, Cloudinary…) or a file path such as /documents/annual-report-2025.pdf" />
          </div>
          <AdminField label="Reporting period or version" name="period" defaultValue={editing?.period} hint="Example: 2025, or Version 2, March 2026" />
          <div className="md:col-span-2">
            <AdminTextArea label="Short description (optional)" name="description" rows={3} defaultValue={editing?.description} />
          </div>
          <div className="flex gap-3 md:col-span-2">
            <AdminPrimaryButton>{editing ? 'Save changes' : 'Publish document'}</AdminPrimaryButton>
            {editing ? (
              <Link href="/yadmin/documents" className="self-center text-sm font-semibold text-[#5d3f3c]">Cancel</Link>
            ) : null}
          </div>
        </form>
        <p className="mt-4 text-xs text-[#5d3f3c]">
          Governance titles the site looks for: {GOVERNANCE_DOCUMENT_TITLES.join(', ')}.
        </p>
      </AdminFormCard>

      <ul className="flex flex-col gap-3">
        {docs.length === 0 && !loadError ? <li className="text-sm text-[#5d3f3c]">No documents published yet.</li> : null}
        {docs.map((d) => (
          <li key={d.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4beb9]/40 bg-white p-4">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[#1b1c1c]">{d.title}</p>
              <p className="truncate text-xs text-[#5d3f3c]">
                {label(d.category)}{d.period ? ` · ${d.period}` : ''} · {d.url}
              </p>
            </div>
            <Link href={`/yadmin/documents?edit=${d.id}`} className="rounded-full border border-[#e4beb9] px-3 py-1 text-xs font-semibold text-[#5d3f3c] hover:bg-[#f5f3f3]">Edit</Link>
            <form action={deleteDocumentAction}>
              <input type="hidden" name="id" value={d.id} />
              <AdminDeleteButton confirmText={`Remove document ${d.title}`} />
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
