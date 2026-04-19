'use client';

import { startTransition, useActionState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send, ShieldCheck, Sparkles } from 'lucide-react';
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
  return author?.name || authorName || 'Community member';
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
    <section
      id="comments"
      className="relative mt-20 scroll-mt-24 rounded-[2rem] border border-slate-200/60 bg-gradient-to-b from-slate-50/90 via-white to-white p-6 shadow-inner shadow-slate-200/40 dark:border-slate-700/60 dark:from-slate-900/50 dark:via-slate-900/30 dark:to-slate-900 sm:p-10"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#ba0013]/10 to-[#1E3A8A]/10 blur-3xl dark:from-red-500/10 dark:to-blue-500/10" />

      <div className="relative mx-auto max-w-4xl">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <div className="inline-flex items-center justify-center gap-2 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ba0013]/15 to-[#1E3A8A]/15 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#ba0013] dark:from-red-500/25 dark:to-blue-500/25 dark:text-red-300">
              <MessageCircle className="h-3.5 w-3.5" />
              Discussion
            </span>
          </div>
          <h2 className="font-display text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
            Join the conversation
          </h2>
          <p className="mx-auto max-w-xl text-slate-600 dark:text-slate-400 sm:mx-0">
            {commentCount} voice{commentCount === 1 ? '' : 's'} in this thread.
            Share respectfully — helpful comments go live right away.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:gap-14">
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => {
                const name = getDisplayName(comment.authorName, comment.author);
                return (
                  <article
                    key={comment.id}
                    className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-200/30 backdrop-blur-sm dark:border-slate-600/60 dark:bg-slate-900/80 dark:shadow-black/20"
                  >
                    <div className="flex gap-4">
                      <div className="relative shrink-0">
                        {comment.author?.image ? (
                          <Image
                            src={comment.author.image}
                            alt={`${name} avatar`}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-800"
                            unoptimized
                          />
                        ) : (
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#ba0013] text-sm font-bold text-white shadow-md"
                            aria-hidden
                          >
                            {getInitials(name)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white">
                            {name}
                          </h3>
                          <time
                            className="text-xs font-medium text-slate-500 dark:text-slate-400"
                            dateTime={comment.createdAt}
                          >
                            {new Date(comment.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </time>
                        </div>
                        <p className="mt-3 whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
                          {comment.content}
                        </p>
                      </div>
                    </div>

                    {comment.replies.length > 0 ? (
                      <ul className="mt-6 ml-1 space-y-4 border-l-2 border-primary/30 pl-5 dark:border-primary/45">
                        {comment.replies.map((reply) => {
                          const rName = getDisplayName(
                            reply.authorName,
                            reply.author
                          );
                          return (
                            <li
                              key={reply.id}
                              className="relative rounded-xl bg-slate-50/90 p-4 dark:bg-slate-800/50"
                            >
                              <div className="flex gap-3">
                                <div
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                                  aria-hidden
                                >
                                  {getInitials(rName)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                      {rName}
                                    </p>
                                    <time className="text-xs text-slate-500">
                                      {new Date(
                                        reply.createdAt
                                      ).toLocaleDateString()}
                                    </time>
                                  </div>
                                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-8 py-14 text-center dark:border-slate-700 dark:bg-slate-900/40">
                <Sparkles className="mx-auto h-10 w-10 text-amber-400" />
                <p className="mt-4 font-medium text-slate-700 dark:text-slate-300">
                  No comments yet — start the thread.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Your voice matters. Drop a note below.
                </p>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50/50 to-white p-1 shadow-2xl shadow-slate-300/40 ring-1 ring-slate-200/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 dark:shadow-black/40 dark:ring-slate-600/80">
              <div className="rounded-[1.4rem] bg-white/95 p-6 dark:bg-slate-900/95 sm:p-8">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ba0013] to-[#e31e24] text-white shadow-lg shadow-[#ba0013]/30">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#ba0013] dark:text-red-400">
                      Add your voice
                    </p>
                    <h3 className="font-display mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                      Share a thoughtful response
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Constructive comments publish immediately. Spam or abuse is
                  filtered before anything goes live.
                </p>

                {state.message ? (
                  <div
                    className={`mt-5 rounded-2xl px-4 py-3 text-sm font-medium ${
                      state.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:ring-emerald-800'
                        : state.status === 'review'
                          ? 'bg-amber-50 text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-800'
                          : 'bg-red-50 text-red-800 ring-1 ring-red-200 dark:bg-red-950/50 dark:text-red-200'
                    }`}
                  >
                    {state.message}
                  </div>
                ) : null}

                <form
                  ref={formRef}
                  action={formAction}
                  className="mt-6 space-y-5"
                >
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
                      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Name
                      </span>
                      <input
                        name="name"
                        required
                        maxLength={80}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-[#ba0013]/50 focus:bg-white focus:ring-4 focus:ring-[#ba0013]/10 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white dark:focus:ring-[#ba0013]/20"
                        placeholder="Your name"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Email
                      </span>
                      <input
                        type="email"
                        name="email"
                        required
                        maxLength={160}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#ba0013]/50 focus:bg-white focus:ring-4 focus:ring-[#ba0013]/10 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white dark:focus:ring-[#ba0013]/20"
                        placeholder="you@example.com"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Your message
                    </span>
                    <textarea
                      name="content"
                      required
                      minLength={12}
                      maxLength={2000}
                      rows={6}
                      className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm leading-relaxed text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#ba0013]/50 focus:bg-white focus:ring-4 focus:ring-[#ba0013]/10 dark:border-slate-600 dark:bg-slate-800/80 dark:text-white dark:focus:ring-[#ba0013]/20"
                      placeholder="Share a respectful, constructive thought…"
                    />
                  </label>

                  <div className="flex flex-col gap-4 border-t border-slate-100 pt-2 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      We filter spam and harmful language automatically.
                    </p>
                    <AdminSubmitButton
                      idleLabel="Post comment"
                      pendingLabel="Sending…"
                      className="w-full shrink-0 rounded-2xl px-8 py-3.5 shadow-xl shadow-[#ba0013]/25 sm:w-auto"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
