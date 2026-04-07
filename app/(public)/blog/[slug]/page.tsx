import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Prisma } from '@/app/generated/prisma';
import BlogPostArticle from '@/components/blog/BlogPostArticle';
import { getPrisma, resetPrismaConnection } from '@/lib/db';
import {
  loadMongoBlogPostWithRelations,
  mongoFindPostBySlug,
  mongoListAllPublishedSlugs,
  useMongoForPublicBlog,
} from '@/lib/mongo-blog';

export async function generateStaticParams() {
  try {
    if (useMongoForPublicBlog()) {
      const slugs = await mongoListAllPublishedSlugs();
      return slugs.map((slug) => ({ slug }));
    }
    const posts = await getPrisma().post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    });
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    if (useMongoForPublicBlog()) {
      const doc = await mongoFindPostBySlug(slug);
      if (!doc) return {};
      return {
        title: doc.metaTitle || doc.title,
        description:
          doc.metaDescription ||
          doc.excerpt?.replace(/<[^>]*>/g, '').substring(0, 160),
        openGraph: {
          title: doc.metaTitle || doc.title,
          description:
            doc.metaDescription ||
            doc.excerpt?.replace(/<[^>]*>/g, '').substring(0, 160),
          images: doc.featuredImage ? [doc.featuredImage.url] : [],
        },
      };
    }
    const post = await getPrisma().post.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: {
        title: true,
        excerpt: true,
        metaTitle: true,
        metaDescription: true,
        featuredImage: {
          select: { url: true },
        },
      },
    });

    if (!post) return {};

    return {
      title: post.metaTitle || post.title,
      description:
        post.metaDescription ||
        post.excerpt?.replace(/<[^>]*>/g, '').substring(0, 160),
      openGraph: {
        title: post.metaTitle || post.title,
        description:
          post.metaDescription ||
          post.excerpt?.replace(/<[^>]*>/g, '').substring(0, 160),
        images: post.featuredImage ? [post.featuredImage.url] : [],
      },
    };
  } catch {
    return {};
  }
}

function isConnectionError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /connection|terminated|timeout|ECONNRESET|ECONNREFUSED|P1001|P1017/i.test(
    msg
  );
}

const postInclude = {
  author: { select: { name: true, email: true, image: true, bio: true } },
  categories: { select: { id: true, name: true, slug: true } },
  tags: { select: { name: true, slug: true } },
  featuredImage: { select: { url: true, altText: true, caption: true } },
  comments: {
    where: {
      isApproved: true,
      parentId: null,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      replies: {
        where: {
          isApproved: true,
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  },
} as const;

const relatedPostsInclude = {
  featuredImage: { select: { url: true, altText: true } },
  categories: { select: { name: true, slug: true } },
} as const;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (useMongoForPublicBlog()) {
    const data = await loadMongoBlogPostWithRelations(slug);
    if (!data) notFound();
    return <BlogPostArticle post={data.post} relatedPosts={data.relatedPosts} />;
  }

  const loadPost = () =>
    getPrisma().post.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: postInclude,
    });
  const loadRelatedPosts = (where: Prisma.PostWhereInput) =>
    getPrisma().post.findMany({
      where,
      include: relatedPostsInclude,
      take: 3,
      orderBy: { publishedAt: 'desc' },
    });

  let post: NonNullable<Awaited<ReturnType<typeof loadPost>>> | null = null;
  let relatedPosts: Awaited<ReturnType<typeof loadRelatedPosts>> = [];

  try {
    post = await loadPost();
    if (!post) {
      notFound();
    }
    getPrisma()
      .post.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {});

    const categoryIds = post.categories
      .map((c) => c.id)
      .filter((id): id is string => id != null);
    const relatedWhere = {
      id: { not: post.id },
      status: 'PUBLISHED' as const,
      ...(categoryIds.length > 0
        ? { categories: { some: { id: { in: categoryIds } } } }
        : {}),
    };
    relatedPosts = await loadRelatedPosts(relatedWhere);
  } catch (err) {
    if (isConnectionError(err)) {
      resetPrismaConnection();
      try {
        post = await loadPost();
        if (!post) notFound();
        getPrisma()
          .post.update({
            where: { id: post.id },
            data: { viewCount: { increment: 1 } },
          })
          .catch(() => {});
        const retryCategoryIds = post.categories
          .map((c) => c.id)
          .filter((id): id is string => id != null);
        const retryRelatedWhere = {
          id: { not: post.id },
          status: 'PUBLISHED' as const,
          ...(retryCategoryIds.length > 0
            ? { categories: { some: { id: { in: retryCategoryIds } } } }
            : {}),
        };
        relatedPosts = await loadRelatedPosts(retryRelatedWhere);
      } catch (retryErr) {
        console.error('Blog post page error (after retry):', retryErr);
        return (
          <div className="min-h-[50vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Unable to load this post
              </h1>
              <p className="text-slate-600 mb-4">
                The connection to the database was lost or timed out. This can
                happen after the app has been idle, or if no database is set up
                yet.
              </p>
              <p className="text-slate-500 text-sm mb-6">
                To fix: ensure PostgreSQL is running and{' '}
                <code className="bg-slate-100 px-1 rounded">DATABASE_URL</code>{' '}
                in <code className="bg-slate-100 px-1 rounded">.env</code> is
                correct. See the README for local or free cloud (Neon/Supabase)
                setup.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-ytop-blue text-white font-semibold rounded-xl hover:bg-ytop-blue-hover"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Blog
              </Link>
              <p className="mt-4 text-sm text-slate-500">
                Try refreshing the page once the database is available.
              </p>
            </div>
          </div>
        );
      }
    } else {
      console.error('Blog post page error:', err);
      return (
        <div className="min-h-[50vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Unable to load this post
            </h1>
            <p className="text-slate-600 mb-4">
              The connection to the database was lost or timed out. This can
              happen after the app has been idle, or if no database is set up
              yet.
            </p>
            <p className="text-slate-500 text-sm mb-6">
              To fix: ensure PostgreSQL is running and{' '}
              <code className="bg-slate-100 px-1 rounded">DATABASE_URL</code>{' '}
              in <code className="bg-slate-100 px-1 rounded">.env</code> is
              correct. See the README for local or free cloud (Neon/Supabase)
              setup.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ytop-blue text-white font-semibold rounded-xl hover:bg-ytop-blue-hover"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Blog
            </Link>
            <p className="mt-4 text-sm text-slate-500">
              Try refreshing the page once the database is available.
            </p>
          </div>
        </div>
      );
    }
  }

  if (!post) notFound();

  return (
    <BlogPostArticle
      post={{
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        publishedAt: post.publishedAt,
        viewCount: post.viewCount,
        author: post.author,
        categories: post.categories,
        tags: post.tags,
        featuredImage: post.featuredImage,
        comments: post.comments,
      }}
      relatedPosts={relatedPosts}
    />
  );
}
