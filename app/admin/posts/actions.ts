'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PostStatus, Prisma } from '@/app/generated/prisma';
import prisma from '@/lib/db';
import { checkPermission, requireAuth } from '@/lib/auth-utils';
import { buildPostDraft, slugifyValue } from '@/lib/admin-crud';
import { createAdminRedirectUrl } from '@/lib/admin-feedback';

type PostEditorState = {
  error: string | null;
};

const POST_INDEX_PATH = '/admin/posts';

export async function savePostAction(
  _previousState: PostEditorState,
  formData: FormData
): Promise<PostEditorState> {
  const currentUser = await requireAuth();

  if (!checkPermission(currentUser.role, 'AUTHOR')) {
    return { error: 'You do not have permission to manage posts.' };
  }

  const postId = readOptionalString(formData, 'postId');

  try {
    const draft = buildPostDraft({
      title: readRequiredString(formData, 'title'),
      slug: readOptionalString(formData, 'slug') || '',
      excerpt: readOptionalString(formData, 'excerpt') || '',
      content: readRequiredString(formData, 'content'),
      status: readRequiredString(formData, 'status'),
      authorId: resolveAuthorId(formData, currentUser.id),
      categories: readOptionalString(formData, 'categories') || '',
      tags: readOptionalString(formData, 'tags') || '',
      featuredImageId: readOptionalString(formData, 'featuredImageId') || '',
      metaTitle: readOptionalString(formData, 'metaTitle') || '',
      metaDescription: readOptionalString(formData, 'metaDescription') || '',
      metaKeywords: readOptionalString(formData, 'metaKeywords') || '',
      publishedAt: readOptionalString(formData, 'publishedAt') || '',
    });

    const authorId = resolveAllowedAuthorId(currentUser, draft.authorId);
    const slug = await createUniquePostSlug(draft.slug, postId);
    const existingPost = postId
      ? await prisma.post.findUnique({
          where: { id: postId },
          select: { slug: true },
        })
      : null;

    if (postId && !existingPost) {
      return { error: 'That post could not be found.' };
    }

    if (postId) {
      await prisma.post.update({
        where: { id: postId },
        data: buildPostUpdateData(draft, authorId, slug),
      });
    } else {
      await prisma.post.create({
        data: buildPostCreateData(draft, authorId, slug),
      });
    }

    revalidatePostSurfaces(existingPost?.slug, slug);
  } catch (error) {
    return { error: getActionErrorMessage(error) };
  }

  redirect(
    createAdminRedirectUrl(POST_INDEX_PATH, {
      notice: postId ? 'Post updated successfully.' : 'Post created successfully.',
    })
  );
}

export async function deletePostAction(formData: FormData): Promise<void> {
  const currentUser = await requireAuth();

  if (!checkPermission(currentUser.role, 'AUTHOR')) {
    redirect(
      createAdminRedirectUrl(POST_INDEX_PATH, {
        error: 'You do not have permission to delete posts.',
      })
    );
  }

  const postId = readRequiredString(formData, 'postId');
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { slug: true },
  });

  if (!post) {
    redirect(
      createAdminRedirectUrl(POST_INDEX_PATH, {
        error: 'That post could not be found.',
      })
    );
  }

  await prisma.post.delete({ where: { id: postId } });
  revalidatePostSurfaces(post.slug);

  redirect(
    createAdminRedirectUrl(POST_INDEX_PATH, {
      notice: 'Post deleted successfully.',
    })
  );
}

export async function updatePostStatusAction(formData: FormData): Promise<void> {
  const currentUser = await requireAuth();

  if (!checkPermission(currentUser.role, 'AUTHOR')) {
    redirect(
      createAdminRedirectUrl(POST_INDEX_PATH, {
        error: 'You do not have permission to update posts.',
      })
    );
  }

  const postId = readRequiredString(formData, 'postId');
  const nextStatus = readRequiredString(formData, 'nextStatus');

  if (!['DRAFT', 'PUBLISHED', 'SCHEDULED'].includes(nextStatus)) {
    redirect(
      createAdminRedirectUrl(POST_INDEX_PATH, {
        error: 'That post status is invalid.',
      })
    );
  }

  const currentPost = await prisma.post.findUnique({
    where: { id: postId },
    select: { slug: true, publishedAt: true },
  });

  if (!currentPost) {
    redirect(
      createAdminRedirectUrl(POST_INDEX_PATH, {
        error: 'That post could not be found.',
      })
    );
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      status: nextStatus as PostStatus,
      publishedAt:
        nextStatus === 'PUBLISHED'
          ? currentPost.publishedAt || new Date()
          : nextStatus === 'DRAFT'
            ? null
            : currentPost.publishedAt,
    },
  });

  revalidatePostSurfaces(currentPost.slug);

  redirect(
    createAdminRedirectUrl(POST_INDEX_PATH, {
      notice:
        nextStatus === 'PUBLISHED'
          ? 'Post published successfully.'
          : 'Post moved back to draft.',
    })
  );
}

