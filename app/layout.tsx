import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
