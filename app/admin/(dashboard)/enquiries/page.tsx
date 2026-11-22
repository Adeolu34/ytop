import Link from 'next/link';
import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import { requireAdmin } from '@/lib/auth-utils';
import {
  getSearchParamValue,
  readAdminFlashMessage,
  type SearchParamRecord,
} from '@/lib/admin-feedback';
import { isMongoConfigured } from '@/lib/mongodb';
import {
  mongoFormSubmissionCounts,
  mongoFormSubmissionsList,
  type FormType,
  type MongoFormSubmission,
} from '@/lib/mongo-forms-store';
import { updateEnquiryAction } from '@/app/admin/(dashboard)/enquiries/actions';

const TYPE_FILTERS: { label: string; value: FormType | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Contact', value: 'CONTACT' },
  { label: 'Volunteer', value: 'VOLUNTEER' },
  { label: 'Partnership', value: 'PARTNERSHIP' },
  { label: 'Newsletter', value: 'NEWSLETTER' },
];

function formatDate(value: Date | string): string {
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

function RowButton({ id, intent, label }: { id: string; intent: string; label: string }) {
  return (
    <form action={updateEnquiryAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="intent" value={intent} />
      <button
        type="submit"
        className="rounded-full border border-[#e4beb9] px-3 py-1 text-xs font-semibold text-[#5d3f3c] hover:bg-[#f5f3f3]"
      >
        {label}
      </button>
    </form>
  );
}

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const flashMessage = readAdminFlashMessage(params);
  const rawType = getSearchParamValue(params.type)?.trim().toUpperCase() ?? '';
  const type = TYPE_FILTERS.some((f) => f.value !== '' && f.value === rawType)
    ? (rawType as FormType)
    : undefined;

  let items: MongoFormSubmission[] = [];
  let counts = { total: 0, unread: 0 };
  let loadError: string | null = null;

  if (!isMongoConfigured()) {
    loadError = 'MongoDB is not configured for this deployment. Set MONGODB_URI, then redeploy.';
  } else {
    try {
      [items, counts] = await Promise.all([
        mongoFormSubmissionsList({ type, limit: 100 }),
        mongoFormSubmissionCounts(),
      ]);
    } catch (e) {
      loadError = e instanceof Error ? e.message : 'Could not load enquiries.';
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section>
        <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
          Inbox
        </span>
        <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
          Enquiries
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
          Contact, volunteer, partnership and newsletter submissions from the public site.{' '}
          {counts.unread} unread of {counts.total} total.
        </p>
      </section>

      {flashMessage ? (
        <AdminFlashBanner type={flashMessage.type} message={flashMessage.message} />
      ) : null}
      {loadError ? <AdminFlashBanner type="error" message={loadError} /> : null}

      <nav className="flex flex-wrap gap-2" aria-label="Filter by type">
        {TYPE_FILTERS.map((f) => {
          const active = (type ?? '') === f.value;
          return (
            <Link
              key={f.label}
              href={f.value ? `/yadmin/enquiries?type=${f.value}` : '/yadmin/enquiries'}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                active ? 'bg-[#ba0013] text-white' : 'bg-[#f5f3f3] text-[#5d3f3c]'
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>

      {items.length === 0 && !loadError ? (
        <p className="text-sm text-[#5d3f3c]">No enquiries yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {items.map((s) => {
            const subject = typeof s.data?.subject === 'string' ? s.data.subject : null;
            const message = typeof s.data?.message === 'string' ? s.data.message : null;
            return (
              <li
                key={s.id}
                className={`rounded-2xl border p-5 ${
                  s.isRead ? 'border-[#e4beb9]/40 bg-white' : 'border-[#ba0013]/40 bg-[#fff8f7]'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5d3f3c]">
                  <span className="rounded-full bg-[#f5f3f3] px-2.5 py-1">{s.type}</span>
                  {!s.isRead ? <span className="text-[#ba0013]">New</span> : null}
                  {s.isProcessed ? <span className="text-emerald-700">Handled</span> : null}
                  <span className="ml-auto font-normal normal-case">{formatDate(s.createdAt)}</span>
                </div>
                <p className="mt-2 font-bold text-[#1b1c1c]">
                  {s.name || 'Unnamed'}{' '}
                  {s.email ? (
                    <a href={`mailto:${s.email}`} className="font-normal text-[#ba0013] hover:underline">
                      {s.email}
                    </a>
                  ) : null}
                  {s.phone ? <span className="ml-2 font-normal text-[#5d3f3c]">{s.phone}</span> : null}
                </p>
                {subject ? <p className="mt-1 text-sm font-semibold text-[#1b1c1c]">{subject}</p> : null}
                {message ? (
                  <p className="mt-1 whitespace-pre-wrap text-sm text-[#5d3f3c]">{message}</p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.isRead ? (
                    <RowButton id={s.id} intent="unread" label="Mark unread" />
                  ) : (
                    <RowButton id={s.id} intent="read" label="Mark read" />
                  )}
                  {s.isProcessed ? (
                    <RowButton id={s.id} intent="reopen" label="Reopen" />
                  ) : (
                    <RowButton id={s.id} intent="processed" label="Mark handled" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
