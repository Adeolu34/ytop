import { MetadataRoute } from 'next';
import prisma, { isDatabaseConfigured } from '@/lib/db';
import { buildSitemapEntries } from '@/lib/sitemap';
import {
  mongoListPostsForSitemap,
  useMongoForPublicBlog,
} from '@/lib/mongo-blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries({
    baseUrl: 'https://ytopglobal.org',
    fetchPosts: () =>
      useMongoForPublicBlog()
        ? mongoListPostsForSitemap()
        : isDatabaseConfigured()
          ? prisma.post.findMany({
              where: { status: 'PUBLISHED' },
              select: {
                slug: true,
                updatedAt: true,
              },
            })
          : Promise.resolve([]),
    fetchCategories: () =>
      isDatabaseConfigured()
        ? prisma.category.findMany({
            select: { slug: true },
          })
        : Promise.resolve([]),
    onDynamicDataError(error) {
      console.warn('Falling back to the static sitemap entries.', error);
    },
  });
}
