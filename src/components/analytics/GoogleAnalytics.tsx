'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useSettings } from '@/contexts/ApiContext';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GoogleAnalytics = () => {
  const { analyticsSettings, settingsLoading } = useSettings();

  // Get Google Analytics ID from API (support multiple naming conventions)
  const gaId = analyticsSettings?.google_analytics_id || 
               analyticsSettings?.googleAnalyticsId || 
               analyticsSettings?.ga_tracking_id ||
               analyticsSettings?.tracking_id;

  const gtmId = analyticsSettings?.google_tag_manager_id || 
                analyticsSettings?.googleTagManagerId ||
                analyticsSettings?.gtm_id;

  // Check if analytics is enabled (default to true if not explicitly disabled)
  const isEnabled = analyticsSettings?.enable_analytics !== false && 
                   analyticsSettings?.enableAnalytics !== false;

  useEffect(() => {
    // Initialize dataLayer if it doesn't exist
    if (typeof window !== 'undefined' && !window.dataLayer) {
      window.dataLayer = [];
    }
  }, [gaId, gtmId, isEnabled]);

  // Don't render anything if loading or analytics disabled
  if (settingsLoading || !isEnabled) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 (GA4) */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager */}
      {gtmId && (
        <>
          <Script 
            id="google-tag-manager" 
            strategy="afterInteractive"
          >
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
          {/* GTM NoScript fallback */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}
    </>
  );
};

export default GoogleAnalytics;