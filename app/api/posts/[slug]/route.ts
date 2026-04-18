import { NextRequest, NextResponse } from 'next/server';
import { getMongoDbOr503 } from '@/lib/api-mongo';
import { loadMongoBlogPostWithRelations } from '@/lib/mongo-blog';

export const dynamic = 'force-dynamic';

/**
 * GET /api/posts/[slug]
 *
 * Get a single post by slug with related posts
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const gate = await getMongoDbOr503();
    if (!gate.ok) {
      return gate.response;
    }

    const { slug } = await params;

    const data = await loadMongoBlogPostWithRelations(slug);
    if (!data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    const { post, relatedPosts } = data;
    return NextResponse.json({
      post: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        publishedAt: post.publishedAt,
        viewCount: post.viewCount,
        author: {
          id: post.authorId,
          name: post.author.name,
          email: post.author.email,
          image: post.author.image,
          bio: post.author.bio,
        },
        categories: post.categories.map((c: { id: string; name: string; slug: string }) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: null,
        })),
        tags: post.tags.map((t: { id: string; name: string; slug: string }) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
        })),
        featuredImage: post.featuredImage
          ? {
              id: post.featuredImageId ?? '',
              url: post.featuredImage.url,
              altText: post.featuredImage.altText,
              caption: post.featuredImage.caption,
              width: null,
              height: null,
            }
          : null,
        comments: post.comments,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
      },
      relatedPosts: relatedPosts.map((rp) => ({
        id: rp.id,
        slug: rp.slug,
        title: rp.title,
        categories: rp.categories.map((c) => ({
          id: c.slug,
          name: c.name,
          slug: c.slug,
        })),
        featuredImage: rp.featuredImage
          ? {
              id: null,
              url: rp.featuredImage.url,
              altText: rp.featuredImage.altText,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
