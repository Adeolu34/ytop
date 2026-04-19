import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Calendar,
  Eye,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import CommentSection from '@/components/blog/CommentSection';
import BlogArticleListenPlayer from '@/components/blog/BlogArticleListenPlayer';

export const DEFAULT_BLOG_FEATURED_IMAGE =
  '/media/2021/10/IMG_9658-scaled.jpg';

type CommentThread = {
  id: string;
  content: string;
  authorName: string | null;
  createdAt: string;
  author: { name: string | null; image: string | null } | null;
  replies: Array<{
    id: string;
    content: string;
    authorName: string | null;
    createdAt: string;
    author: { name: string | null; image: string | null } | null;
  }>;
};

type PostForArticle = {
  id: string;
  slug: string;
  title: string;
  content: string;
  publishedAt: Date | null;
  viewCount: number;
  author: {
    name: string | null;
    image: string | null;
    email: string | null;
    bio: string | null;
  } | null;
  categories: { slug: string; name: string }[];
  tags: { slug: string; name: string }[];
  featuredImage: {
    url: string;
    altText: string | null;
    caption: string | null;
  } | null;
  comments: Array<{
    id: string;
    content: string;
    authorName: string | null;
    createdAt: Date;
    author: { name: string | null; image: string | null } | null;
    replies: Array<{
      id: string;
      content: string;
      authorName: string | null;
      createdAt: Date;
      author: { name: string | null; image: string | null } | null;
    }>;
  }>;
};

type RelatedForArticle = {
  id: string;
  slug: string;
  title: string;
  categories: { name: string; slug: string }[];
  featuredImage: { url: string; altText: string | null } | null;
};

export default function BlogPostArticle({
  post,
  relatedPosts,
}: {
  post: PostForArticle;
  relatedPosts: RelatedForArticle[];
}) {
  const commentThreads: CommentThread[] = post.comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    authorName: comment.authorName,
    createdAt: comment.createdAt.toISOString(),
    author: comment.author,
    replies: comment.replies.map((reply) => ({
      id: reply.id,
      content: reply.content,
      authorName: reply.authorName,
      createdAt: reply.createdAt.toISOString(),
      author: reply.author,
    })),
  }));

  const commentCount = commentThreads.reduce(
    (total, comment) => total + 1 + comment.replies.length,
    0
  );

  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Draft';

  return (
    <div className="relative overflow-hidden pb-20">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(239,68,68,0.12),transparent_50%),radial-gradient(ellipse_80%_50%_at_100%_50%,rgba(30,58,138,0.08),transparent_45%),linear-gradient(to_bottom,#f8fafc,#ffffff)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(239,68,68,0.15),transparent_50%),linear-gradient(to_bottom,#0f172a,#0f172a)]"
        aria-hidden
      />

      <div className="container mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-sm transition hover:border-primary/30 hover:text-primary dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-primary/40"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
          Back to stories
        </Link>
      </div>

      <article className="container mx-auto max-w-4xl px-4 sm:px-6">
        {post.categories.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog?category=${category.slug}`}
                className="inline-flex items-center rounded-full bg-gradient-to-r from-[#ba0013]/10 to-[#1E3A8A]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ba0013] ring-1 ring-[#ba0013]/20 transition hover:from-[#ba0013]/20 hover:to-[#1E3A8A]/15 dark:from-red-500/20 dark:to-blue-500/20 dark:text-red-300 dark:ring-red-500/30"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        <header className="mt-6 text-center sm:mt-10">
          <h1 className="font-display text-4xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-[3.25rem]">
            {post.title}
          </h1>

          <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-black/20 sm:p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-6">
              {post.author && (
                <div className="flex items-center gap-4">
                  {post.author.image ? (
                    <Image
                      src={post.author.image}
                      alt={post.author.name ? `${post.author.name} portrait` : ''}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-md dark:ring-slate-700"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ba0013] to-[#e31e24] text-lg font-bold text-white shadow-md">
                      {(post.author.name || '?').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Written by
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {post.author.name || 'YTOP Global'}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                  <Calendar className="h-4 w-4 text-primary" />
                  {publishedLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                  <Eye className="h-4 w-4 text-secondary" />
                  {post.viewCount.toLocaleString()} views
                </span>
                <Link
                  href="#comments"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 transition hover:bg-primary/10 hover:text-primary dark:bg-slate-800 dark:hover:bg-primary/20"
                >
                  <MessageSquare className="h-4 w-4" />
                  {commentCount} comment{commentCount === 1 ? '' : 's'}
                </Link>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 dark:border-slate-700">
              <BlogArticleListenPlayer
                title={post.title}
                htmlContent={post.content}
              />
            </div>
          </div>
        </header>

        <div className="relative mt-12 overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-300/50 ring-1 ring-slate-900/5 dark:shadow-black/40 dark:ring-white/10">
          <div className="relative aspect-[21/9] min-h-[240px] w-full sm:aspect-[2/1] md:min-h-[320px]">
            <Image
              src={post.featuredImage?.url || DEFAULT_BLOG_FEATURED_IMAGE}
              alt={post.featuredImage?.altText || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
          </div>
          {post.featuredImage?.caption ? (
            <p className="border-t border-white/10 bg-slate-900/80 px-6 py-3 text-center text-sm text-slate-200 backdrop-blur-sm">
              {post.featuredImage.caption}
            </p>
          ) : null}
        </div>

        <div
          className="blog-post-content prose prose-lg prose-slate mt-12 max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-blockquote:border-l-primary prose-blockquote:bg-slate-50 prose-blockquote:py-1 dark:prose-blockquote:bg-slate-800/50"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-3 border-y border-slate-200 py-8 dark:border-slate-700">
            <Sparkles className="h-5 w-5 shrink-0 text-amber-500" aria-hidden />
            {post.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/blog?tag=${tag.slug}`}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-primary/10 hover:text-primary dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-primary/20"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {post.author?.bio ? (
          <aside className="relative mt-12 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-8 dark:border-slate-700 dark:from-slate-900 dark:to-slate-900/80">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/5 blur-2xl" />
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              About the author
            </h3>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
              {post.author.bio}
            </p>
          </aside>
        ) : null}

        <CommentSection
          postId={post.id}
          postSlug={post.slug}
          comments={commentThreads}
        />
      </article>

      {relatedPosts.length > 0 ? (
        <div className="container mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Keep reading
            </p>
            <h2 className="font-display mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
              Related stories
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <article
                key={relatedPost.id}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-200/60 ring-1 ring-slate-200/60 transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:shadow-black/30 dark:ring-slate-700"
              >
                <Link href={`/blog/${relatedPost.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={
                        relatedPost.featuredImage?.url || DEFAULT_BLOG_FEATURED_IMAGE
                      }
                      alt={
                        relatedPost.featuredImage?.altText || relatedPost.title
                      }
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-90 transition group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      {relatedPost.categories.length > 0 ? (
                        <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                          {relatedPost.categories[0].name}
                        </span>
                      ) : null}
                      <h3 className="font-display text-lg font-bold leading-snug text-white drop-shadow-sm line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
