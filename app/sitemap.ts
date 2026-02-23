import { MetadataRoute } from 'next';
import prisma from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ytopglobal.org';

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/team',
    '/programs',
    '/blog',
    '/contact',
    '/volunteer',
    '/donate',
    '/gallery',
    '/events',
    '/sdg',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Blog posts
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Categories
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/blog?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...postUrls, ...categoryUrls];
}
