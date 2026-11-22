import Link from 'next/link';
import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import {
  AdminCheckbox,
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
  mongoTestimonialsListAll,
  type MongoTestimonialDoc,
} from '@/lib/mongo-testimonials-store';
import {
  deleteTestimonialAction,
  saveTestimonialAction,
} from '@/app/admin/(dashboard)/testimonials/actions';

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const flashMessage = readAdminFlashMessage(params);
  const editId = getSearchParamValue(params.edit);

  let items: MongoTestimonialDoc[] = [];
  let loadError: string | null = null;
  if (!isMongoConfigured()) {
    loadError = 'MongoDB is not configured for this deployment. Set MONGODB_URI, then redeploy.';
  } else {
    try {
      items = await mongoTestimonialsListAll();
    } catch (e) {
      loadError = e instanceof Error ? e.message : 'Could not load stories.';
    }
  }

  const editing = editId ? items.find((t) => t.id === editId) ?? null : null;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section>
        <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
          Public site
        </span>
        <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
          Participant stories
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
          Stories appear on the Stories page. Featured ones also appear on the homepage. Once you add
          any story here, the site uses these instead of its built-in examples.
        </p>
      </section>

      {flashMessage ? <AdminFlashBanner type={flashMessage.type} message={flashMessage.message} /> : null}
      {loadError ? <AdminFlashBanner type="error" message={loadError} /> : null}

      <AdminFormCard title={editing ? `Edit: ${editing.name}` : 'Add a story'}>
        <form action={saveTestimonialAction} className="grid gap-4 md:grid-cols-2" key={editing?.id ?? 'new'}>
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
          <AdminField label="Name" name="name" required defaultValue={editing?.name} />
          <AdminField label="Programme or role" name="position" defaultValue={editing?.position} hint="Example: Rise of Warriors" />
          <AdminField label="Institution (optional)" name="company" defaultValue={editing?.company} />
          <AdminField label="Photo path or https URL (optional)" name="photoUrl" defaultValue={editing?.photo?.url} />
          <div className="md:col-span-2">
            <AdminTextArea label="Their words" name="content" required rows={6} defaultValue={editing?.content} />
          </div>
          <AdminField label="Display order (lowest first)" name="order" type="number" defaultValue={editing?.order ?? 0} />
          <div className="flex flex-col justify-end gap-2">
            <AdminCheckbox label="Show on the homepage" name="isFeatured" defaultChecked={editing?.isFeatured} />
            <AdminCheckbox label="This person agreed to be named and quoted" name="consent" defaultChecked={Boolean(editing)} />
          </div>
          <div className="flex gap-3 md:col-span-2">
            <AdminPrimaryButton>{editing ? 'Save changes' : 'Add story'}</AdminPrimaryButton>
            {editing ? (
              <Link href="/yadmin/testimonials" className="self-center text-sm font-semibold text-[#5d3f3c]">
                Cancel
              </Link>
            ) : null}
          </div>
        </form>
      </AdminFormCard>

      <ul className="flex flex-col gap-3">
        {items.length === 0 && !loadError ? (
          <li className="text-sm text-[#5d3f3c]">No stories yet. The site is showing its built-in examples.</li>
        ) : null}
        {items.map((t) => (
          <li key={t.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4beb9]/40 bg-white p-4">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[#1b1c1c]">{t.name}</p>
              <p className="line-clamp-2 text-sm text-[#5d3f3c]">{t.content}</p>
            </div>
            {t.isFeatured ? (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Homepage</span>
            ) : null}
            <Link href={`/yadmin/testimonials?edit=${t.id}`} className="rounded-full border border-[#e4beb9] px-3 py-1 text-xs font-semibold text-[#5d3f3c] hover:bg-[#f5f3f3]">
              Edit
            </Link>
            <form action={deleteTestimonialAction}>
              <input type="hidden" name="id" value={t.id} />
              <AdminDeleteButton confirmText={`Delete story from ${t.name}`} />
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
