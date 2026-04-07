'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import AdminSubmitButton from '@/components/admin/forms/AdminSubmitButton';
import {
  saveTeamMemberAction,
  type TeamState,
} from '@/app/admin/(dashboard)/team/actions';

const INITIAL: TeamState = { error: null };

type Props = {
  mode: 'create' | 'edit';
  initial: {
    id?: string;
    name: string;
    slug: string;
    position: string;
    teamSection: string;
    bio: string;
    photoId: string;
    email: string;
    phone: string;
    linkedin: string;
    twitter: string;
    facebook: string;
    order: number;
    isActive: boolean;
  };
  imageOptions: Array<{ id: string; label: string }>;
};

export default function TeamMemberForm({ mode, initial, imageOptions }: Props) {
  const [state, formAction] = useActionState(saveTeamMemberAction, INITIAL);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="memberId" value={initial.id || ''} />
      {state.error ? <AdminFlashBanner type="error" message={state.error} /> : null}

      <div className="admin-surface-card rounded-2xl p-8 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold">Name *</span>
            <input
              name="name"
              required
              defaultValue={initial.name}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">URL slug</span>
            <input
              name="slug"
              defaultValue={initial.slug}
              placeholder="auto from name"
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Position / title *</span>
            <input
              name="position"
              required
              defaultValue={initial.position}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Team tab</span>
            <select
              name="teamSection"
              defaultValue={initial.teamSection}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            >
              <option value="core">Core team</option>
              <option value="faculty">Faculty & mentors</option>
              <option value="volunteer">Volunteers</option>
              <option value="community">Community</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Sort order</span>
            <input
              type="number"
              name="order"
              defaultValue={initial.order}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 md:col-span-2">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={initial.isActive}
              className="rounded border-[#e7d6d4]"
            />
            <span className="text-sm font-semibold">Visible on public team page</span>
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold">Photo (from gallery)</span>
            <select
              name="photoId"
              defaultValue={initial.photoId}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            >
              <option value="">No photo</option>
              {imageOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold">Bio</span>
            <textarea
              name="bio"
              rows={4}
              defaultValue={initial.bio}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Email</span>
            <input
              name="email"
              type="email"
              defaultValue={initial.email}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Phone</span>
            <input
              name="phone"
              defaultValue={initial.phone}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">LinkedIn URL</span>
            <input
              name="linkedin"
              defaultValue={initial.linkedin}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Twitter / X URL</span>
            <input
              name="twitter"
              defaultValue={initial.twitter}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold">Facebook URL</span>
            <input
              name="facebook"
              defaultValue={initial.facebook}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/team"
          className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold shadow-sm"
        >
          Cancel
        </Link>
        <AdminSubmitButton
          idleLabel={mode === 'create' ? 'Create member' : 'Save changes'}
          pendingLabel="Saving..."
        />
      </div>
    </form>
  );
}
