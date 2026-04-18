import { MetadataRoute } from 'next';
import { isMongoConfigured } from '@/lib/mongodb';
import { buildSitemapEntries } from '@/lib/sitemap';
import {
  mongoAggregateCategories,
  mongoListPostsForSitemap,
} from '@/lib/mongo-blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries({
    baseUrl: 'https://ytopglobal.org',
    fetchPosts: async () => {
      if (!isMongoConfigured()) {
        return [];
      }
      return mongoListPostsForSitemap();
    },
    fetchCategories: async () => {
      if (!isMongoConfigured()) {
        return [];
      }
      const cats = await mongoAggregateCategories();
      return cats.map((c) => ({ slug: c.slug }));
    },
    onDynamicDataError(error) {
      console.warn('Falling back to the static sitemap entries.', error);
    },
  });
}
