import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { getPrisma, resetPrismaConnection } from '@/lib/db';

// When a post has no featured image, rotate through these so cards don’t all look the same
const FALLBACK_FEATURED_IMAGES = [
  '/media/2021/10/IMG_9658-scaled.jpg',
  '/media/2021/10/IMG_9586-scaled.jpg',
  '/media/2021/10/IMG_9724-scaled.jpg',
  '/media/2021/11/20210605_080734-scaled.jpg',
  '/media/2021/10/IMG_9622-scaled.jpg',
  '/media/2021/11/005.jpg',
];

function getFallbackImageForPost(postIndex: number): string {
  return FALLBACK_FEATURED_IMAGES[postIndex % FALLBACK_FEATURED_IMAGES.length] ?? FALLBACK_FEATURED_IMAGES[0];
}

// Always fetch fresh posts (avoid static cache from when DB was empty)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function isConnectionError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /connection|terminated|timeout|ECONNRESET|ECONNREFUSED|P1001|P1017/i.test(msg);
}

interface SearchParams {
  page?: string;
  category?: string;
}

async function loadBlogData(
  where: { status: 'PUBLISHED'; categories?: { some: { slug: string } } },
  page: number,
  limit: number
) {
  const prisma = getPrisma();
  return Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        categories: {
          select: {
            name: true,
            slug: true,
          },
        },
        featuredImage: {
          select: {
            id: true,
            url: true,
            altText: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
    prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED',
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
  ]);
}

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const page = parseInt(searchParams.page || '1');
  const categorySlug = searchParams.category;
  const limit = 12;

  // Build where clause for published posts only
  const where: { status: 'PUBLISHED'; categories?: { some: { slug: string } } } = {
    status: 'PUBLISHED',
  };

  if (categorySlug) {
    where.categories = {
      some: {
        slug: categorySlug,
      },
    };
  }

  type BlogPostItem = Awaited<ReturnType<typeof loadBlogData>>[0][number];
  let posts: BlogPostItem[] = [];
  let totalCount = 0;
  let categories: Awaited<ReturnType<typeof loadBlogData>>[2] = [];
  let draftCount = 0;
  let loadError: string | null = null;

  try {
    const [postsResult, totalCountResult, categoriesResult, draftCountResult] = await loadBlogData(
      where,
      page,
      limit
    );
    posts = postsResult;
    totalCount = totalCountResult;
    categories = categoriesResult;
    draftCount = draftCountResult;
  } catch (err) {
    if (isConnectionError(err)) {
      resetPrismaConnection();
      try {
        const [postsResult, totalCountResult, categoriesResult, draftCountResult] =
          await loadBlogData(where, page, limit);
        posts = postsResult;
        totalCount = totalCountResult;
        categories = categoriesResult;
        draftCount = draftCountResult;
      } catch (retryErr) {
        console.error('Blog page failed after retry:', retryErr);
        loadError = 'The connection to the database was lost or timed out. Please refresh the page or try again in a moment.';
      }
    } else {
      console.error('Blog page failed to load posts:', err);
      loadError = 'Unable to load blog posts. Please try again later.';
    }
  }

  const totalPages = Math.ceil(totalCount / limit);
  const selectedCategory = categorySlug
    ? categories.find(c => c.slug === categorySlug)
    : null;

  const featuredPost = posts[0];

  return (
    <div>
      {/* Stitch-style hero + featured post */}
      <section className="relative bg-white dark:bg-background-dark pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              Insights &amp; <span className="text-primary">Stories</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Explore articles on leadership, personal development, and community impact from the YTOP Global team.
            </p>
          </div>
          {!loadError && featuredPost && (
            <Link href={`/blog/${featuredPost.slug}`} className="block relative rounded-2xl overflow-hidden shadow-lg group">
              <div className="absolute inset-0 h-[500px] md:h-[600px]">
                <Image
                  src={featuredPost.featuredImage?.url ?? getFallbackImageForPost(0)}
                  alt={featuredPost.featuredImage?.altText ?? featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="100vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>
              <div className="relative p-6 md:p-12 lg:p-16 flex flex-col justify-end h-[500px] md:h-[600px] text-white">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Featured Post</span>
                  <span className="text-slate-200 text-sm font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.publishedAt
                      ? new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Draft'}
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-black leading-tight mb-4 group-hover:text-primary transition-colors duration-300">
                  {featuredPost.title}
                </h2>
                {featuredPost.excerpt && (
                  <p className="text-slate-200 text-lg md:text-xl max-w-3xl mb-6 line-clamp-2 md:line-clamp-none">
                    {featuredPost.excerpt.replace(/<[^>]*>/g, '')}
                  </p>
                )}
                {featuredPost.author && (
                  <div className="flex items-center gap-4">
                    {featuredPost.author.image ? (
                      <div className="relative w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
                        <Image src={featuredPost.author.image} alt="" fill className="object-cover" sizes="40px" unoptimized />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full border-2 border-primary bg-white/20 flex items-center justify-center">
                        <span className="text-lg font-bold">{(featuredPost.author.name ?? ' ').charAt(0)}</span>
                      </div>
                    )}
                    <span className="font-bold text-white">{featuredPost.author.name ?? 'Author'}</span>
                  </div>
                )}
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Sticky category pills - stitch style */}
      {!loadError && (
        <div className="sticky top-[73px] z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 py-4 px-4 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex gap-3 min-w-max">
            <Link
              href="/blog"
              className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                !categorySlug ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
              }`}
            >
              All Posts ({totalCount})
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  categorySlug === category.slug ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
                }`}
              >
                {category.name} ({category._count.posts})
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {selectedCategory && (
          <div className="mb-12 p-8 bg-white dark:bg-surface-dark rounded-2xl shadow-ytop border-l-4 border-primary">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {selectedCategory.name}
            </h2>
            {selectedCategory.description && (
              <p className="text-slate-600 dark:text-slate-400">{selectedCategory.description}</p>
            )}
          </div>
        )}

        {/* Load error */}
        {loadError && (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto p-6 bg-white dark:bg-surface-dark rounded-2xl shadow-ytop border border-red-200 dark:border-red-900">
              <p className="text-slate-700 font-medium">{loadError}</p>
              <p className="text-slate-500 text-sm mt-2">To use localhost: add <code className="bg-slate-100 px-1 rounded">DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ytopglobal?schema=public</code> to <code className="bg-slate-100 px-1 rounded">.env</code>, then run <code className="bg-slate-100 px-1 rounded">docker compose up -d</code> and <code className="bg-slate-100 px-1 rounded">npx prisma migrate dev</code>.</p>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {!loadError && posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {(featuredPost ? posts.slice(1) : posts).map((post, postIndex) => (
                <article
                  key={post.id}
                  className="flex flex-col bg-white dark:bg-background-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 group"
                >
                  {/* Featured Image – post’s own image, or rotating fallback so cards differ */}
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        key={`${post.id}-${post.featuredImage?.id ?? postIndex}`}
                        src={post.featuredImage?.url ?? getFallbackImageForPost(postIndex)}
                        alt={post.featuredImage?.altText ?? post.title}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                      />
                      {post.categories.length > 0 && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-sm dark:bg-black/80 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            {post.categories[0].name}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      <time>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Draft'}
                      </time>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    {post.excerpt && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                        {post.excerpt.replace(/<[^>]*>/g, '')}
                      </p>
                    )}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      {post.author?.image ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <Image src={post.author.image} alt="" fill className="object-cover" sizes="32px" unoptimized />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-600 dark:text-slate-300">
                          {post.author?.name?.charAt(0) ?? '?'}
                        </div>
                      )}
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{post.author?.name ?? 'YTOP'}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-3">
                {page > 1 && (
                <Link
                  href={`/blog?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                  className="px-5 py-3 bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:border-primary hover:text-primary border border-slate-200 dark:border-slate-700 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                  Previous
                </Link>
                )}

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Link
                      key={pageNum}
                      href={`/blog?page=${pageNum}${categorySlug ? `&category=${categorySlug}` : ''}`}
                      className={`px-5 py-3 font-semibold rounded-xl transition-all duration-200 shadow-sm cursor-pointer ${
                        page === pageNum
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}

                {page < totalPages && (
                <Link
                  href={`/blog?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                  className="px-5 py-3 bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:border-primary hover:text-primary border border-slate-200 dark:border-slate-700 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                  Next
                </Link>
                )}
              </div>
            )}
          </>
        ) : !loadError ? (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-600 text-lg font-medium">No published posts yet.</p>
              {draftCount > 0 ? (
                <>
                  <p className="text-slate-500 text-sm mt-2">
                    You have {draftCount} draft post{draftCount !== 1 ? 's' : ''}. Publish them in the Admin to see them here.
                  </p>
                  <Link
                    href="/admin/posts"
                    className="mt-6 inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors"
                  >
                    Go to Admin → Posts
                  </Link>
                </>
              ) : (
                <p className="text-slate-500 text-sm mt-2">Check back soon for new content, or create a post in Admin.</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
