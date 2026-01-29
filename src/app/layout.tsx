import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ApiProvider } from '@/contexts/ApiContext';
import { AdsProvider } from '@/contexts/AdsContext';
import DynamicMetadata from '@/components/SEO/DynamicMetadata';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Analytics } from '@/components/analytics';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// This will be overridden by individual page metadata
export const metadata: Metadata = {
  title: "Loading...",
  description: "Loading...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ApiProvider>
            <AdsProvider>
              <DynamicMetadata />
              <Analytics />
              <Header />
              {children}
              <Footer />
            </AdsProvider>
          </ApiProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}