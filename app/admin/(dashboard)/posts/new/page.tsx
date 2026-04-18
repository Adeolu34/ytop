import { requireAuth } from '@/lib/auth-utils';
import PostEditorForm from '@/components/admin/posts/PostEditorForm';
import {
  mongoMediaListImageFolders,
  mongoMediaListImagesForPicker,
} from '@/lib/mongo-media';
import { mongoUsersListAuthorsForPosts } from '@/lib/mongo-users-store';

export default async function NewPostPage() {
  const currentUser = await requireAuth();
  const [authors, mediaPickerInitialItems, imageFolders] = await Promise.all([
    mongoUsersListAuthorsForPosts(),
    mongoMediaListImagesForPicker({ limit: 40 }),
    mongoMediaListImageFolders(),
  ]);

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
