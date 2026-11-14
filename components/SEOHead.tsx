import { Metadata } from 'next';
import { YTOP_SOCIAL_SAME_AS } from '@/lib/ytop-social-urls';
import { siteUrl } from '@/lib/site';

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
  const baseUrl = siteUrl();
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
        url: `${siteUrl()}/logo.png`,
      },
    },
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl()}${post.url}`,
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'YTOP Global',
    alternateName: 'YTOP Youth Empowerment Foundation',
    url: siteUrl(),
    logo: `${siteUrl()}/media/2023/02/YTOP-LOGO.png`,
    foundingDate: '2017',
    identifier: 'RC179444',
    description:
      'YTOP Global empowers young people through leadership development, education, mentorship, capacity building and community engagement in Nigeria and beyond.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'H6, Omole line 4, Omisore Street, Modakeke',
      addressRegion: 'Osun State',
      addressCountry: 'NG',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+2348100218117',
        contactType: 'customer service',
        email: 'info@ytopglobal.org',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'partnerships',
        email: 'admin@ytopglobal.org',
      },
    ],
    sameAs: YTOP_SOCIAL_SAME_AS,
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
      item: `${siteUrl()}${item.url}`,
    })),
  };
}
