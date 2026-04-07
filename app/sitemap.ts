import { MetadataRoute } from 'next';
import { isDatabaseConfigured } from '@/lib/db-config';
import { buildSitemapEntries } from '@/lib/sitemap';
import {
  mongoListPostsForSitemap,
  useMongoForPublicBlog,
} from '@/lib/mongo-blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries({
    baseUrl: 'https://ytopglobal.org',
    fetchPosts: async () => {
      if (useMongoForPublicBlog()) {
        return mongoListPostsForSitemap();
      }
      if (!isDatabaseConfigured()) {
        return [];
      }
      const { default: prisma } = await import('@/lib/db');
      return prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          slug: true,
          updatedAt: true,
        },
      });
    },
    fetchCategories: async () => {
      if (!isDatabaseConfigured()) {
        return [];
      }
      const { default: prisma } = await import('@/lib/db');
      return prisma.category.findMany({
        select: { slug: true },
      });
    },
    onDynamicDataError(error) {
      console.warn('Falling back to the static sitemap entries.', error);
    },
  });
}
