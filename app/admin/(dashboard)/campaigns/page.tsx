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
import { mongoCampaignsListAll, type MongoCampaignDoc } from '@/lib/mongo-campaigns-store';
import { deleteCampaignAction, saveCampaignAction } from '@/app/admin/(dashboard)/campaigns/actions';

export default async function AdminCampaignsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const flashMessage = readAdminFlashMessage(params);
  const editId = getSearchParamValue(params.edit);

  let items: MongoCampaignDoc[] = [];
  let loadError: string | null = null;
  if (!isMongoConfigured()) {
    loadError = 'MongoDB is not configured for this deployment. Set MONGODB_URI, then redeploy.';
  } else {
    try {
      items = await mongoCampaignsListAll();
    } catch (e) {
      loadError = e instanceof Error ? e.message : 'Could not load campaigns.';
    }
  }

  const editing = editId ? items.find((c) => c.id === editId) ?? null : null;
  const now = Date.now();

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section>
        <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
          Fundraising
        </span>
        <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
          Campaigns
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
          Active campaigns whose end date has not passed appear on the Donate page with a progress bar.
          Untick Active, or delete a campaign, to take it off the site. Update the amount raised yourself
          as gifts arrive.
        </p>
      </section>

      {flashMessage ? <AdminFlashBanner type={flashMessage.type} message={flashMessage.message} /> : null}
      {loadError ? <AdminFlashBanner type="error" message={loadError} /> : null}

      <AdminFormCard title={editing ? `Edit: ${editing.title}` : 'Add a campaign'}>
        <form action={saveCampaignAction} className="grid gap-4 md:grid-cols-2" key={editing?.id ?? 'new'}>
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
          <div className="md:col-span-2">
            <AdminField label="Title" name="title" required defaultValue={editing?.title} />
          </div>
          <div className="md:col-span-2">
            <AdminTextArea label="What the money will fund" name="description" required defaultValue={editing?.description} />
          </div>
          <AdminField label="Goal amount" name="goalAmount" type="number" min={1} step="any" required defaultValue={editing?.goalAmount} />
          <AdminField label="Amount raised so far" name="raisedAmount" type="number" min={0} step="any" defaultValue={editing?.raisedAmount ?? 0} />
          <AdminField label="Currency code" name="currency" defaultValue={editing?.currency ?? 'NGN'} hint="NGN, USD, GBP..." />
          <AdminField label="Image path or https URL (optional)" name="imageUrl" defaultValue={editing?.image?.url} />
          <div className="md:col-span-2">
            <AdminField label="Paystack payment link for this campaign (optional)" name="paymentUrl" defaultValue={editing?.paymentUrl} hint="Create a payment page for this campaign in Paystack and paste its https link. Donors who choose this campaign on the Donate form are sent there." />
          </div>
          <AdminField label="Starts (UTC)" name="startDate" type="datetime-local" required defaultValue={toDateTimeLocal(editing?.startDate)} />
          <AdminField label="Ends (UTC)" name="endDate" type="datetime-local" required defaultValue={toDateTimeLocal(editing?.endDate)} />
          <div className="md:col-span-2">
            <AdminCheckbox label="Active (show on the Donate page)" name="isActive" defaultChecked={editing ? editing.isActive : true} />
          </div>
          <div className="flex gap-3 md:col-span-2">
            <AdminPrimaryButton>{editing ? 'Save changes' : 'Create campaign'}</AdminPrimaryButton>
            {editing ? (
              <Link href="/yadmin/campaigns" className="self-center text-sm font-semibold text-[#5d3f3c]">
                Cancel
              </Link>
            ) : null}
          </div>
        </form>
      </AdminFormCard>

      <ul className="flex flex-col gap-3">
        {items.length === 0 && !loadError ? (
          <li className="text-sm text-[#5d3f3c]">No campaigns yet.</li>
        ) : null}
        {items.map((c) => {
          const live = c.isActive && new Date(c.endDate).getTime() >= now;
          const pct = c.goalAmount > 0 ? Math.min(100, Math.round((c.raisedAmount / c.goalAmount) * 100)) : 0;
          return (
            <li key={c.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4beb9]/40 bg-white p-4">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#1b1c1c]">{c.title}</p>
                <p className="text-xs text-[#5d3f3c]">
                  {c.currency} {c.raisedAmount.toLocaleString()} of {c.goalAmount.toLocaleString()} ({pct}%) · ends{' '}
                  {new Date(c.endDate).toLocaleDateString('en-GB', { dateStyle: 'medium', timeZone: 'UTC' })}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${live ? 'bg-emerald-50 text-emerald-700' : 'bg-[#f5f3f3] text-[#5d3f3c]'}`}>
                {live ? 'Showing' : 'Hidden'}
              </span>
              <Link href={`/yadmin/campaigns?edit=${c.id}`} className="rounded-full border border-[#e4beb9] px-3 py-1 text-xs font-semibold text-[#5d3f3c] hover:bg-[#f5f3f3]">
                Edit
              </Link>
              <form action={deleteCampaignAction}>
                <input type="hidden" name="id" value={c.id} />
                <AdminDeleteButton confirmText={`Delete campaign ${c.title}`} />
              </form>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
