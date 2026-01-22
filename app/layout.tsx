import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { COMPANY_NAME, SITE_DESCRIPTION } from "@/constants/company";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/ui/footer-section";
import { ThemeProvider } from "@/components/theme-provider";
import { OrganizationStructuredData, WebSiteStructuredData } from "@/components/structured-data";
import { ConditionalNavbarFooter } from "@/components/conditional-navbar-footer";
import React from "react";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: COMPANY_NAME,
    template: `%s | ${COMPANY_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["web development", "Next.js", "React", "TypeScript", "web design", "SaaS development"],
  authors: [{ name: COMPANY_NAME }],
  creator: COMPANY_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: COMPANY_NAME,
    title: COMPANY_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: COMPANY_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: COMPANY_NAME,
    description: SITE_DESCRIPTION,
    images: [`${siteUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <OrganizationStructuredData />
        <WebSiteStructuredData />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Skip to main content
          </a>
          <ConditionalNavbarFooter navbar={<Navbar />} footer={<Footer />}>
            <main id="main-content" className="flex-1">{children}</main>
          </ConditionalNavbarFooter>
        </ThemeProvider>
      </body>
    </html>
  );
}
