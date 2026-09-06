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
import { generateBlogPostingSchema, generateBreadcrumbSchema } from '@/components/SEOHead';

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
    const title = doc.metaTitle || doc.title;
    const description =
      doc.metaDescription ||
      doc.excerpt?.replace(/<[^>]*>/g, '').substring(0, 160) ||
      '';
    const ogImage = doc.featuredImage?.url
      ? [{ url: doc.featuredImage.url, width: 1200, height: 630, alt: title }]
      : [];
    return {
      title,
      description,
      alternates: { canonical: `https://ytopglobal.org/blog/${slug}` },
      openGraph: {
        title,
        description,
        url: `https://ytopglobal.org/blog/${slug}`,
        siteName: 'YTOP Global',
        type: 'article',
        publishedTime: doc.publishedAt?.toISOString(),
        modifiedTime: doc.updatedAt?.toISOString(),
        authors: doc.author?.name ? [doc.author.name] : undefined,
        images: ogImage,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: doc.featuredImage?.url ? [doc.featuredImage.url] : [],
        site: '@ytopglobal',
        creator: '@ytopglobal',
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
      const post = data.post;
      const blogPostingSchema = generateBlogPostingSchema({
        title: post.title,
        description: post.excerpt?.replace(/<[^>]*>/g, '').substring(0, 200) ?? '',
        author: post.author?.name ?? 'YTOP Global',
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : new Date(),
        image: post.featuredImage?.url,
        url: `/blog/${slug}`,
      });
      const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: post.title, url: `/blog/${slug}` },
      ]);
      return (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
          <BlogPostArticle post={post} relatedPosts={data.relatedPosts} />
        </>
      );
    }
    notFound();
  } catch (e) {
    resetMongoConnection();
    console.error('Mongo blog post load failed:', e);
    return <BlogPostDbUnavailable mongoPublicBlog={mongoPublicBlog} />;
  }
}
