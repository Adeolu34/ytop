import { Metadata } from 'next';

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string;
}

export function generateSEOMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  keywords,
}: SEOHeadProps): Metadata {
  const siteName = 'YTOP Global';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const baseUrl = 'https://ytopglobal.org';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const ogImage = image || `${baseUrl}/og-image.jpg`;

  return {
    title: fullTitle,
    description,
    keywords,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@ytopglobal',
      site: '@ytopglobal',
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

// JSON-LD Structured Data Generators

export function generateBlogPostingSchema(post: {
  title: string;
  description: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  image?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'YTOP Global',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ytopglobal.org/logo.png',
      },
    },
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ytopglobal.org${post.url}`,
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'YTOP Global',
    alternateName: 'Young Talented Optimistic and Potential Organization',
    url: 'https://ytopglobal.org',
    logo: 'https://ytopglobal.org/logo.png',
    description:
      'Empowering young people through leadership development, career guidance, financial education, and community impact initiatives.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Youth Street',
      addressLocality: 'Community City',
      postalCode: '12345',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-234-567-890',
      contactType: 'customer service',
      email: 'info@ytopglobal.org',
    },
    sameAs: [
      'https://facebook.com/ytopglobal',
      'https://twitter.com/ytopglobal',
      'https://linkedin.com/company/ytopglobal',
      'https://instagram.com/ytopglobal',
    ],
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://ytopglobal.org${item.url}`,
    })),
  };
}
