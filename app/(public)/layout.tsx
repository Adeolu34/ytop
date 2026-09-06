import type { Metadata } from 'next';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import SiteBrandingStyle from '@/components/public/SiteBrandingStyle';
import { getPublicSiteIdentity } from '@/lib/public-site-settings';

export async function generateMetadata(): Promise<Metadata> {
  const identity = await getPublicSiteIdentity();
  return {
    title: {
      default: `${identity.siteName} | Youth Empowerment Foundation`,
      template: `%s | ${identity.siteName}`,
    },
    icons: identity.siteFaviconUrl
      ? { icon: identity.siteFaviconUrl }
      : undefined,
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const identity = await getPublicSiteIdentity();

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:font-bold focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      <SiteBrandingStyle
        brandPrimaryHex={identity.brandPrimaryHex}
        brandSecondaryHex={identity.brandSecondaryHex}
      />
      <Header logoUrl={identity.siteLogoUrl} siteName={identity.siteName} />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer
        logoUrl={identity.siteLogoUrl}
        siteName={identity.siteName}
        siteTagline={identity.siteTagline}
      />
    </div>
  );
}
