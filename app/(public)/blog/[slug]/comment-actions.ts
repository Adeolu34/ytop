'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getMongoDb } from '@/lib/mongodb';
import {
  assessCommentModeration,
  normalizeCommentSubmission,
} from '@/lib/comment-moderation';
import { mongoFindPostBySlug } from '@/lib/mongo-blog';
import { mongoCommentInsert } from '@/lib/mongo-comments-store';

const COLLECTION = 'blog_comments';

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

  const doc = await mongoFindPostBySlug(validationResult.data.postSlug);
  if (
    !doc ||
    doc.sourcePostId !== validationResult.data.postId ||
    doc.status !== 'PUBLISHED'
  ) {
    return {
      status: 'error',
      message: 'This post is no longer available for commenting.',
    };
  }

  const post = { id: doc.sourcePostId, slug: doc.slug };

  const recentWindow = new Date(Date.now() - 30 * 60 * 1000);
  const db = await getMongoDb();
  const col = db.collection(COLLECTION);
  const [recentDuplicateCount, recentSubmissionCount] = await Promise.all([
    col.countDocuments({
      postId: post.id,
      authorEmail: normalizedInput.email,
      content: normalizedInput.content,
      createdAt: { $gte: recentWindow },
    }),
    col.countDocuments({
      postId: post.id,
      authorEmail: normalizedInput.email,
      createdAt: { $gte: recentWindow },
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

  await mongoCommentInsert({
    postId: post.id,
    postSlug: post.slug,
    content: normalizedInput.content,
    authorName: normalizedInput.name,
    authorEmail: normalizedInput.email,
    isApproved: moderationResult.decision === 'approve',
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
