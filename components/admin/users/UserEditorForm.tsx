'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import AdminSubmitButton from '@/components/admin/forms/AdminSubmitButton';
import {
  saveUserAction,
  USER_EDITOR_INITIAL_STATE,
} from '@/app/admin/users/actions';

type UserEditorFormProps = {
  mode: 'create' | 'edit';
  initialValues: {
    id?: string;
    name: string;
    email: string;
    role: string;
    bio: string;
    image: string;
  };
};

export default function UserEditorForm({
  mode,
  initialValues,
}: UserEditorFormProps) {
  const [state, formAction] = useActionState(
    saveUserAction,
    USER_EDITOR_INITIAL_STATE
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="userId" value={initialValues.id || ''} />

      {state.error ? (
        <AdminFlashBanner type="error" message={state.error} />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
        <section className="space-y-6">
          <div className="admin-surface-card rounded-2xl p-8">
            <div className="mb-6">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
                Account Details
              </p>
              <h2 className="admin-font-display mt-3 text-2xl font-bold tracking-tight text-[#1b1c1c]">
                {mode === 'create' ? 'Create a staff account' : 'Update this staff account'}
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Full Name
                </span>
                <input
                  name="name"
                  defaultValue={initialValues.name}
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                  placeholder="Jane Admin"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Role
                </span>
                <select
                  name="role"
                  defaultValue={initialValues.role}
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                >
                  <option value="ADMIN">Administrator</option>
                  <option value="EDITOR">Editor</option>
                  <option value="AUTHOR">Author</option>
                  <option value="SUBSCRIBER">Subscriber</option>
                </select>
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Email Address
                </span>
                <input
                  type="email"
                  name="email"
                  defaultValue={initialValues.email}
                  required
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                  placeholder="admin@ytopglobal.org"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Profile Image URL
                </span>
                <input
                  name="image"
                  defaultValue={initialValues.image}
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                  placeholder="Optional hosted image URL"
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                Bio
              </span>
              <textarea
                name="bio"
                defaultValue={initialValues.bio}
                rows={5}
                className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                placeholder="Optional notes about this account owner."
              />
            </label>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="admin-surface-card rounded-2xl p-8">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
              Security
            </p>
            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                Password
              </span>
              <input
                type="password"
                name="password"
                className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                placeholder={
                  mode === 'create'
                    ? 'Leave blank to create a pending account'
                    : 'Leave blank to keep the current password'
                }
              />
            </label>

            <p className="mt-4 text-sm leading-6 text-[#5d3f3c]">
              Creating a user without a password keeps the account in a pending
              setup state until credentials are added later.
            </p>
          </div>

          <div className="rounded-2xl bg-[#efeded] p-8">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
              Save
            </p>
            <p className="mt-3 text-sm leading-6 text-[#5d3f3c]">
              Changes here affect who can access the admin section and what
              they can manage.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/admin/users"
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#1b1c1c] transition-colors hover:bg-[#f8f6f6]"
              >
                Cancel
              </Link>
              <AdminSubmitButton
                idleLabel={mode === 'create' ? 'Create User' : 'Save User'}
                pendingLabel={mode === 'create' ? 'Creating...' : 'Saving...'}
              />
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
