import { MetadataRoute } from 'next';
import prisma from '@/lib/db';
import { buildSitemapEntries } from '@/lib/sitemap';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries({
    baseUrl: 'https://ytopglobal.org',
    fetchPosts: () =>
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
    fetchCategories: () =>
      prisma.category.findMany({
        select: { slug: true },
      }),
    onDynamicDataError(error) {
      console.warn('Falling back to the static sitemap entries.', error);
    },
  });
}
