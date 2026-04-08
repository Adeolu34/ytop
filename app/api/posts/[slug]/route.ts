import { NextRequest, NextResponse } from 'next/server';
import { getPrismaOr503 } from '@/lib/api-prisma';
import { loadMongoBlogPostWithRelations, useMongoForPublicBlog } from '@/lib/mongo-blog';

export const dynamic = 'force-dynamic';

/**
 * GET /api/posts/[slug]
 *
 * Get a single post by slug with related posts
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (useMongoForPublicBlog()) {
      const data = await loadMongoBlogPostWithRelations(slug);
      if (!data) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
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
          categories: post.categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: null,
          })),
          tags: post.tags.map((t) => ({
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
    }

    const pg = await getPrismaOr503();
    if (!pg.ok) {
      return pg.response;
    }
    const prisma = pg.prisma;

    // Get the post
    const post = await prisma.post.findUnique({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        featuredImage: {
          select: {
            id: true,
            url: true,
            altText: true,
            caption: true,
            width: true,
            height: true,
          },
        },
        comments: {
          where: {
            isApproved: true,
            parentId: null, // Only top-level comments
          },
          include: {
            author: {
              select: {
                id: true,
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
                    id: true,
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
          take: 50, // Limit comments
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    // Get related posts (same categories)
    const relatedPosts = await prisma.post.findMany({
      where: {
        id: { not: post.id },
        status: 'PUBLISHED',
        categories: {
          some: {
            id: {
              in: post.categories.map(cat => cat.id),
            },
          },
        },
      },
      include: {
        featuredImage: {
          select: {
            id: true,
            url: true,
            altText: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      take: 3,
      orderBy: {
        publishedAt: 'desc',
      },
    });

    return NextResponse.json({
      post,
      relatedPosts,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
