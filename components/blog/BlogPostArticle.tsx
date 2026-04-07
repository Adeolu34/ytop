import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, MessageSquare, Tag } from 'lucide-react';
import CommentSection from '@/components/blog/CommentSection';

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

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>

      <article className="container mx-auto px-4 max-w-4xl">
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

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {post.title}
        </h1>

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

          <Link
            href="#comments"
            className="flex items-center gap-2 transition hover:text-blue-600"
          >
            <MessageSquare className="w-5 h-5" />
            <span>
              {commentCount} comment{commentCount === 1 ? '' : 's'}
            </span>
          </Link>
        </div>

        <div className="mb-12">
          <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage?.url || DEFAULT_BLOG_FEATURED_IMAGE}
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

        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

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

        {post.author?.bio && (
          <div className="mb-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-2">About the Author</h3>
            <p className="text-gray-700">{post.author.bio}</p>
          </div>
        )}

        <CommentSection
          postId={post.id}
          postSlug={post.slug}
          comments={commentThreads}
        />
      </article>

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
                      src={relatedPost.featuredImage?.url || DEFAULT_BLOG_FEATURED_IMAGE}
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
