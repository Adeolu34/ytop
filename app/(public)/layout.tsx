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
      <SiteBrandingStyle
        brandPrimaryHex={identity.brandPrimaryHex}
        brandSecondaryHex={identity.brandSecondaryHex}
      />
      <Header logoUrl={identity.siteLogoUrl} siteName={identity.siteName} />
      <main className="flex-1">{children}</main>
      <Footer
        logoUrl={identity.siteLogoUrl}
        siteName={identity.siteName}
        siteTagline={identity.siteTagline}
      />
    </div>
  );
}
