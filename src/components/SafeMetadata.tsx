'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useSettings } from '@/contexts/ApiContext';

const SafeMetadata = () => {
  const { settings, seoSettings, analyticsSettings } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !settings) {
    return null;
  }

  // Only use Next.js Script components - no DOM manipulation
  return (
    <>
      {/* Google Analytics */}
      {analyticsSettings?.google_analytics_id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsSettings.google_analytics_id}`}
            strategy="afterInteractive"
          />
          <Script id="ga-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analyticsSettings.google_analytics_id}');
            `}
          </Script>
        </>
      )}

      {/* Facebook Pixel */}
      {analyticsSettings?.facebook_pixel_id && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${analyticsSettings.facebook_pixel_id}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* Structured Data */}
      <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": settings?.siteName || settings?.site_name || 'Website',
          "description": settings?.siteDescription || settings?.site_description || 'Website Description',
          "url": typeof window !== 'undefined' ? window.location.origin : ''
        })}
      </Script>
    </>
  );
};

export default SafeMetadata;