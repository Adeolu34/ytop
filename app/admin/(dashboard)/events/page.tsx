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
import { toDateTimeLocal } from '@/lib/admin-form';
import { isMongoConfigured } from '@/lib/mongodb';
import { mongoEventsListAll, type MongoEventDoc } from '@/lib/mongo-events-store';
import { deleteEventAction, saveEventAction } from '@/app/admin/(dashboard)/events/actions';

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const flashMessage = readAdminFlashMessage(params);
  const editId = getSearchParamValue(params.edit);

  let events: MongoEventDoc[] = [];
  let loadError: string | null = null;
  if (!isMongoConfigured()) {
    loadError = 'MongoDB is not configured for this deployment. Set MONGODB_URI, then redeploy.';
  } else {
    try {
      events = await mongoEventsListAll();
    } catch (e) {
      loadError = e instanceof Error ? e.message : 'Could not load events.';
    }
  }

  const editing = editId ? events.find((e) => e.id === editId) ?? null : null;
  const now = Date.now();

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section>
        <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
          Public site
        </span>
        <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
          Events
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
          Events with a future start date appear under Upcoming Events on the site. Past ones join the
          archive. Times are entered in UTC.
        </p>
      </section>

      {flashMessage ? <AdminFlashBanner type={flashMessage.type} message={flashMessage.message} /> : null}
      {loadError ? <AdminFlashBanner type="error" message={loadError} /> : null}

      <AdminFormCard title={editing ? `Edit: ${editing.title}` : 'Add an event'}>
        <form action={saveEventAction} className="grid gap-4 md:grid-cols-2" key={editing?.id ?? 'new'}>
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
          <div className="md:col-span-2">
            <AdminField label="Title" name="title" required defaultValue={editing?.title} />
          </div>
          <div className="md:col-span-2">
            <AdminTextArea label="Description" name="description" required defaultValue={editing?.description} />
          </div>
          <AdminField label="Starts (UTC)" name="startDate" type="datetime-local" required defaultValue={toDateTimeLocal(editing?.startDate)} />
          <AdminField label="Ends (UTC, optional)" name="endDate" type="datetime-local" defaultValue={toDateTimeLocal(editing?.endDate)} />
          <AdminField label="Venue or platform" name="location" defaultValue={editing?.location} />
          <AdminField label="Maximum participants" name="maxParticipants" type="number" min={1} defaultValue={editing?.maxParticipants} />
          <AdminField label="Speakers and facilitators" name="speakers" defaultValue={editing?.speakers} hint="Names separated by commas" />
          <AdminField label="Relevant programme" name="programmeName" defaultValue={editing?.programmeName} hint="Example: Rise of Warriors" />
          <AdminField label="Registration link (https)" name="registrationUrl" defaultValue={editing?.registrationUrl} />
          <AdminField label="Image path or https URL" name="imageUrl" defaultValue={editing?.image?.url} hint="Example: /media/2025/10/DSC0289.jpg" />
          <div className="md:col-span-2">
            <AdminCheckbox label="This is an online event" name="isOnline" defaultChecked={editing?.isOnline} />
          </div>
          <div className="flex gap-3 md:col-span-2">
            <AdminPrimaryButton>{editing ? 'Save changes' : 'Create event'}</AdminPrimaryButton>
            {editing ? (
              <Link href="/yadmin/events" className="self-center text-sm font-semibold text-[#5d3f3c]">
                Cancel
              </Link>
            ) : null}
          </div>
        </form>
      </AdminFormCard>

      <ul className="flex flex-col gap-3">
        {events.length === 0 && !loadError ? (
          <li className="text-sm text-[#5d3f3c]">No events yet.</li>
        ) : null}
        {events.map((e) => {
          const upcoming = new Date(e.startDate).getTime() >= now;
          return (
            <li key={e.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4beb9]/40 bg-white p-4">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#1b1c1c]">{e.title}</p>
                <p className="text-xs text-[#5d3f3c]">
                  {new Date(e.startDate).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })} UTC
                  {e.location ? ` · ${e.location}` : ''}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${upcoming ? 'bg-emerald-50 text-emerald-700' : 'bg-[#f5f3f3] text-[#5d3f3c]'}`}>
                {upcoming ? 'Upcoming' : 'Past'}
              </span>
              <Link href={`/yadmin/events?edit=${e.id}`} className="rounded-full border border-[#e4beb9] px-3 py-1 text-xs font-semibold text-[#5d3f3c] hover:bg-[#f5f3f3]">
                Edit
              </Link>
              <form action={deleteEventAction}>
                <input type="hidden" name="id" value={e.id} />
                <AdminDeleteButton confirmText={`Delete event ${e.title}`} />
              </form>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
