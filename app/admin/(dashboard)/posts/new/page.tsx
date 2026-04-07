import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import PostEditorForm from '@/components/admin/posts/PostEditorForm';

export default async function NewPostPage() {
  const currentUser = await requireAuth();
  const [authors, mediaPickerInitialItems, folderRows] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'EDITOR', 'AUTHOR'],
        },
      },
      orderBy: [{ role: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    }),
    prisma.media.findMany({
      where: { type: 'IMAGE' },
      take: 40,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        url: true,
        folder: true,
        altText: true,
        mimeType: true,
      },
    }),
    prisma.media.findMany({
      where: { type: 'IMAGE', folder: { not: null } },
      select: { folder: true },
      distinct: ['folder'],
    }),
  ]);

  const imageFolders = folderRows
    .map((row) => row.folder)
    .filter((f): f is string => Boolean(f));

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section>
        <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
          Content Management
        </span>
        <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
          Create New Post
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
          Start a new story, assign its author, and decide when it should go live.
        </p>
      </section>

      <PostEditorForm
        mode="create"
        authors={authors}
        mediaPickerInitialItems={mediaPickerInitialItems}
        imageFolders={imageFolders}
        initialValues={{
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          status: 'DRAFT',
          authorId: currentUser.id,
          categories: '',
          tags: '',
          featuredImageId: '',
          metaTitle: '',
          metaDescription: '',
          metaKeywords: '',
          publishedAt: '',
        }}
      />
    </div>
  );
}
