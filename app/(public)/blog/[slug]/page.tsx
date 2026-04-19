import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BlogPostArticle from '@/components/blog/BlogPostArticle';
import {
  loadMongoBlogPostWithRelations,
  mongoFindPostBySlug,
  mongoListAllPublishedSlugs,
  useMongoForPublicBlog,
} from '@/lib/mongo-blog';
import { resetMongoConnection } from '@/lib/mongodb';

/** CDN ISR for prerendered post pages — lib/public-page-config.ts */
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    if (!useMongoForPublicBlog()) {
      return [];
    }
    const slugs = await mongoListAllPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
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
    if (!useMongoForPublicBlog()) {
      return {};
    }
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
  } catch {
    return {};
  }
}

function BlogPostDbUnavailable({
  mongoPublicBlog,
}: {
  mongoPublicBlog: boolean;
}) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Unable to load this post
        </h1>
        <p className="text-slate-600 mb-4">
          The connection to the database was lost or timed out. This can happen
          after the app has been idle, or if no database is set up yet.
        </p>
        <p className="text-slate-500 text-sm mb-6">
          {mongoPublicBlog ? (
            <>
              Confirm <code className="bg-slate-100 px-1 rounded">MONGODB_URI</code>{' '}
              is set and Atlas allows connections from this host.
            </>
          ) : (
            <>
              Set <code className="bg-slate-100 px-1 rounded">MONGODB_URI</code> to
              enable the blog.
            </>
          )}
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mongoPublicBlog = useMongoForPublicBlog();

  if (!mongoPublicBlog) {
    return <BlogPostDbUnavailable mongoPublicBlog={false} />;
  }

  try {
    const data = await loadMongoBlogPostWithRelations(slug);
    if (data) {
      return (
        <BlogPostArticle post={data.post} relatedPosts={data.relatedPosts} />
      );
    }
    notFound();
  } catch (e) {
    resetMongoConnection();
    console.error('Mongo blog post load failed:', e);
    return <BlogPostDbUnavailable mongoPublicBlog={mongoPublicBlog} />;
  }
}