function buildPostCreateData(
  draft: ReturnType<typeof buildPostDraft>,
  authorId: string,
  slug: string
): Prisma.PostCreateInput {
  return {
    title: draft.title,
    slug,
    excerpt: draft.excerpt,
    content: draft.content,
    status: draft.status,
    author: { connect: { id: authorId } },
    categories: buildTaxonomyCreateInput(draft.categoryNames),
    tags: buildTaxonomyCreateInput(draft.tagNames),
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    metaKeywords: draft.metaKeywords,
    publishedAt: draft.publishedAt,
    ...(draft.featuredImageId
      ? { featuredImage: { connect: { id: draft.featuredImageId } } }
      : {}),
  };
}

function buildPostUpdateData(
  draft: ReturnType<typeof buildPostDraft>,
  authorId: string,
  slug: string
): Prisma.PostUpdateInput {
  return {
    title: draft.title,
    slug,
    excerpt: draft.excerpt,
    content: draft.content,
    status: draft.status,
    author: { connect: { id: authorId } },
    categories: buildTaxonomyUpdateInput(draft.categoryNames),
    tags: buildTaxonomyUpdateInput(draft.tagNames),
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    metaKeywords: draft.metaKeywords,
    publishedAt: draft.publishedAt,
    featuredImage: draft.featuredImageId
      ? { connect: { id: draft.featuredImageId } }
      : { disconnect: true },
  };
}

function buildTaxonomyCreateInput(values: string[]) {
  return {
    connectOrCreate: values.map((value) => ({
      where: { slug: slugifyValue(value) },
      create: {
        name: value,
        slug: slugifyValue(value),
      },
    })),
  };
}

function buildTaxonomyUpdateInput(values: string[]) {
  return {
    set: [],
    connectOrCreate: values.map((value) => ({
      where: { slug: slugifyValue(value) },
      create: {
        name: value,
        slug: slugifyValue(value),
      },
    })),
  };
}

async function createUniquePostSlug(
  baseSlug: string,
  postId: string | null
): Promise<string> {
  let attempt = 1;
  let candidateSlug = baseSlug;

  while (true) {
    const existingPost = await prisma.post.findUnique({
      where: { slug: candidateSlug },
      select: { id: true },
    });

    if (!existingPost || existingPost.id === postId) {
      return candidateSlug;
    }

    attempt += 1;
    candidateSlug = `${baseSlug}-${attempt}`;
  }
}

function resolveAllowedAuthorId(
  currentUser: { id: string; role: string },
  requestedAuthorId: string
): string {
  if (checkPermission(currentUser.role, 'EDITOR')) {
    return requestedAuthorId;
  }

  return currentUser.id;
}

function resolveAuthorId(formData: FormData, fallbackAuthorId: string): string {
  return readOptionalString(formData, 'authorId') || fallbackAuthorId;
}

function revalidatePostSurfaces(
  previousSlug?: string | null,
  nextSlug?: string | null
): void {
  revalidatePath('/admin');
  revalidatePath(POST_INDEX_PATH);
  revalidatePath('/blog');

  if (previousSlug) {
    revalidatePath(`/blog/${previousSlug}`);
  }

  if (nextSlug) {
    revalidatePath(`/blog/${nextSlug}`);
  }
}

function readRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== 'string') {
    throw new Error(`${key} is required`);
  }

  return value;
}

function readOptionalString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === 'string' ? value : null;
}

function getActionErrorMessage(error: unknown): string {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    return 'A post with that slug already exists.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong while saving this post.';
}
