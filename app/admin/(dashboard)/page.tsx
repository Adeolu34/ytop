import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  Globe2,
  ImageIcon,
  MessageSquareWarning,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { checkPermission, requireAuth } from '@/lib/auth-utils';
import { getSearchParamValue, type SearchParamRecord } from '@/lib/admin-feedback';
import { getMongoDb } from '@/lib/mongodb';

type DashboardPost = {
  id: string;
  title: string;
  slug?: string;
  excerpt?: string | null;
  status: 'PUBLISHED' | 'DRAFT';
  author?: {
    name?: string | null;
  } | null;
  createdAt: Date;
  publishedAt?: Date | null;
};

type DashboardUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
};

type DashboardMedia = {
  id: string;
  filename: string;
  type: string;
  createdAt: Date;
};

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  const currentUser = await requireAuth();
  const canModerateComments = checkPermission(currentUser.role, 'ADMIN');
  const resolvedSearchParams = await searchParams;
  const searchQuery = getSearchParamValue(resolvedSearchParams.q)?.trim() || '';
  const asDate = (value: unknown): Date => {
    if (value instanceof Date) return value;
    const parsed = new Date(String(value ?? ''));
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
  };
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);

  const db = await getMongoDb();
  const usersCollection = db.collection<DashboardUser>('users');
  const postsCollection = db.collection<DashboardPost>('blog_posts');
  const mediaCollection = db.collection<DashboardMedia>('media');
  const teamCollection = db.collection('team_members');
  const commentsCollection = db.collection('comments');

  const postSearchFilter = searchQuery
    ? {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { slug: { $regex: searchQuery, $options: 'i' } },
          { excerpt: { $regex: searchQuery, $options: 'i' } },
        ],
      }
    : {};

  const userSearchFilter = searchQuery
    ? {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
        ],
      }
    : {};

  const mediaSearchFilter = searchQuery
    ? {
        $or: [
          { filename: { $regex: searchQuery, $options: 'i' } },
          { originalName: { $regex: searchQuery, $options: 'i' } },
          { altText: { $regex: searchQuery, $options: 'i' } },
        ],
      }
    : {};

  const [
    userCount,
    postCount,
    mediaCount,
    teamCount,
    publishedPosts,
    draftPosts,
    pendingComments,
    newUsersThisMonth,
    newMediaThisMonth,
    recentPosts,
    recentUsers,
    recentMedia,
    weeklyPosts,
    weeklyUsers,
    weeklyMedia,
  ] = await Promise.all([
    usersCollection.countDocuments(),
    postsCollection.countDocuments(),
    mediaCollection.countDocuments(),
    teamCollection.countDocuments(),
    postsCollection.countDocuments({ status: 'PUBLISHED' }),
    postsCollection.countDocuments({ status: 'DRAFT' }),
    canModerateComments ? commentsCollection.countDocuments({ isApproved: false }) : 0,
    usersCollection.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    mediaCollection.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    postsCollection
      .find(postSearchFilter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(5)
      .toArray(),
    usersCollection
      .find(userSearchFilter)
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray(),
    mediaCollection
      .find(mediaSearchFilter)
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray(),
    postsCollection
      .find({ createdAt: { $gte: sevenDaysAgo } }, { projection: { id: 1, createdAt: 1 } })
      .toArray(),
    usersCollection
      .find({ createdAt: { $gte: sevenDaysAgo } }, { projection: { id: 1, createdAt: 1 } })
      .toArray(),
    mediaCollection
      .find({ createdAt: { $gte: sevenDaysAgo } }, { projection: { id: 1, createdAt: 1 } })
      .toArray(),
  ]);

  const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const activityDays = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(sevenDaysAgo);
    day.setDate(sevenDaysAgo.getDate() + index);
    return day;
  });

  const activitySeries = activityDays.map((day) => {
    const key = day.toDateString();
    const posts = weeklyPosts.filter(
      (item) => asDate(item.createdAt).toDateString() === key
    ).length;
    const users = weeklyUsers.filter(
      (item) => asDate(item.createdAt).toDateString() === key
    ).length;
    const media = weeklyMedia.filter(
      (item) => asDate(item.createdAt).toDateString() === key
    ).length;

    return {
      label: shortDateFormatter.format(day).toUpperCase(),
      total: posts + users + media,
      users,
      media,
    };
  });

  const maxActivity = Math.max(
    ...activitySeries.map((entry) => entry.total),
    1
  );

  const activityFeed = [
    ...recentPosts.map((post) => ({
      id: `post-${post.id}`,
      title: 'Post updated',
      description: `${post.title} by ${post.author?.name || 'Unknown author'}`,
      timestamp: asDate(post.publishedAt || post.createdAt),
    })),
    ...recentUsers.map((user) => ({
      id: `user-${user.id}`,
      title: 'User joined',
      description: `${user.name || user.email} joined as ${user.role.toLowerCase()}`,
      timestamp: asDate(user.createdAt),
    })),
    ...recentMedia.map((media) => ({
      id: `media-${media.id}`,
      title: 'Media uploaded',
      description: `${media.filename} added to the ${media.type.toLowerCase()} library`,
      timestamp: asDate(media.createdAt),
    })),
  ]
    .sort((left, right) => right.timestamp.getTime() - left.timestamp.getTime())
    .slice(0, 6);

  const overviewCards = [
    {
      label: 'Admin Accounts',
      value: userCount,
      icon: Users,
      accent: `${newUsersThisMonth} new this month`,
      note: 'People with access to manage content and assets',
    },
    {
      label: 'Published Stories',
      value: publishedPosts,
      icon: FileText,
      accent: `${draftPosts} drafts`,
      note: 'Content already live on the public website',
    },
    {
      label: 'Gallery Assets',
      value: mediaCount,
      icon: ImageIcon,
      accent: `${newMediaThisMonth} new this month`,
      note: 'Images and resources available for the site',
    },
    {
      label: 'Team Profiles',
      value: teamCount,
      icon: ShieldCheck,
      accent: `${postCount} total posts`,
      note: 'Profiles powering the public team and leadership pages',
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="mb-2 block text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-[#5d3f3c]">
            System Overview
          </span>
          <h1 className="admin-font-display text-3xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-4xl">
            YTOP Global Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
            A stitched overview of publishing activity, user growth, and media
            operations across the platform.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {canModerateComments ? (
            <Link
              href="/admin/comments"
              className="inline-flex items-center gap-2 rounded-md bg-[#e9e8e7] px-5 py-3 text-sm font-semibold text-[#1b1c1c] transition-colors hover:bg-[#e4e2e2]"
            >
              <MessageSquareWarning className="h-4 w-4 text-[#ba0013]" />
              Review Comments
              <span className="rounded-full bg-white px-2 py-1 text-[0.6875rem] font-bold text-[#ba0013]">
                {pendingComments}
              </span>
            </Link>
          ) : null}
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-[#ba0013] to-[#e31e24] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#ba0013]/20 transition-transform hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" />
            Add New Post
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="admin-surface-card group relative overflow-hidden rounded-xl p-6"
            >
              <div className="absolute right-4 top-4 opacity-10 transition-opacity group-hover:opacity-20">
                <Icon className="h-12 w-12 text-[#ba0013]" />
              </div>
              <div className="relative">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
                    {card.label}
                  </p>
                  <span className="rounded-full bg-[#ffdad6] px-2 py-1 text-[0.625rem] font-bold text-[#93000d]">
                    {card.accent}
                  </span>
                </div>
                <p className="admin-font-display text-[3rem] font-extrabold leading-none tracking-tighter text-[#1b1c1c]">
                  {card.value.toLocaleString()}
                </p>
                <p className="mt-3 text-xs font-medium text-[#5d3f3c]">
                  {card.note}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="admin-surface-card rounded-xl p-8">
          <div className="mb-10 flex items-center justify-between gap-4">
            <div>
              <h2 className="admin-font-display text-xl font-bold tracking-tight text-[#1b1c1c]">
                Weekly System Activity
              </h2>
              <p className="mt-1 text-xs text-[#5d3f3c]">
                {searchQuery
                  ? `Recent matches for "${searchQuery}" across posts, users, and media.`
                  : 'Posts, users, and media created over the last seven days.'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#5d3f3c]">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ba0013]" />
                Total activity
              </span>
            </div>
          </div>

          <div className="flex h-72 items-end justify-between gap-3">
            {activitySeries.map((entry) => (
              <div key={entry.label} className="flex h-full flex-1 flex-col items-center justify-end gap-3">
                <div className="flex h-full w-full items-end gap-1">
                  <div
                    className="w-1/3 rounded-t-sm bg-[#f5d0d4]"
                    style={{ height: `${Math.max((entry.users / maxActivity) * 100, 8)}%` }}
                  />
                  <div
                    className="w-1/3 rounded-t-sm bg-[#ffb4ab]"
                    style={{ height: `${Math.max((entry.media / maxActivity) * 100, 8)}%` }}
                  />
                  <div
                    className="w-1/3 rounded-t-sm bg-[#ba0013]"
                    style={{ height: `${Math.max((entry.total / maxActivity) * 100, 12)}%` }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#5d3f3c]">
                    {entry.label}
                  </div>
                  <div className="mt-1 text-[0.6875rem] font-semibold text-[#1b1c1c]">
                    {entry.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-[#efeded] p-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="admin-font-display text-xl font-bold tracking-tight text-[#1b1c1c]">
              Recent Activity
            </h2>
            <Link
              href="/admin/posts"
              className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#ba0013]"
            >
              View all
            </Link>
          </div>

          <div className="space-y-5">
            {activityFeed.length > 0 ? (
              activityFeed.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#ba0013] shadow-sm">
                    <Globe2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-snug text-[#1b1c1c]">
                      {item.title}{' '}
                      <span className="font-normal text-[#5d3f3c]">
                        {item.description}
                      </span>
                    </p>
                    <p className="mt-1 text-[0.6875rem] text-[#5d3f3c]">
                      {item.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#5d3f3c]">
                No recent activity has been recorded yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
        <div className="admin-surface-card overflow-hidden rounded-xl">
          <div className="flex items-center justify-between border-b border-[#e7bdb8]/25 px-8 py-6">
            <div>
              <h2 className="admin-font-display text-xl font-bold tracking-tight text-[#1b1c1c]">
                Recent Posts
              </h2>
              <p className="mt-1 text-xs text-[#5d3f3c]">
                The latest content moving through the editorial pipeline.
              </p>
            </div>
            <Link
              href="/admin/posts"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#ba0013]"
            >
              Open posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="divide-y divide-[#efeded]">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="flex flex-col gap-4 px-8 py-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#1b1c1c]">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#5d3f3c]">
                      By {post.author?.name || 'Unknown author'} ·{' '}
                      {asDate(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] ${
                      post.status === 'PUBLISHED'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-[#ffdad6] text-[#93000d]'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-8 py-10 text-sm text-[#5d3f3c]">
                No posts are available yet.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-[#efeded] p-8">
            <h2 className="admin-font-display text-xl font-bold tracking-tight text-[#1b1c1c]">
              Platform Health
            </h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3">
                <span className="text-sm font-medium text-[#1b1c1c]">Authenticated admin routes</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-emerald-700">
                  Protected
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3">
                <span className="text-sm font-medium text-[#1b1c1c]">Published posts</span>
                <span className="text-sm font-bold text-[#ba0013]">{publishedPosts}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3">
                <span className="text-sm font-medium text-[#1b1c1c]">Draft backlog</span>
                <span className="text-sm font-bold text-[#ba0013]">{draftPosts}</span>
              </div>
              {canModerateComments ? (
                <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3">
                  <span className="text-sm font-medium text-[#1b1c1c]">Pending comment queue</span>
                  <span className="text-sm font-bold text-[#ba0013]">{pendingComments}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="admin-surface-card rounded-xl p-8">
            <h2 className="admin-font-display text-xl font-bold tracking-tight text-[#1b1c1c]">
              Quick Links
            </h2>
            <div className="mt-6 grid gap-3">
              <Link
                href="/admin/users"
                className="flex items-center justify-between rounded-lg bg-[#fbf9f8] px-4 py-3 text-sm font-semibold text-[#1b1c1c] transition-colors hover:bg-[#efeded]"
              >
                User Management
                <ArrowRight className="h-4 w-4 text-[#ba0013]" />
              </Link>
              <Link
                href="/admin/posts"
                className="flex items-center justify-between rounded-lg bg-[#fbf9f8] px-4 py-3 text-sm font-semibold text-[#1b1c1c] transition-colors hover:bg-[#efeded]"
              >
                Post Management
                <ArrowRight className="h-4 w-4 text-[#ba0013]" />
              </Link>
              <Link
                href="/admin/gallery"
                className="flex items-center justify-between rounded-lg bg-[#fbf9f8] px-4 py-3 text-sm font-semibold text-[#1b1c1c] transition-colors hover:bg-[#efeded]"
              >
                Gallery Management
                <ArrowRight className="h-4 w-4 text-[#ba0013]" />
              </Link>
              {canModerateComments ? (
                <Link
                  href="/admin/comments"
                  className="flex items-center justify-between rounded-lg bg-[#fbf9f8] px-4 py-3 text-sm font-semibold text-[#1b1c1c] transition-colors hover:bg-[#efeded]"
                >
                  Comment Moderation
                  <ArrowRight className="h-4 w-4 text-[#ba0013]" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
