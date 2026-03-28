import { requireAuth } from '@/lib/auth-utils';
import MediaEditorForm from '@/components/admin/gallery/MediaEditorForm';

export default async function NewMediaPage() {
  await requireAuth();

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section>
        <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#ba0013]">
          Visual Assets
        </span>
        <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
          Upload Asset
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
          Add a new image, document, or video to the managed media library.
        </p>
      </section>

      <MediaEditorForm
        mode="create"
        initialValues={{
          altText: '',
          caption: '',
          description: '',
          width: '',
          height: '',
        }}
      />
    </div>
  );
}
