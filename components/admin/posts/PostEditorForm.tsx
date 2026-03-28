'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import AdminSubmitButton from '@/components/admin/forms/AdminSubmitButton';
import { savePostAction } from '@/app/admin/(dashboard)/posts/actions';

const POST_EDITOR_INITIAL_STATE = {
  error: null,
};

type PostEditorFormProps = {
  mode: 'create' | 'edit';
  initialValues: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    status: string;
    authorId: string;
    categories: string;
    tags: string;
    featuredImageId: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    publishedAt: string;
  };
  authors: Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
  }>;
  featuredImages: Array<{
    id: string;
    filename: string;
  }>;
};

export default function PostEditorForm({
  mode,
  initialValues,
  authors,
  featuredImages,
}: PostEditorFormProps) {
  const [state, formAction] = useActionState(
    savePostAction,
    POST_EDITOR_INITIAL_STATE
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="postId" value={initialValues.id || ''} />

      {state.error ? (
        <AdminFlashBanner type="error" message={state.error} />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
        <section className="space-y-6">
          <div className="admin-surface-card rounded-2xl p-8">
            <div className="mb-6">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
                Editorial Draft
              </p>
              <h2 className="admin-font-display mt-3 text-2xl font-bold tracking-tight text-[#1b1c1c]">
                {mode === 'create' ? 'Compose a new story' : 'Refine this story'}
              </h2>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Title
                </span>
                <input
                  name="title"
                  defaultValue={initialValues.title}
                  required
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                  placeholder="Youth leadership is changing the future"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                    Slug
                  </span>
                  <input
                    name="slug"
                    defaultValue={initialValues.slug}
                    className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                    placeholder="auto-generated-from-title"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                    Publish At
                  </span>
                  <input
                    type="datetime-local"
                    name="publishedAt"
                    defaultValue={initialValues.publishedAt}
                    className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Excerpt
                </span>
                <textarea
                  name="excerpt"
                  defaultValue={initialValues.excerpt}
                  rows={4}
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                  placeholder="A short summary for cards, previews, and search snippets."
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Content
                </span>
                <textarea
                  name="content"
                  defaultValue={initialValues.content}
                  required
                  rows={16}
                  className="w-full rounded-2xl border border-[#e7d6d4] bg-white px-4 py-4 text-sm leading-7 text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                  placeholder="Write the full story here."
                />
              </label>
            </div>
          </div>

          <div className="admin-surface-card rounded-2xl p-8">
            <div className="mb-6">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
                Structure
              </p>
              <h2 className="admin-font-display mt-3 text-2xl font-bold tracking-tight text-[#1b1c1c]">
                Categorization and SEO
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Categories
                </span>
                <input
                  name="categories"
                  defaultValue={initialValues.categories}
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                  placeholder="Leadership, News"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Tags
                </span>
                <input
                  name="tags"
                  defaultValue={initialValues.tags}
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                  placeholder="impact, youth, africa"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Meta Title
                </span>
                <input
                  name="metaTitle"
                  defaultValue={initialValues.metaTitle}
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                  placeholder="Optional search title"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Meta Keywords
                </span>
                <input
                  name="metaKeywords"
                  defaultValue={initialValues.metaKeywords}
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                  placeholder="Optional comma-separated keywords"
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                Meta Description
              </span>
              <textarea
                name="metaDescription"
                defaultValue={initialValues.metaDescription}
                rows={4}
                className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                placeholder="Optional search description"
              />
            </label>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="admin-surface-card rounded-2xl p-8">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
              Publishing
            </p>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Status
                </span>
                <select
                  name="status"
                  defaultValue={initialValues.status}
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="SCHEDULED">Scheduled</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Author
                </span>
                <select
                  name="authorId"
                  defaultValue={initialValues.authorId}
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                >
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {(author.name || author.email) + ' · ' + author.role}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                  Featured Image
                </span>
                <select
                  name="featuredImageId"
                  defaultValue={initialValues.featuredImageId}
                  className="w-full rounded-xl border border-[#e7d6d4] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
                >
                  <option value="">No featured image</option>
                  {featuredImages.map((image) => (
                    <option key={image.id} value={image.id}>
                      {image.filename}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-2xl bg-[#efeded] p-8">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
              Save
            </p>
            <p className="mt-3 text-sm leading-6 text-[#5d3f3c]">
              Drafts stay private. Published posts receive a live date
              automatically if one is not supplied.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/admin/posts"
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#1b1c1c] transition-colors hover:bg-[#f8f6f6]"
              >
                Cancel
              </Link>
              <AdminSubmitButton
                idleLabel={mode === 'create' ? 'Create Post' : 'Save Changes'}
                pendingLabel={mode === 'create' ? 'Creating...' : 'Saving...'}
              />
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
