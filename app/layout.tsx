import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import Script from "next/script";
import { generateOrganizationSchema } from "@/components/SEOHead";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const fontDisplay = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const fontBody = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YTOP Global | Youth Empowerment, Leadership and Community Development",
  description: "YTOP Global empowers young people through leadership development, education, mentorship, capacity building and community engagement in Nigeria and beyond.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ytop.netlify.app'),
  icons: {
    icon: [
      { url: '/media/2023/02/YTOP-LOGO.png', type: 'image/png' },
    ],
    shortcut: '/media/2023/02/YTOP-LOGO.png',
    apple: '/media/2023/02/YTOP-LOGO.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }}
        />
      </head>
      <body className="font-body antialiased">
        {children}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
