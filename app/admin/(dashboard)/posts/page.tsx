import Link from 'next/link';
import { Eye, Filter, Plus } from 'lucide-react';
import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import {
  getSearchParamValue,
  readAdminFlashMessage,
  type SearchParamRecord,
} from '@/lib/admin-feedback';
import {
  deletePostAction,
  updatePostStatusAction,
} from '@/app/admin/(dashboard)/posts/actions';
import { getMongoDb } from '@/lib/mongodb';

type AdminPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED';
  viewCount?: number;
  author?: {
    name?: string | null;
  } | null;
  categories?: Array<{ name?: string } | string>;
  createdAt?: Date | string;
  publishedAt?: Date | string | null;
};

function buildFilterHref(status: string, searchQuery: string): string {
  const searchParams = new URLSearchParams();

  if (status !== 'ALL') {
    searchParams.set('status', status);
  }

  if (searchQuery) {
    searchParams.set('q', searchQuery);
  }

  const queryString = searchParams.toString();
  return queryString ? `/admin/posts?${queryString}` : '/admin/posts';
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  const resolvedSearchParams = await searchParams;
  const flashMessage = readAdminFlashMessage(resolvedSearchParams);
  const searchQuery = getSearchParamValue(resolvedSearchParams.q)?.trim() || '';
  const statusFilter =
    getSearchParamValue(resolvedSearchParams.status)?.toUpperCase() || 'ALL';
  const asDate = (value: unknown): Date => {
    if (value instanceof Date) return value;
    const parsed = new Date(String(value ?? ''));
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
  };

  const db = await getMongoDb();
  const postsCollection = db.collection<AdminPost>('blog_posts');
  const where: Record<string, unknown> = {};
  if (statusFilter !== 'ALL') where.status = statusFilter;
  if (searchQuery) {
    where.$or = [
      { title: { $regex: searchQuery, $options: 'i' } },
      { slug: { $regex: searchQuery, $options: 'i' } },
      { excerpt: { $regex: searchQuery, $options: 'i' } },
      { content: { $regex: searchQuery, $options: 'i' } },
    ];
  }

  const [posts, postCount, publishedCount, draftCount, engagement] =
    await Promise.all([
      postsCollection
        .find(where)
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(20)
        .toArray(),
      postsCollection.countDocuments(),
      postsCollection.countDocuments({ status: 'PUBLISHED' }),
      postsCollection.countDocuments({ status: 'DRAFT' }),
      postsCollection
        .aggregate<{ totalViews: number }>([
          { $group: { _id: null, totalViews: { $sum: { $ifNull: ['$viewCount', 0] } } } },
        ])
        .toArray(),
    ]);

  const statusFilters = ['ALL', 'PUBLISHED', 'DRAFT', 'SCHEDULED'];

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
            Content Management
          </span>
          <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
            Post Management
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
            Review content performance, edit the editorial queue, and keep the
            publishing pipeline moving.
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-[#ba0013] to-[#e31e24] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#ba0013]/20 transition-transform hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </section>

      {flashMessage ? (
        <AdminFlashBanner
          type={flashMessage.type}
          message={flashMessage.message}
        />
      ) : null}

      <section className="grid gap-6 md:grid-cols-4">
        <div className="admin-surface-card relative overflow-hidden rounded-xl p-8 md:col-span-2">
          <div className="relative z-10">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
              Total Engagement
            </p>
            <p className="admin-font-display mt-4 text-5xl font-extrabold tracking-tight text-[#1b1c1c]">
              {(engagement[0]?.totalViews || 0).toLocaleString()}
            </p>
            <p className="mt-3 text-sm font-semibold text-[#ba0013]">
              Aggregated public post views across the blog
            </p>
          </div>
          <div className="absolute bottom-0 right-0 opacity-10">
            <Eye className="h-28 w-28 text-[#ba0013]" />
          </div>
        </div>

        <div className="admin-surface-card rounded-xl p-8">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
            Published
          </p>
          <p className="admin-font-display mt-4 text-4xl font-extrabold tracking-tight text-[#1b1c1c]">
            {publishedCount.toLocaleString()}
          </p>
          <p className="mt-2 text-xs font-medium text-[#5d3f3c]">
            Stories already visible on the site
          </p>
        </div>

        <div className="admin-surface-card rounded-xl p-8">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
            Drafts
          </p>
          <p className="admin-font-display mt-4 text-4xl font-extrabold tracking-tight text-[#1b1c1c]">
            {draftCount.toLocaleString()}
          </p>
          <p className="mt-2 text-xs font-medium text-[#5d3f3c]">
            Draft items still waiting for review
          </p>
        </div>
      </section>

      <section className="admin-surface-card rounded-xl p-6">
        <form method="get" className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {statusFilter !== 'ALL' ? (
            <input type="hidden" name="status" value={statusFilter} />
          ) : null}
          <div className="flex items-center gap-2 rounded-lg border border-[#e7bdb8]/30 bg-white px-4 py-3">
            <Filter className="h-4 w-4 text-[#5d3f3c]" />
            <input
              type="search"
              name="q"
              defaultValue={searchQuery}
              className="min-w-0 flex-1 bg-transparent text-sm text-[#1b1c1c] outline-none placeholder:text-[#8b6d69]"
              placeholder="Search titles, slugs, or body copy"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <Link
                key={filter}
                href={buildFilterHref(filter, searchQuery)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  statusFilter === filter
                    ? 'bg-[#ba0013] text-white'
                    : 'border border-[#e7bdb8]/30 bg-white text-[#1b1c1c] hover:bg-[#efeded]'
                }`}
              >
                {filter === 'ALL' ? 'All Posts' : filter}
              </Link>
            ))}
          </div>

          <div className="ml-auto text-xs font-medium text-[#5d3f3c]">
            Showing {posts.length} of {postCount.toLocaleString()} posts
          </div>
        </form>
      </section>

      <section className="admin-surface-card overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-[#f5f3f3]/90">
                <th className="px-8 py-5 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#5d3f3c]">
                  Title
                </th>
                <th className="px-6 py-5 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#5d3f3c]">
                  Author
                </th>
                <th className="px-6 py-5 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#5d3f3c]">
                  Category
                </th>
                <th className="px-6 py-5 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#5d3f3c]">
                  Date
                </th>
                <th className="px-6 py-5 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#5d3f3c]">
                  Status
                </th>
                <th className="px-8 py-5 text-right text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#5d3f3c]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efeded]">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="group transition-colors hover:bg-[#f5f3f3]"
                >
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-[#1b1c1c] transition-colors group-hover:text-[#ba0013]">
                      {post.title}
                    </p>
                    <p className="mt-1 text-[0.6875rem] text-[#5d3f3c]">
                      /blog/{post.slug}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-[#1b1c1c]">
                    {post.author?.name || 'Unknown author'}
                  </td>
                  <td className="px-6 py-5">
                    <span className="rounded bg-[#efeded] px-2 py-1 text-[0.625rem] font-bold uppercase text-[#5d3f3c]">
                      {(typeof post.categories?.[0] === 'string'
                        ? post.categories?.[0]
                        : post.categories?.[0]?.name) || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-[#5d3f3c]">
                    {asDate(post.publishedAt || post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] ${
                        post.status === 'PUBLISHED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-[#ffdad6] text-[#93000d]'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="rounded-md bg-[#efeded] px-3 py-2 text-xs font-semibold text-[#1b1c1c] transition-colors hover:bg-[#e4e2e2]"
                      >
                        Edit
                      </Link>

                      <form action={updatePostStatusAction}>
                        <input type="hidden" name="postId" value={post.id} />
                        <input
                          type="hidden"
                          name="nextStatus"
                          value={
                            post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
                          }
                        />
                        <button
                          type="submit"
                          className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-[#ba0013] transition-colors hover:bg-[#ffdad6]"
                        >
                          {post.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                        </button>
                      </form>

                      {post.status === 'PUBLISHED' ? (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="rounded-md bg-[#efeded] px-3 py-2 text-xs font-semibold text-[#1b1c1c] transition-colors hover:bg-[#e4e2e2]"
                        >
                          Preview
                        </Link>
                      ) : null}

                      <form action={deletePostAction}>
                        <input type="hidden" name="postId" value={post.id} />
                        <button
                          type="submit"
                          className="rounded-md bg-[#fff1ef] px-3 py-2 text-xs font-semibold text-[#93000d] transition-colors hover:bg-[#ffdad6]"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {posts.length === 0 ? (
          <div className="px-8 py-10 text-sm text-[#5d3f3c]">
            No posts match the current filters yet.
          </div>
        ) : null}
      </section>
    </div>
  );
}
