import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { getPrisma, resetPrismaConnection } from '@/lib/db';

const DEFAULT_FEATURED_IMAGE = '/media/2021/10/IMG_9658-scaled.jpg';

export async function generateStaticParams() {
  try {
    const posts = await getPrisma().post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    });
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
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
      description: post.metaDescription || post.excerpt?.replace(/<[^>]*>/g, '').substring(0, 160),
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt?.replace(/<[^>]*>/g, '').substring(0, 160),
        images: post.featuredImage ? [post.featuredImage.url] : [],
      },
    };
  } catch {
    return {};
  }
}

function isConnectionError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /connection|terminated|timeout|ECONNRESET|ECONNREFUSED|P1001|P1017/i.test(msg);
}

const postInclude = {
  author: { select: { name: true, email: true, image: true, bio: true } },
  categories: { select: { id: true, name: true, slug: true } },
  tags: { select: { name: true, slug: true } },
  featuredImage: { select: { url: true, altText: true, caption: true } },
} as const;

const relatedPostsInclude = {
  featuredImage: { select: { url: true, altText: true } },
  categories: { select: { name: true, slug: true } },
} as const;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loadPost = () =>
    getPrisma().post.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: postInclude,
    });
  const loadRelatedPosts = (where: Parameters<ReturnType<typeof getPrisma>['post']['findMany']>[0]['where']) =>
    getPrisma().post.findMany({
      where,
      include: relatedPostsInclude,
      take: 3,
      orderBy: { publishedAt: 'desc' },
    });
  type PostWithRelations = NonNullable<Awaited<ReturnType<typeof loadPost>>>;
  type RelatedPost = Awaited<ReturnType<typeof loadRelatedPosts>>[number];
  let post: PostWithRelations | null = null;
  let relatedPosts: RelatedPost[] = [];

  try {
    post = await loadPost();
    if (!post) {
      notFound();
    }
    getPrisma().post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

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
        getPrisma().post.update({
          where: { id: post.id },
          data: { viewCount: { increment: 1 } },
        }).catch(() => {});
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
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Unable to load this post</h1>
              <p className="text-slate-600 mb-4">
                The connection to the database was lost or timed out. This can happen after the app has been idle, or if no database is set up yet.
              </p>
              <p className="text-slate-500 text-sm mb-6">
                To fix: ensure PostgreSQL is running and <code className="bg-slate-100 px-1 rounded">DATABASE_URL</code> in <code className="bg-slate-100 px-1 rounded">.env</code> is correct. See the README for local or free cloud (Neon/Supabase) setup.
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
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Unable to load this post</h1>
            <p className="text-slate-600 mb-4">
              The connection to the database was lost or timed out. This can happen after the app has been idle, or if no database is set up yet.
            </p>
            <p className="text-slate-500 text-sm mb-6">
              To fix: ensure PostgreSQL is running and <code className="bg-slate-100 px-1 rounded">DATABASE_URL</code> in <code className="bg-slate-100 px-1 rounded">.env</code> is correct. See the README for local or free cloud (Neon/Supabase) setup.
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

  return (
    <div className="py-12">
      {/* Back Button */}
      <div className="container mx-auto px-4 mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog?category=${category.slug}`}
                className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-200 transition"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
          {post.author && (
            <div className="flex items-center gap-3">
              {post.author.image && (
                <Image
                  src={post.author.image}
                  alt={post.author.name || 'Author'}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div>
                <div className="font-medium text-gray-900">{post.author.name}</div>
                <div className="text-sm">{post.author.email}</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <time>
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Draft'}
            </time>
          </div>

          <div className="flex items-center gap-2">
            <span>{post.viewCount} views</span>
          </div>
        </div>

        {/* Featured Image – use post image or default */}
        <div className="mb-12">
          <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage?.url || DEFAULT_FEATURED_IMAGE}
              alt={post.featuredImage?.altText || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
              unoptimized
            />
          </div>
          {post.featuredImage?.caption && (
            <p className="text-center text-sm text-gray-600 mt-2">
              {post.featuredImage.caption}
            </p>
          )}
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b">
            <Tag className="w-5 h-5 text-gray-400" />
            {post.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/blog?tag=${tag.slug}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Author Bio */}
        {post.author?.bio && (
          <div className="mb-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-2">About the Author</h3>
            <p className="text-gray-700">{post.author.bio}</p>
          </div>
        )}
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="container mx-auto px-4 mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {relatedPosts.map((relatedPost) => (
              <article
                key={relatedPost.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition group"
              >
                <Link href={`/blog/${relatedPost.slug}`}>
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <Image
                      src={relatedPost.featuredImage?.url || DEFAULT_FEATURED_IMAGE}
                      alt={relatedPost.featuredImage?.altText || relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized
                    />
                  </div>
                </Link>
                <div className="p-6">
                  {relatedPost.categories.length > 0 && (
                    <div className="text-xs font-medium text-blue-600 mb-2">
                      {relatedPost.categories[0].name}
                    </div>
                  )}
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
