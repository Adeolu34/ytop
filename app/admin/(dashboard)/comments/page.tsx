import Link from 'next/link';
import { CheckCircle2, Clock3, ExternalLink, ShieldAlert, Trash2 } from 'lucide-react';
import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import { requireAdmin } from '@/lib/auth-utils';
import {
  getSearchParamValue,
  readAdminFlashMessage,
  type SearchParamRecord,
} from '@/lib/admin-feedback';
import { approveCommentAction, deleteCommentAction } from '@/app/admin/(dashboard)/comments/actions';
import { getMongoDb, isMongoConfigured } from '@/lib/mongodb';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

type AdminComment = {
  id: string;
  content: string;
  authorName?: string | null;
  authorEmail?: string | null;
  authorId?: string | null;
  isApproved?: boolean;
  parentId?: string | null;
  createdAt?: Date | string;
  author?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
  post?: {
    title?: string | null;
    slug?: string | null;
  } | null;
};

function getCommentAuthorLabel(comment: {
  authorName: string | null;
  author: { name: string | null } | null;
}): string {
  return comment.author?.name || comment.authorName || 'Guest commenter';
}

function getCommentEmail(comment: {
  authorEmail: string | null;
  author: { email: string | null } | null;
}): string | null {
  return comment.author?.email || comment.authorEmail || null;
}

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  await requireAdmin();

  const resolvedSearchParams = await searchParams;
  const flashMessage = readAdminFlashMessage(resolvedSearchParams);
  const searchQuery = getSearchParamValue(resolvedSearchParams.q)?.trim() || '';
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const asDate = (value: unknown): Date => {
    if (value instanceof Date) return value;
    const parsed = new Date(String(value ?? ''));
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
  };

  let pendingComments: AdminComment[] = [];
  let totalPending = 0;
  let guestPending = 0;
  let pendingThisWeek = 0;
  let loadError: string | null = null;

  if (!isMongoConfigured()) {
    loadError =
      'MongoDB is not configured for this deployment. Set MONGODB_URI (and MONGODB_DB if needed) in Netlify environment variables, then redeploy.';
  } else {
    try {
      const db = await getMongoDb();
      const commentsCollection = db.collection<AdminComment>('comments');
      const where: Record<string, unknown> = { isApproved: false };

      if (searchQuery) {
        const safe = escapeRegex(searchQuery);
        where.$or = [
          { content: { $regex: safe, $options: 'i' } },
          { authorName: { $regex: safe, $options: 'i' } },
          { authorEmail: { $regex: safe, $options: 'i' } },
          { 'author.name': { $regex: safe, $options: 'i' } },
          { 'author.email': { $regex: safe, $options: 'i' } },
          { 'post.title': { $regex: safe, $options: 'i' } },
        ];
      }

      const results = await Promise.all([
        commentsCollection.find(where).sort({ createdAt: -1 }).limit(50).toArray(),
        commentsCollection.countDocuments({ isApproved: false }),
        commentsCollection.countDocuments({ isApproved: false, authorId: null }),
        commentsCollection.countDocuments({
          isApproved: false,
          createdAt: { $gte: sevenDaysAgo },
        }),
      ]);
      pendingComments = results[0];
      totalPending = results[1];
      guestPending = results[2];
      pendingThisWeek = results[3];
    } catch (e) {
      loadError =
        e instanceof Error ? e.message : 'Could not load comments from MongoDB.';
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
            Trust & Moderation
          </span>
          <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
            Comment Moderation
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
            Review held comments, approve thoughtful submissions, and keep spam
            and abusive language away from the public conversation.
          </p>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-md bg-[#efeded] px-5 py-3 text-sm font-semibold text-[#1b1c1c] transition-colors hover:bg-[#e4e2e2]"
        >
          Back to Dashboard
        </Link>
      </section>

      {flashMessage ? (
        <AdminFlashBanner
          type={flashMessage.type}
          message={flashMessage.message}
        />
      ) : null}

      {loadError ? (
        <AdminFlashBanner type="error" message={loadError} />
      ) : null}

      <section className="grid gap-6 md:grid-cols-3">
        <div className="admin-surface-card rounded-xl p-8">
          <p className="admin-font-display text-5xl font-extrabold leading-none tracking-tighter text-[#1b1c1c]">
            {totalPending.toLocaleString()}
          </p>
          <p className="mt-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
            Pending Review
          </p>
        </div>

        <div className="admin-surface-card rounded-xl p-8">
          <p className="admin-font-display text-5xl font-extrabold leading-none tracking-tighter text-[#ba0013]">
            {guestPending.toLocaleString()}
          </p>
          <p className="mt-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
            Guest Comments
          </p>
        </div>

        <div className="admin-surface-card rounded-xl p-8">
          <p className="admin-font-display text-5xl font-extrabold leading-none tracking-tighter text-[#1b1c1c]">
            {pendingThisWeek.toLocaleString()}
          </p>
          <p className="mt-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
            Added This Week
          </p>
        </div>
      </section>

      <section className="admin-surface-card rounded-xl p-6">
        <form method="get" className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <input
            type="search"
            name="q"
            defaultValue={searchQuery}
            className="rounded-lg border border-[#e7bdb8]/30 bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
            placeholder="Search comment text, author, email, or post"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-br from-[#ba0013] to-[#e31e24] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#ba0013]/20 transition-transform hover:scale-[1.01]"
          >
            Filter Queue
          </button>
        </form>
      </section>

      <section className="space-y-5">
        {pendingComments.length > 0 ? (
          pendingComments.map((comment) => {
            const authorLabel = getCommentAuthorLabel(comment);
            const authorEmail = getCommentEmail(comment);

            return (
              <article
                key={comment.id}
                className="admin-surface-card rounded-xl p-6"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-[#ffdad6] px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[#93000d]">
                        Pending Review
                      </span>
                      <span className="inline-flex rounded-full bg-[#efeded] px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[#5d3f3c]">
                        {comment.parentId ? 'Reply' : 'Top-level'}
                      </span>
                      <span className="inline-flex rounded-full bg-white px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[#5d3f3c]">
                        {comment.author ? comment.author.role : 'Guest'}
                      </span>
                    </div>

                    <div className="mt-4">
                      <h2 className="text-lg font-bold text-[#1b1c1c]">
                        {authorLabel}
                      </h2>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#5d3f3c]">
                        <span className="inline-flex items-center gap-2">
                          <Clock3 className="h-4 w-4" />
                          {asDate(comment.createdAt).toLocaleString()}
                        </span>
                        {authorEmail ? (
                          <a
                            href={`mailto:${authorEmail}`}
                            className="font-medium text-[#ba0013] hover:text-[#93000d]"
                          >
                            {authorEmail}
                          </a>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-[#fbf9f8] p-5">
                      <p className="whitespace-pre-wrap text-sm leading-7 text-[#1b1c1c]">
                        {comment.content}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#5d3f3c]">
                      <ShieldAlert className="h-4 w-4 text-[#ba0013]" />
                      <span className="font-semibold text-[#1b1c1c]">
                        On post:
                      </span>
                      <span>{comment.post?.title || 'Unknown post'}</span>
                      {comment.post?.slug ? (
                        <Link
                          href={`/blog/${comment.post.slug}#comments`}
                          target="_blank"
                          className="inline-flex items-center gap-2 font-semibold text-[#ba0013] hover:text-[#93000d]"
                        >
                          View public page
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 xl:w-56">
                    <form action={approveCommentAction}>
                      <input type="hidden" name="commentId" value={comment.id} />
                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-br from-[#ba0013] to-[#e31e24] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#ba0013]/20 transition-transform hover:scale-[1.01]"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve Comment
                      </button>
                    </form>

                    <form action={deleteCommentAction}>
                      <input type="hidden" name="commentId" value={comment.id} />
                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#fff1ef] px-5 py-3 text-sm font-bold text-[#93000d] transition-colors hover:bg-[#ffdad6]"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Comment
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="admin-surface-card rounded-xl px-6 py-12 text-center">
            <p className="admin-font-display text-2xl font-bold text-[#1b1c1c]">
              The moderation queue is clear
            </p>
            <p className="mt-3 text-sm text-[#5d3f3c]">
              No held comments match the current filters right now.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
