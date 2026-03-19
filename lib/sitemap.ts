import type { MetadataRoute } from 'next';

type SitemapEntry = MetadataRoute.Sitemap[number];

type DynamicPost = {
  slug: string;
  updatedAt: Date;
};

type DynamicCategory = {
  slug: string;
};

type BuildSitemapEntriesOptions = {
  baseUrl: string;
  fetchPosts: () => Promise<DynamicPost[]>;
  fetchCategories: () => Promise<DynamicCategory[]>;
  now?: Date;
  onDynamicDataError?: (error: unknown) => void;
};

const STATIC_ROUTES = [
  '',
  '/about',
  '/team',
  '/programs',
  '/programs/project-300',
  '/programs/rise-of-warriors',
  '/blog',
  '/contact',
  '/donate',
  '/gallery',
  '/events',
  '/get-involved',
  '/get-involved/campus-ambassadors',
  '/get-involved/partner',
  '/get-involved/sponsor',
  '/impact',
  '/privacy',
  '/terms',
  '/site-map',
];

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export function buildStaticSitemapEntries(
  baseUrl: string,
  now: Date = new Date()
): MetadataRoute.Sitemap {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  return STATIC_ROUTES.map((route) => ({
    url: `${normalizedBaseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}

export async function buildSitemapEntries({
  baseUrl,
  fetchPosts,
  fetchCategories,
  now = new Date(),
  onDynamicDataError,
}: BuildSitemapEntriesOptions): Promise<MetadataRoute.Sitemap> {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const staticEntries = buildStaticSitemapEntries(normalizedBaseUrl, now);

  try {
    const [posts, categories] = await Promise.all([
      fetchPosts(),
      fetchCategories(),
    ]);

    const postEntries: SitemapEntry[] = posts.map((post) => ({
      url: `${normalizedBaseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    const categoryEntries: SitemapEntry[] = categories.map((category) => ({
      url: `${normalizedBaseUrl}/blog?category=${category.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    }));

    return [...staticEntries, ...postEntries, ...categoryEntries];
  } catch (error) {
    onDynamicDataError?.(error);
    return staticEntries;
  }
}
