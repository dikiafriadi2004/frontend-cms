import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ApiProvider } from '@/contexts/ApiContext';
import { AdsProvider } from '@/contexts/AdsContext';
import SafeMetadata from '@/components/SafeMetadata';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Analytics } from '@/components/analytics';
import ClientNavigation from '@/components/ClientNavigation';

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Hide all Next.js development indicators */
            #__next-build-watcher,
            .__next-dev-overlay,
            .__next-dev-overlay-backdrop,
            [data-nextjs-scroll-focus-boundary],
            [data-nextjs-dialog-overlay],
            [data-nextjs-toast],
            [data-overlay],
            [data-nextjs-dev-overlay],
            #__next-dev-overlay,
            .nextjs-portal,
            [id*="nextjs"],
            [class*="nextjs"],
            [data-testid*="nextjs"],
            [data-turbopack],
            [class*="turbopack"],
            [id*="turbopack"],
            /* Hide build activity indicator */
            [data-nextjs-build-indicator],
            .__next-build-indicator,
            #__next-build-indicator,
            [class*="build-indicator"],
            [id*="build-indicator"],
            /* Hide development mode indicators */
            [data-dev-overlay],
            [class*="dev-overlay"],
            [id*="dev-overlay"],
            /* Hide Next.js logo in bottom left corner */
            [data-nextjs-dev-overlay-backdrop],
            [data-nextjs-dev-overlay],
            div[style*="position: fixed"][style*="bottom: 0"][style*="left: 0"],
            div[style*="position: fixed"][style*="bottom"][style*="left"],
            div[style*="position: fixed"][style*="bottom"][style*="right"],
            /* Hide any floating development elements */
            div[style*="position: fixed"][style*="z-index: 99999"],
            div[style*="position: fixed"][style*="z-index: 9999"],
            /* Hide Turbopack indicators */
            [data-turbopack-dev-overlay],
            [class*="turbopack-dev"],
            [id*="turbopack-dev"],
            /* Hide webpack HMR indicators */
            [data-webpack-dev-overlay],
            [class*="webpack-dev"],
            /* Hide React DevTools */
            [data-react-devtools],
            /* Hide any development watermarks */
            div[style*="watermark"],
            [class*="watermark"],
            /* Specific selectors for Next.js 13+ indicators */
            .__next,
            #__next > div[style*="position: fixed"],
            body > div[style*="position: fixed"][style*="bottom"],
            /* Hide development server indicators */
            [data-dev-server],
            [class*="dev-server"] {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
              z-index: -9999 !important;
              position: absolute !important;
              left: -9999px !important;
              top: -9999px !important;
              width: 0 !important;
              height: 0 !important;
              overflow: hidden !important;
            }
            
            /* Additional CSS to prevent any development indicators from showing */
            body::after,
            html::after {
              content: none !important;
            }
            
            /* Hide any iframe development tools */
            iframe[src*="localhost"],
            iframe[src*="dev"],
            iframe[data-dev] {
              display: none !important;
            }
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ApiProvider>
            <AdsProvider>
              <SafeMetadata />
              <Analytics />
              <ClientNavigation />
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