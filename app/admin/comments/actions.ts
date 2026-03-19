'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth-utils';
import { createAdminRedirectUrl } from '@/lib/admin-feedback';

const COMMENT_INDEX_PATH = '/admin/comments';

export async function approveCommentAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const commentId = readRequiredString(formData, 'commentId');
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      isApproved: true,
      post: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!comment) {
    redirect(
      createAdminRedirectUrl(COMMENT_INDEX_PATH, {
        error: 'That comment could not be found.',
      })
    );
  }

  if (comment.isApproved) {
    redirect(
      createAdminRedirectUrl(COMMENT_INDEX_PATH, {
        notice: 'That comment is already approved.',
      })
    );
  }

  await prisma.comment.update({
    where: { id: commentId },
    data: { isApproved: true },
  });

  revalidateCommentSurfaces(comment.post.slug);

  redirect(
    createAdminRedirectUrl(COMMENT_INDEX_PATH, {
      notice: 'Comment approved and published successfully.',
    })
  );
}

export async function deleteCommentAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const commentId = readRequiredString(formData, 'commentId');
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      post: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!comment) {
    redirect(
      createAdminRedirectUrl(COMMENT_INDEX_PATH, {
        error: 'That comment could not be found.',
      })
    );
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  revalidateCommentSurfaces(comment.post.slug);

  redirect(
    createAdminRedirectUrl(COMMENT_INDEX_PATH, {
      notice: 'Comment deleted successfully.',
    })
  );
}

function revalidateCommentSurfaces(postSlug: string): void {
  revalidatePath('/admin');
  revalidatePath(COMMENT_INDEX_PATH);
  revalidatePath('/blog');
  revalidatePath(`/blog/${postSlug}`);
}

function readRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== 'string') {
    throw new Error(`${key} is required`);
  }

  return value;
}
