import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth-utils';
import PostEditorForm from '@/components/admin/posts/PostEditorForm';
import { getSiteBaseUrl } from '@/lib/email';
import {
  mongoMediaFindById,
  mongoMediaListImageFolders,
  mongoMediaListImagesForPicker,
} from '@/lib/mongo-media';
import {
  mongoPostFindBySourceId,
  mongoPostIdFromAdminPathSegment,
} from '@/lib/mongo-posts-store';
import { mongoUsersListAuthorsForPosts } from '@/lib/mongo-users-store';

function formatDateTimeLocal(value: Date | null): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const pad = (input: number) => input.toString().padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  await requireAuth();
  const { postId: postIdSegment } = await params;
  const postId = mongoPostIdFromAdminPathSegment(postIdSegment);

  const [post, authors, baseMedia, imageFolders] = await Promise.all([
    mongoPostFindBySourceId(postId),
    mongoUsersListAuthorsForPosts(),
    mongoMediaListImagesForPicker({ limit: 40 }),
    mongoMediaListImageFolders(),
  ]);

  if (!post) {
    notFound();
  }

  let mediaPickerInitialItems = baseMedia;
  if (
    post.featuredImageId &&
    !baseMedia.some((m) => m.id === post.featuredImageId)
  ) {
    const featured = await mongoMediaFindById(post.featuredImageId);
    if (featured) {
      mediaPickerInitialItems = [
        {
          id: featured.id,
          filename: featured.filename,
          url: featured.url,
          folder: featured.folder ?? null,
          altText: featured.altText ?? null,
          mimeType: featured.mimeType,
        },
        ...baseMedia,
      ];
    }
  }

  const siteBaseUrl = getSiteBaseUrl();

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section>
        <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
          Content Management
        </span>
        <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
          Edit Post
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
          Update the story content, publishing settings, and search metadata.
        </p>
      </section>

      <PostEditorForm
        mode="edit"
        authors={authors}
        mediaPickerInitialItems={mediaPickerInitialItems}
        imageFolders={imageFolders}
        publishActions={{
          slug: post.slug,
          postTitle: post.title,
          status: post.status,
          emailNotifiedAt: post.emailNotifiedAt?.toISOString() ?? null,
          siteBaseUrl,
        }}
        initialValues={{
          id: post.sourcePostId,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content,
          status: post.status,
          authorId: post.authorId,
          categories: post.categories.map((c) => c.name).join(', '),
          tags: post.tags.map((t) => t.name).join(', '),
          featuredImageId: post.featuredImageId || '',
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          metaKeywords: post.metaKeywords || '',
          publishedAt: formatDateTimeLocal(post.publishedAt),
        }}
      />
    </div>
  );
}
