'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import {
  assessCommentModeration,
  normalizeCommentSubmission,
} from '@/lib/comment-moderation';
import { revalidatePath } from 'next/cache';

const commentSchema = z.object({
  postId: z.string().min(1),
  postSlug: z.string().min(1),
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  content: z.string().min(12).max(2000),
  website: z.string().max(200).optional(),
});

type CommentFormState = {
  status: 'idle' | 'approved' | 'review' | 'rejected' | 'error';
  message: string | null;
};

export async function submitCommentAction(
  _previousState: CommentFormState,
  formData: FormData
): Promise<CommentFormState> {
  const validationResult = commentSchema.safeParse({
    postId: readString(formData, 'postId'),
    postSlug: readString(formData, 'postSlug'),
    name: readString(formData, 'name'),
    email: readString(formData, 'email'),
    content: readString(formData, 'content'),
    website: readString(formData, 'website'),
  });

  if (!validationResult.success) {
    return {
      status: 'error',
      message: 'Please provide a valid name, email address, and comment.',
    };
  }

  const normalizedInput = normalizeCommentSubmission({
    ...validationResult.data,
    website: validationResult.data.website ?? '',
  });

  const post = await prisma.post.findFirst({
    where: {
      id: validationResult.data.postId,
      slug: validationResult.data.postSlug,
      status: 'PUBLISHED',
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!post) {
    return {
      status: 'error',
      message: 'This post is no longer available for commenting.',
    };
  }

  const recentWindow = new Date(Date.now() - 30 * 60 * 1000);
  const [recentDuplicateCount, recentSubmissionCount] = await Promise.all([
    prisma.comment.count({
      where: {
        postId: post.id,
        createdAt: { gte: recentWindow },
        authorEmail: normalizedInput.email,
        content: normalizedInput.content,
      },
    }),
    prisma.comment.count({
      where: {
        postId: post.id,
        createdAt: { gte: recentWindow },
        authorEmail: normalizedInput.email,
      },
    }),
  ]);

  const moderationResult = assessCommentModeration({
    ...normalizedInput,
    recentDuplicateCount,
    recentSubmissionCount,
  });

  if (moderationResult.decision === 'reject') {
    return {
      status: 'rejected',
      message:
        'Your comment was blocked because it looked like spam or contained abusive language.',
    };
  }

  await prisma.comment.create({
    data: {
      content: normalizedInput.content,
      authorName: normalizedInput.name,
      authorEmail: normalizedInput.email,
      post: { connect: { id: post.id } },
      isApproved: moderationResult.decision === 'approve',
    },
  });

  revalidatePath(`/blog/${post.slug}`);

  if (moderationResult.decision === 'review') {
    return {
      status: 'review',
      message:
        'Your comment was received and is waiting for moderation before it appears publicly.',
    };
  }

  return {
    status: 'approved',
    message: 'Thanks. Your comment is live and has been added below.',
  };
}

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}
