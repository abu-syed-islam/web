import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { COMPANY_NAME, SITE_DESCRIPTION } from "@/constants/company";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/ui/footer-section";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: COMPANY_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: COMPANY_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: COMPANY_NAME,
    description: SITE_DESCRIPTION,
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.08),transparent_25%)]">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
