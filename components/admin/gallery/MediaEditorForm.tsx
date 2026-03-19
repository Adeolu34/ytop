'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import AdminSubmitButton from '@/components/admin/forms/AdminSubmitButton';
import { createMediaAction, updateMediaAction } from '@/app/admin/gallery/actions';

const MEDIA_EDITOR_INITIAL_STATE = {
  error: null,
};

type MediaEditorFormProps = {
  mode: 'create' | 'edit';
  initialValues: {
    id?: string;
    filename?: string;
    originalName?: string;
    url?: string;
    mimeType?: string;
    type?: string;
    altText: string;
    caption: string;
    description: string;
    width: string;
    height: string;
  };
};

export default function MediaEditorForm({
  mode,
  initialValues,
}: MediaEditorFormProps) {
  const action = mode === 'create' ? createMediaAction : updateMediaAction;
  const [state, formAction] = useActionState(action, MEDIA_EDITOR_INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="mediaId" value={initialValues.id || ''} />

      {state.error ? (
        <AdminFlashBanner type="error" message={state.error} />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
        <section className="space-y-6">
          <div className="admin-surface-card rounded-2xl p-8">
            <div className="mb-6">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
                Asset Details
              </p>
              <h2 className="admin-font-display mt-3 text-2xl font-bold tracking-tight text-[#1b1c1c]">
                {mode === 'create' ? 'Upload a new asset' : 'Update this asset'}
              </h2>
            </div>

            {mode === 'create' ? (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  File
                </span>
                <input
                  type="file"
                  name="file"
                  required
                  className="w-full rounded-xl border border-dashed border-[#d8b9b4] bg-white px-4 py-4 text-sm text-[#1b1c1c] outline-none transition-colors file:mr-4 file:rounded-md file:border-0 file:bg-[#ffdad6] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#93000d] hover:border-[#ba0013]"
                />
              </label>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#ead6d3] bg-[#f8f5f5]">
                {initialValues.url && initialValues.mimeType?.startsWith('image/') ? (
                  <img
                    src={initialValues.url}
                    alt={
                      initialValues.altText ||
                      initialValues.originalName ||
                      'Media preview'
                    }
                    className="h-72 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center px-6 text-center text-sm text-[#5d3f3c]">
                    Preview unavailable for this file type.
                  </div>
                )}
                <div className="space-y-1 px-6 py-5 text-sm text-[#5d3f3c]">
                  <p className="font-semibold text-[#1b1c1c]">
                    {initialValues.originalName || initialValues.filename}
                  </p>
                  <p>{initialValues.mimeType || initialValues.type}</p>
                  <p>{initialValues.url}</p>
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Alt Text
                </span>
                <input
                  name="altText"
                  defaultValue={initialValues.altText}
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                  placeholder="Describe the image for accessibility"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Width
                </span>
                <input
                  type="number"
                  min="0"
                  name="width"
                  defaultValue={initialValues.width}
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                  placeholder="Optional"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Height
                </span>
                <input
                  type="number"
                  min="0"
                  name="height"
                  defaultValue={initialValues.height}
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                  placeholder="Optional"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Caption
                </span>
                <textarea
                  name="caption"
                  defaultValue={initialValues.caption}
                  rows={3}
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                  placeholder="Optional short caption"
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                Description
              </span>
              <textarea
                name="description"
                defaultValue={initialValues.description}
                rows={5}
                className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                placeholder="Optional internal notes about where this asset should be used."
              />
            </label>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-[#efeded] p-8">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
              Save
            </p>
            <p className="mt-3 text-sm leading-6 text-[#5d3f3c]">
              New uploads are stored locally in the project under
              public/uploads/admin. That works well for this repo today, but a
              cloud storage backend is still the right follow-up for production.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/admin/gallery"
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#1b1c1c] transition-colors hover:bg-[#f8f6f6]"
              >
                Cancel
              </Link>
              <AdminSubmitButton
                idleLabel={mode === 'create' ? 'Upload Asset' : 'Save Asset'}
                pendingLabel={mode === 'create' ? 'Uploading...' : 'Saving...'}
              />
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
