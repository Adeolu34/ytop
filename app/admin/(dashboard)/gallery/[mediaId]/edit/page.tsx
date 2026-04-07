import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import MediaEditorForm from '@/components/admin/gallery/MediaEditorForm';

export default async function EditMediaPage({
  params,
}: {
  params: Promise<{ mediaId: string }>;
}) {
  await requireAuth();
  const { mediaId } = await params;

  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    select: {
      id: true,
      filename: true,
      originalName: true,
      url: true,
      mimeType: true,
      type: true,
      altText: true,
      caption: true,
      description: true,
      width: true,
      height: true,
      folder: true,
    },
  });

  if (!media) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section>
        <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#ba0013]">
          Visual Assets
        </span>
        <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
          Edit Asset
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
          Fine-tune metadata, accessibility copy, and dimensions for this asset.
        </p>
      </section>

      <MediaEditorForm
        mode="edit"
        initialValues={{
          id: media.id,
          filename: media.filename,
          originalName: media.originalName,
          url: media.url,
          mimeType: media.mimeType,
          type: media.type,
          altText: media.altText || '',
          caption: media.caption || '',
          description: media.description || '',
          width: media.width?.toString() || '',
          height: media.height?.toString() || '',
          folder: media.folder || '',
        }}
      />
    </div>
  );
}
