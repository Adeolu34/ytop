'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { checkPermission, requireAuth } from '@/lib/auth-utils';
import { buildPostDraft } from '@/lib/admin-crud';
import { createAdminRedirectUrl } from '@/lib/admin-feedback';
import {
  getSiteBaseUrl,
  isEmailSendingConfigured,
  sendBulkNewsletterEmail,
} from '@/lib/email';
import { mongoNewsletterSubscriberEmails } from '@/lib/mongo-forms-store';
import { isMongoDuplicateKeyError } from '@/lib/mongo-media';
import {
  mongoCreateUniquePostSlug,
  mongoPostDelete,
  mongoPostFindBySourceId,
  mongoPostIdInAdminPathSegment,
  mongoPostInsertFromDraft,
  mongoPostSetEmailNotifiedAt,
  mongoPostUpdateFromDraft,
  mongoPostUpdateStatus,
} from '@/lib/mongo-posts-store';

type PostEditorState = {
  error: string | null;
};

export type NotifySubscribersState = {
  error: string | null;
  ok?: boolean;
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
    const slug = await mongoCreateUniquePostSlug(draft.slug, postId);
    const existingPost = postId
      ? await mongoPostFindBySourceId(postId)
      : null;

    if (postId && !existingPost) {
      return { error: 'That post could not be found.' };
    }

    if (postId) {
      await mongoPostUpdateFromDraft({
        sourcePostId: postId,
        draft: { ...draft, authorId },
        slug,
      });
    } else {
      const newId = randomUUID();
      await mongoPostInsertFromDraft({
        draft: { ...draft, authorId },
        slug,
        sourcePostId: newId,
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
  const post = await mongoPostFindBySourceId(postId);

  if (!post) {
    redirect(
      createAdminRedirectUrl(POST_INDEX_PATH, {
        error: 'That post could not be found.',
      })
    );
  }

  await mongoPostDelete(postId);
  revalidatePostSurfaces(post.slug);

  redirect(
    createAdminRedirectUrl(POST_INDEX_PATH, {
      notice: 'Post deleted successfully.',
    })
  );
}

export async function notifyNewsletterSubscribersAction(
  _previousState: NotifySubscribersState,
  formData: FormData
): Promise<NotifySubscribersState> {
  const currentUser = await requireAuth();

  if (!checkPermission(currentUser.role, 'EDITOR')) {
    return { error: 'You do not have permission to email subscribers.' };
  }

  const postId = readOptionalString(formData, 'postId');
  if (!postId) {
    return { error: 'Post is required.' };
  }

  const post = await mongoPostFindBySourceId(postId);

  if (!post) {
    return { error: 'That post could not be found.' };
  }

  if (post.status !== 'PUBLISHED') {
    return { error: 'Only published posts can be emailed to subscribers.' };
  }

  if (post.emailNotifiedAt) {
    return {
      error:
        'This post was already emailed to subscribers. Contact an admin if you need to resend.',
    };
  }

  if (!isEmailSendingConfigured()) {
    return {
      error:
        'Email is not configured (set SMTP_* for Microsoft 365, or Resend/SendGrid — see .env.example).',
    };
  }

  const base = getSiteBaseUrl();
  if (!base) {
    return {
      error:
        'Site URL is not configured. Set NEXT_PUBLIC_SITE_URL or NEXTAUTH_URL.',
    };
  }

  const postUrl = `${base}/blog/${post.slug}`;

  const emails = await mongoNewsletterSubscriberEmails();

  if (emails.length === 0) {
    return {
      error:
        'No newsletter subscribers found. Subscriptions appear when visitors use the newsletter form.',
    };
  }

  const subject = `New on YTOP: ${post.title}`;
  const html = `
    <p>Hello,</p>
    <p>We published a new story you might enjoy:</p>
    <p><strong>${escapeHtml(post.title)}</strong></p>
    <p><a href="${postUrl}">Read the post</a></p>
    <p style="margin-top:24px;font-size:12px;color:#666;">You received this because you subscribed to YTOP Global updates.</p>
  `;

  try {
    await sendBulkNewsletterEmail({
      recipients: emails,
      subject,
      html,
    });
  } catch (e) {
    return {
      error:
        e instanceof Error ? e.message : 'Failed to send newsletter emails.',
    };
  }

  await mongoPostSetEmailNotifiedAt(postId, new Date());

  revalidatePostSurfaces(post.slug);
  revalidatePath(
    `/admin/posts/${mongoPostIdInAdminPathSegment(postId)}/edit`
  );

  return { error: null, ok: true };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

  const currentPost = await mongoPostFindBySourceId(postId);

  if (!currentPost) {
    redirect(
      createAdminRedirectUrl(POST_INDEX_PATH, {
        error: 'That post could not be found.',
      })
    );
  }

  await mongoPostUpdateStatus({
    sourcePostId: postId,
    status: nextStatus,
    publishedAt:
      nextStatus === 'PUBLISHED'
        ? currentPost.publishedAt || new Date()
        : nextStatus === 'DRAFT'
          ? null
          : currentPost.publishedAt,
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
  if (isMongoDuplicateKeyError(error)) {
    return 'A post with that slug already exists.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong while saving this post.';
}
