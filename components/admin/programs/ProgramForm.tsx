'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import AdminSubmitButton from '@/components/admin/forms/AdminSubmitButton';
import {
  saveProgramAction,
  type ProgramState,
} from '@/app/admin/(dashboard)/programs/actions';

const INITIAL: ProgramState = { error: null };

type Props = {
  mode: 'create' | 'edit';
  initial: {
    id?: string;
    title: string;
    slug: string;
    description: string;
    shortDesc: string;
    imageId: string;
    sdgGoals: string;
    order: number;
    isActive: boolean;
  };
  imageOptions: Array<{ id: string; label: string }>;
};

export default function ProgramForm({ mode, initial, imageOptions }: Props) {
  const [state, formAction] = useActionState(saveProgramAction, INITIAL);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="programId" value={initial.id || ''} />
      {state.error ? <AdminFlashBanner type="error" message={state.error} /> : null}

      <div className="admin-surface-card rounded-2xl p-8 space-y-5">
        <p className="text-sm text-[#5d3f3c]">
          Description supports HTML (e.g. paragraphs and links) for the public programs page.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold">Title *</span>
            <input
              name="title"
              required
              defaultValue={initial.title}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold">URL slug</span>
            <input
              name="slug"
              defaultValue={initial.slug}
              placeholder="auto from title"
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold">Short description</span>
            <input
              name="shortDesc"
              defaultValue={initial.shortDesc}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold">Full description (HTML) *</span>
            <textarea
              name="description"
              required
              rows={12}
              defaultValue={initial.description}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm font-mono text-xs"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold">Cover image</span>
            <select
              name="imageId"
              defaultValue={initial.imageId}
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            >
              <option value="">No image</option>
              {imageOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold">
              SDG goal numbers (comma-separated, e.g. 4, 8, 10)
            </span>
            <input
              name="sdgGoals"
              defaultValue={initial.sdgGoals}
              placeholder="4, 8, 10"
              className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm"
            />
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
            <span className="text-sm font-semibold">Show on public programs page</span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/programs"
          className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold shadow-sm"
        >
          Cancel
        </Link>
        <AdminSubmitButton
          idleLabel={mode === 'create' ? 'Create program' : 'Save program'}
          pendingLabel="Saving..."
        />
      </div>
    </form>
  );
}
