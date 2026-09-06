import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import Script from "next/script";
import { generateOrganizationSchema } from "@/components/SEOHead";
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
  title: "YTOP Global | Youth Empowerment Foundation - Mission, Vision & Impact",
  description: "YTOP Youth Empowerment Foundation (RC179444) empowers young people through self-discovery, skill acquisition, and mentorship. Our mission: equip youth to create sustainable solutions. Our vision: a global community of great minds driving effective change.",
  metadataBase: new URL("https://ytopglobal.org"),
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
