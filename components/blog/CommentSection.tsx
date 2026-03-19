'use client';

import { startTransition, useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminSubmitButton from '@/components/admin/forms/AdminSubmitButton';
import { submitCommentAction } from '@/app/(public)/blog/[slug]/comment-actions';

const INITIAL_COMMENT_FORM_STATE = {
  status: 'idle' as const,
  message: null,
};

type CommentAuthor = {
  name: string | null;
  image: string | null;
};

type CommentReply = {
  id: string;
  content: string;
  authorName: string | null;
  createdAt: string;
  author: CommentAuthor | null;
};

type CommentThread = {
  id: string;
  content: string;
  authorName: string | null;
  createdAt: string;
  author: CommentAuthor | null;
  replies: CommentReply[];
};

type CommentSectionProps = {
  postId: string;
  postSlug: string;
  comments: CommentThread[];
};

function getDisplayName(
  authorName: string | null,
  author: CommentAuthor | null
): string {
  return author?.name || authorName || 'Community Member';
}

function getCommentCount(comments: CommentThread[]): number {
  return comments.reduce(
    (total, comment) => total + 1 + comment.replies.length,
    0
  );
}

export default function CommentSection({
  postId,
  postSlug,
  comments,
}: CommentSectionProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [state, formAction] = useActionState(
    submitCommentAction,
    INITIAL_COMMENT_FORM_STATE
  );

  useEffect(() => {
    if (state.status === 'approved') {
      formRef.current?.reset();
      startTransition(() => {
        router.refresh();
      });
    }

    if (state.status === 'review') {
      formRef.current?.reset();
    }
  }, [router, state.status]);

  const commentCount = getCommentCount(comments);

  return (
    <section id="comments" className="mt-16 border-t border-slate-200 pt-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Community Voices
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Comment Section
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            {commentCount} approved comment{commentCount === 1 ? '' : 's'}
          </p>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <article
                  key={comment.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {getDisplayName(comment.authorName, comment.author)}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {comment.content}
                  </p>

                  {comment.replies.length > 0 ? (
                    <div className="mt-5 space-y-4 border-l border-slate-200 pl-5">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-900">
                              {getDisplayName(reply.authorName, reply.author)}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-sm text-slate-600">
                No comments have been approved yet. Be the first to join the conversation.
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Add Your Voice
            </p>
            <h3 className="mt-3 text-2xl font-bold text-slate-900">
              Share a thoughtful response
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Clean comments publish immediately. Suspicious ones are held for review.
            </p>

            {state.message ? (
              <div
                className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                  state.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-800'
                    : state.status === 'review'
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-red-50 text-red-700'
                }`}
              >
                {state.message}
              </div>
            ) : null}

            <form ref={formRef} action={formAction} className="mt-6 space-y-4">
              <input type="hidden" name="postId" value={postId} />
              <input type="hidden" name="postSlug" value={postSlug} />
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Name
                  </span>
                  <input
                    name="name"
                    required
                    maxLength={80}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    maxLength={160}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Comment
                </span>
                <textarea
                  name="content"
                  required
                  minLength={12}
                  maxLength={2000}
                  rows={7}
                  className="w-full rounded-[24px] border border-slate-200 px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition-colors focus:border-blue-500"
                  placeholder="Share a respectful, constructive response."
                />
              </label>

              <div className="flex items-center justify-between gap-4">
                <p className="text-xs leading-5 text-slate-500">
                  We automatically filter spam and abusive language before comments go live.
                </p>
                <AdminSubmitButton
                  idleLabel="Post Comment"
                  pendingLabel="Submitting..."
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
